package security

import command.SearchCommand
import command.security.user.UserCommand
import grails.transaction.Transactional
import mapping.security.RoleBean
import mapping.security.UserBean

@Transactional
class UserService {

    def configurationService

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
            mapped << new UserBean(id: it.id, username: it.username, email: it.email, name: it.name, enabled: it.enabled)
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
     * @return A json containing the id of the user if the operation was successful
     * <p><code>{success: true|false, id: <userId>}</code></p>
     */
    def save(UserCommand cmd, long id) {
        EUser aux  = cmd()
        boolean update = true
        boolean error = false

        //editing
        if(id){
            aux = EUser.get(id)
            if(aux) {
                //mandatory fields, but if not provided, then not changed
                if (cmd.username != null) {
                    aux.username = cmd.username
                }
                if (cmd.name != null) {
                    aux.name = cmd.name
                }
                if (cmd.password != null) {
                    aux.password = cmd.password
                }
                aux.email = cmd.email
                aux.enabled = cmd.enabled
            }
            else {
                //todo: inform error
                return false
            }
        }
        //creating
        else {
            if(aux.validate()) {
                update = false
            }
            else {
                return false
                //todo: inform error
            }
        }

        //save before adding roles relationships
        aux.save flush: true

        //set the corresponding roles to the user
        int s2, s = cmd.roles.size()
        def oEntity
        def role

        if(update) {
            if(!cmd.roles.isEmpty()) {
                //update (add/delete) roles
                int rS = cmd.roles.size(), orS, nrS
                List<BRole> oldRolesAux, notPresent, rolesToBeAdded
                BRole rToBeAssigned
                EOwnedEntity oEntityToBeAssigned

                for(int i = 0; i < rS; i++){
                    oEntityToBeAssigned = EOwnedEntity.get(cmd.roles[i].entity)

                    if(!oEntityToBeAssigned) { error = true } else {
                        oldRolesAux = BUser_Role_OwnedEntity.getRolesByUserByOwnedEntity(aux.id, cmd.roles[i].entity) as List<BRole>
                        orS = oldRolesAux.size()
                        //there were roles previously assigned to this user on this entity
                        if(orS > 0){
                            //remove those which are not present now and were present before
                            if(cmd.roles[i].roles.size() < 1){ //(entity come with an empty array of roles)
                                BUser_Role_OwnedEntity.removeAllRolesFrom(aux, oEntityToBeAssigned)
                            }
                            else {
                                notPresent = getNotPresent(cmd.roles[i].roles, oldRolesAux)
                                if(!notPresent.isEmpty()) {
                                    BUser_Role_OwnedEntity.removeRoles(aux, notPresent, oEntityToBeAssigned)
                                }
                            }
                            //put new roles
                            rolesToBeAdded = getNewRoles(cmd.roles[i].roles, oldRolesAux)
                            int l = rolesToBeAdded.size()
                            if(l > 0) {
                                for(int j = 0; j < l; j++) {
                                    BUser_Role_OwnedEntity.addRole(aux, rolesToBeAdded[j], oEntityToBeAssigned)
                                }
                            }
                        }
                        //there were no roles assigned to this user on this entity previously
                        else {
                            nrS = cmd.roles[i].roles.size()
                            if(nrS > 0) { //new roles are being assigned now
                                for(int j = 0; j < nrS; j++){
                                    rToBeAssigned = BRole.get(cmd.roles[i].roles[j])
                                    if(!rToBeAssigned){
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
        }
        else { //create new user
            for(int i = 0; i < s; i++) {
                oEntity = EOwnedEntity.get(cmd.roles.entity)
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

        if(error) {
            //todo: inform entity or role(s) not present
        }

        return aux
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
     * @return A UserBean entity with the user's info or false if none user is found
     */
    def show (long id){
        def e = Optional.ofNullable(EUser.get(id))
        if(e.isPresent()){
            def i = e.value
            if(i){
                return new UserBean(username: i.username, email: i.email, name: i.name, enabled: i.enabled)
            }
        }
        //todo: inform about the error
        return false
    }

    /**
     * Shows some User's info
     * @param username Identifier of the user that is going to be shown
     * @return A UserBean entity with the user's info or false if none user is found
     */
    def getByUsername (String username){
        def e = EUser.findByUsername(username)
        if(e){
            return new UserBean(id: e.id, username: e.username, email: e.email, name: e.name, enabled: e.enabled)
        }
        //todo: inform about the error
        return false
    }

    /**
     * Deletes some user's info
     * @param id Identifier of the user that is going to be deleted
     * @return <code>true</code> or <code>false</code> depending on the result of the operation
     */
    def delete(long id) {
        def e = EUser.get(id)
        if(e){
            BUser_Role_OwnedEntity.removeAllRolesFromAll(e)
            configurationService.deleteUserConfiguration(id)
            e.delete()
            return true
        }
        //todo: inform about the error
        return false
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
    def roles(long uid, long eid, Map params){
        def e = EOwnedEntity.get(eid)
        if(!e){
            //todo: inform error, entity isn't present
            return false
        }
        Map response = [:]
        def mapped = []
        def list = BUser_Role_OwnedEntity.getRolesByUserByOwnedEntity(uid, eid, params)
        list.each{
            mapped << new RoleBean(id: it.id, label: it.label, description: it.description, enabled: it.enabled)
        }

        response.items = mapped
        response.total = list.totalCount ? list.totalCount : 0
        return response
    }

    List<EUser> getDefaultAdminWithId(long id){
        def list = EUser.createCriteria().list() {
            eq("username", "admin")
            eq("id", id)
        }

        def mapped = []
        list.each {
            mapped << new UserBean(id: it.id, username: it.username, email: it.email, name: it.name, enabled: it.enabled)
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

    def activate(long id, boolean activate = true){
        final EUser e = EUser.get(id)
        if(!e){
            return false
        }
        else{
            e.enabled = activate
            e.save(flush: true, failOnError: true)
            return e
        }
    }
}
