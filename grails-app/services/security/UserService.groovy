package security

import command.SearchCommand
import command.security.user.UserCommand
import grails.transaction.Transactional
import mapping.security.RoleBean
import mapping.security.UserBean

@Transactional
class UserService {

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
        EUser e = cmd()
        EUser aux = null

        def oEntity = EOwnedEntity.get(cmd.entity)
        if(!oEntity){
            //todo: inform error entity doesn't exist
            return false
        }

        //editing
        if(id){
            aux = EUser.get(id)
            //mandatory fields, but if not provided, then not changed
            if(cmd.username != null){
                aux.username = cmd.username
            }
            if(cmd.name != null){
                aux.name = cmd.name
            }
            if(cmd.password != null){
                aux.password = cmd.password
            }
            aux.email = cmd.email
            aux.enabled = cmd.enabled
        }
        //creating
        else {
            if(e.validate()) {
                aux = e
            }
            else {
                return false
                //todo: inform error
            }
        }

        //save before adding roles relationships
        aux.save flush: true

        //set the corresponding roles to the user
        if (cmd.roles != null && cmd.roles.size() > 0) {
            int s = cmd.roles.size()
            if(aux.roles) {
                int sr = aux.roles.size()
                if(sr > 0){
                    def ro
                    List<BRole> deleteList = []
                    for (int i = 0; i < sr; i++) {
                        ro = aux.roles[i]
                        if (!cmd.roles.contains(ro.role.id)) {
                            deleteList.add(ro.role)
                        }
                    }
                    if(deleteList.size() > 0){
                        BUser_Role_OwnedEntity.removeRoles(aux, deleteList, oEntity)
                    }
                }
            }

            def r
            boolean ctrl = false
            for (int i = 0; i < s; i++) {
                r = BRole.get(cmd.roles.get(i))
                if(r != null){
                    BUser_Role_OwnedEntity.addRole(aux, (r as BRole), oEntity)
                }
                else{
                    ctrl = true
                }
            }

            if(ctrl){
                //todo: inform this role isn't present
            }
        }
        else {
            if(aux.roles){
                BUser_Role_OwnedEntity.removeAllRolesFrom(aux, oEntity)
            }
        }


        return aux

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
