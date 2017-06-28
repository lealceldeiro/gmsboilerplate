package security

import command.SearchCommand
import command.file.FileUploadCommand
import command.security.user.UserCommand
import exceptions.GenericException
import exceptions.NotFoundException
import exceptions.ValidationsException
import grails.transaction.Transactional
import org.apache.commons.fileupload.FileItem
import org.apache.commons.fileupload.disk.DiskFileItem
import subscriber.BEmailVerificationToken
import file.EFile

@Transactional
class UserService {

    def configurationService

    def roleService

    def ownedEntityService

    def emailSenderService

    def tokenGeneratorService

    def fileManagerService

    //region CRUD
    /**
     * Search a user(s) according to optional parameters
     * @param cmd       [optional] Grails command containing the parameters for searching the user(s)
     *                  q: Criteria for searching
     * @param params    [optional] Parameters for paging the result
     * @return          A json containing a list of users with the following structure if the operation was successful
     * <p><code>{success: true|false, items:[<it1>,...,<itn>], total: <totalCount>}</code></p>
     */
    def search(SearchCommand cmd, Map params) {
        Map response = [:]

        def list = EUser.createCriteria().list(params) {
            order("enabled", "desc")
            order("username", "asc")
            order("name", "asc")
            order("email", "asc")
            if(cmd.q) {
                or{
                    ilike("username", "%${cmd.q}%")
                    ilike("email", "%${cmd.q}%")
                    ilike("name", "%${cmd.q}%")
                }
            }

        }

        def mapped = []
        list.each {
            mapped << [id: it.id, username: it.username, email: it.email, name: it.name, enabled: it.enabled]
        }

        response.items = mapped
        response.total = list.totalCount
        return response
    }

    /**
     * Creates or updates a User
     * @param cmd User data such: label(string), description(string) and enabled(boolean)
     * @param id [optional] if an update is going to be performed, the id of the user which is going to be updated
     * must be supplied
     * @param doNotUpdateRoles Whether roles should not be update or they do. If false roles are updates according to
     * roles parameters. If true, roles are not updates regardless the roles parameters. Default value: false (roles will be updated)
     * @return A json containing the id of the user if the operation was successful
     * <p><code>{success: true|false, id: <userId>}</code></p>
     */
    def save(UserCommand cmd, Long id = null, Boolean doNotUpdateRoles = false) {
        EUser aux  = cmd()
        boolean update = true
        boolean error = false

        //editing
        if(id){
            aux = EUser.get(id)
            if(aux) {
                //mandatory fields, but if not provided, then not changed
                if (cmd.username != null) { aux.username = cmd.username }
                if (cmd.name != null) { aux.name = cmd.name }
                if (cmd.password != null) { aux.password = cmd.password }
                if (cmd.emailVerified != null) { aux.emailVerified = cmd.emailVerified }
                aux.email = cmd.email
                aux.enabled = cmd.enabled
            }
            else { throw new NotFoundException("general.not_found" ,"security.user.user", true) }
        }
        //creating
        else {
            if(aux.validate()) { update = false }
            else { throw new ValidationsException() }
        }

        //save before adding roles relationships
        aux.save flush: true

        //set the corresponding roles to the user
        int s2, s = cmd.roles != null ? cmd.roles.size() : 0
        def oEntity
        def role

        if(update) {
            if(cmd.roles != null && !doNotUpdateRoles) {
                if (!cmd.roles.isEmpty()) {
                    //update (add/delete) roles
                    int rS = cmd.roles.size(), orS, nrS
                    List<BRole> oldRolesAux, notPresent, rolesToBeAdded
                    BRole rToBeAssigned
                    EOwnedEntity oEntityToBeAssigned

                    for (int i = 0; i < rS; i++) {
                        oEntityToBeAssigned = EOwnedEntity.get(cmd.roles[i].entity)

                        if (!oEntityToBeAssigned) {
                            error = true
                        } else {
                            oldRolesAux = BUser_Role_OwnedEntity.getRolesByUserByOwnedEntity(aux.id, cmd.roles[i].entity) as List<BRole>
                            orS = oldRolesAux.size()
                            //there were roles previously assigned to this user on this entity
                            if (orS > 0) {
                                /*remove those which are not present now and were present before*/
                                if (cmd.roles[i].roles.size() < 1) { //(entity come with an empty array of roles)
                                    BUser_Role_OwnedEntity.removeAllRolesFrom(aux, oEntityToBeAssigned)
                                } else {
                                    notPresent = getNotPresent(cmd.roles[i].roles, oldRolesAux)
                                    if (!notPresent.isEmpty()) {
                                        BUser_Role_OwnedEntity.removeRoles(aux, notPresent, oEntityToBeAssigned)
                                    }
                                }
                                //put new roles
                                rolesToBeAdded = getNewRoles(cmd.roles[i].roles, oldRolesAux)
                                int l = rolesToBeAdded.size()
                                if (l > 0) {
                                    for (int j = 0; j < l; j++) {
                                        BUser_Role_OwnedEntity.addRole(aux, rolesToBeAdded[j], oEntityToBeAssigned)
                                    }
                                }
                            }
                            //there were no roles assigned to this user on this entity previously
                            else {
                                nrS = cmd.roles[i].roles.size()
                                if (nrS > 0) { //new roles are being assigned now
                                    for (int j = 0; j < nrS; j++) {
                                        rToBeAssigned = BRole.get(cmd.roles[i].roles[j])
                                        if (!rToBeAssigned) {
                                            error = true
                                        } else {
                                            BUser_Role_OwnedEntity.addRole(aux, rToBeAssigned, oEntityToBeAssigned)
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                //delete all roles
                else {
                    BUser_Role_OwnedEntity.removeAllRolesFromAll(aux)
                }
            }
        }
        else { //create new user
            for(int i = 0; i < s; i++) {
                oEntity = EOwnedEntity.get(cmd.roles[i].entity)
                if(!oEntity){
                    error = true
                } else {
                    s2 = cmd.roles[i].roles.size()
                    for (int j = 0; j < s2; j++) {
                        role = BRole.get(cmd.roles[i].roles[j])
                        if(!role){
                            error = true
                        }
                        else {
                            BUser_Role_OwnedEntity.addRole(aux, role, oEntity)
                        }
                    }
                }
            }
        }

        if(error) { throw new GenericException("general.exception.error_on_resources") }

        return aux
    }

    def updateProfilePicture(FileUploadCommand cmd){
        Boolean err = false
        if(cmd.validate() && cmd.isValid()) {
            EUser user = EUser.get(cmd.userId)
            if(user) {
                if(cmd.files) {
                    for(int i = 0; i < cmd.files.size(); i++) {
                        if(!fileManagerService.saveFile(cmd.files.get(i), user, EFile.PROFILE_PICTURE, cmd.fileNames?.get(i))){
                            err = true
                        }
                    }
                    return !err
                }
                return false
            }
            else throw new NotFoundException("general.not_found" ,"security.user.userCamel", true)
        }
        else { throw new ValidationsException()}
    }

    private static List<BRole> getNotPresent(List<Long> roleIds, List<BRole> oldRoles) {
        List<BRole> r = []
        BRole oldRole
        int s = oldRoles.size() - 1
        while (s >= 0) {
            oldRole = oldRoles.get(s--)
            if(!roleIds.contains(oldRole.id)){
                r << oldRole
            }
        }
        return r
    }

    private static List<BRole> getNewRoles(List<Long> roleIds, List<BRole> oldRoles) {
        List<BRole> r = []
        Integer idx, s = roleIds.size() - 1

        while (s >= 0) {
            idx = oldRoles.findIndexOf {it.id == roleIds[s]}
            if(idx == -1) {
                r.add(BRole.get(roleIds[s]))
            }
            s--
        }
        return r
    }

    /**
     * Shows some User's info
     * @param id Identifier of the user that is going to be shown
     * @return The user's info or false if none user is found
     */
    def show (Long id){
        def e = Optional.ofNullable(EUser.get(id))
        if(e.isPresent()){
            def i = e.value
            if(i){ return [username: i.username, email: i.email, name: i.name, enabled: i.enabled] }
        }
        else throw new NotFoundException("general.not_found" ,"security.user.userCamel", true)
    }

    /**
     * Shows some User's info
     * @param params Params with the fields of the user entity that are going to be used for filtering the result: 'username' or 'emails'
     * @return The user's info
     */
    def getBy (Map params = [:], Boolean silenceNotFoundException = false){
        def e = EUser.createCriteria().get {
            or {
                if(params.username != null) {
                    eq("username", params.username)
                }
                if(params.email != null) {
                    eq("email", params.email)
                }
            }
        }
        if(e) { return [id: e.id, username: e.username, email: e.email, name: e.name, enabled: e.enabled, emailVerificationToken: e.emailVerificationToken] }
        else if(!silenceNotFoundException) throw new NotFoundException("general.not_found" ,"security.user.user", true)
        else return null
    }

    EUser findByUsername(String username){
        EUser u  = EUser.findByUsername(username)
        if(!u){ throw new NotFoundException("general.not_found" ,"security.user.user", true) }
        else return u
    }

    /**
     * Deletes some user's info
     * @param id Identifier of the user that is going to be deleted
     * @return <code>true</code> or <code>false</code> depending on the result of the operation
     */
    def delete(Long id) {
        def e = EUser.get(id)
        if(e){
            BUser_Role_OwnedEntity.removeAllRolesFromAll(e)
            configurationService.deleteUserConfiguration(id)
            e.delete()
            return true
        }
        else throw new NotFoundException("general.not_found" ,"security.user.user", true)
    }
    //endregion

    /**
     * Returns all roles associated to a user
     * @param uid User's id
     * @param eid Owned entity's id over the roles are assigned to this user
     * @param params [optional] Parameters for paging the result
     * @return A json containing a list of roles with the following structure if the operation was successful
     * <p><code>{success: true|false, items:[<it1>,...,<itn>], total: <totalCount>}</code></p>
     */
    def roles(Long uid, Long eid, Map params){
        def e = EOwnedEntity.get(eid)
        if(!e){ throw new NotFoundException("general.not_found" ,"security.user.user", true) }
        Map response = [:]
        def mapped = []
        def list = BUser_Role_OwnedEntity.getRolesByUserByOwnedEntity(uid, eid, params)
        list.each{
            mapped << [id: it.id, label: it.label, description: it.description, enabled: it.enabled]
        }

        response.items = mapped
        response.total = list.totalCount ? list.totalCount : 0
        return response
    }

    List<EUser> getDefaultAdminWithId(Long id){
        def list = EUser.createCriteria().list() {
            eq("username", "admin")
            eq("id", id)
        }

        def mapped = []
        list.each {
            mapped << [id: it.id, username: it.username, email: it.email, name: it.name, enabled: it.enabled]
        }

        return mapped as List<EUser>
    }

    def createDefaultUser(){
        EUser u = new EUser(email: 'admin@default.com', name: 'Admin', username: 'admin', password: 'admin', enabled: true)
        u.save(flush: true, failOnError: true)

        return u
    }

    def addDefaultRoleToUser(Object u, Object oe){
        def r = BRole.findByLabel('ROLE_ADMIN')
        if(r){
            BUser_Role_OwnedEntity.addRole((u as EUser), (r as BRole), (oe as EOwnedEntity))
        }
    }

    def activate(Long id, Boolean activate = true){
        final EUser e = EUser.get(id)
        if(!e){
            throw new NotFoundException("general.not_found" ,"security.user.user", true)
        }
        else{
            e.enabled = activate
            e.save(flush: true, failOnError: true)
            return e
        }
    }

    def registerSubscriber(UserCommand cmd, String emailVerificationSubject, String emailVerificationText,
                           String emailVerificationBtnText, String confirmBaseUrl){
        cmd.emailVerified = false
        cmd.enabled = false
        def u = save(cmd)
        BRole subscriberRole = roleService.getDefaultSubscriberRole()
        if(subscriberRole == null) {
            roleService.createDefaultSubscriberRole()
        }
        EOwnedEntity oe = ownedEntityService.getDefaultOwnedEntity()
        BUser_Role_OwnedEntity.addRole(u, subscriberRole, oe)

        return sendSubscription(u, emailVerificationSubject, emailVerificationText, emailVerificationBtnText, confirmBaseUrl)
    }

    def requestNewVerificationEmail(String email, String emailVerificationSubject, String emailVerificationText,
                                    String emailVerificationBtnText, String confirmBaseUrl) {
        EUser u = EUser.findByEmail(email)
        if(u) {
            BEmailVerificationToken evt = u.emailVerificationToken
            if(evt){
                u.emailVerificationToken = null
                u.save flush: true
                evt.delete()
            }
            return sendSubscription(u, emailVerificationSubject, emailVerificationText, emailVerificationBtnText, confirmBaseUrl)
        }
        else { throw new NotFoundException("subscription.email.not.found") }
    }

    private def sendSubscription(EUser u, String emailVerificationSubject, String emailVerificationText,
                                 String emailVerificationBtnText, String confirmBaseUrl){
        String token = tokenGeneratorService.getTokenFor(u.username)

        BEmailVerificationToken evt = new BEmailVerificationToken(token: token)
        u.emailVerificationToken = evt
        evt.user = u

        Integer MAX = 5
        while (!evt.validate() && MAX-- > 0) {
            evt.token = tokenGeneratorService.getTokenFor(u.username)
        }
        if(evt.validate()) {
            u.save(flush: true, failOnError: true)
            emailSenderService.sendSubscriptionVerification(u.email, emailVerificationSubject, emailVerificationText,
                    emailVerificationBtnText, confirmBaseUrl + token)

            return u
        }
        return null
    }
}
