package security

import command.SearchCommand
import command.security.role.RoleCommand
import mapping.security.PermissionBean
import mapping.security.RoleBean

import grails.transaction.Transactional

@Transactional
class RoleService {

    /**
     * Search a role(s) according to optional parameters
     * @param cmd       [optional] Grails command containing the parameters for searching the role(s)
     *                  q: Criteria for searching
     * @param params    [optional] Parameters for paging the result
     * @return          A json containing a list of roles with the following structure if the operation was successful
     * <p><code>{success: true|false, items:[<it1>,...,<itn>], total: <totalCount>}</code></p>
     */
    def search(SearchCommand cmd, Map params) {
        Map response = [:]

        def list = BRole.createCriteria().list(params) {
            order("enabled", "desc")
            order("label", "asc")
            order("description", "asc")
            if(cmd.q) {
                or{
                    ilike("label", "%${cmd.q}%")
                    ilike("description", "%${cmd.q}%")
                }
            }

        }

        def mapped = []
        list.each {
            mapped << new RoleBean(id: it.id, label: it.label, description: it.description, enabled: it.enabled)
        }

        response.items = mapped
        response.total = list.totalCount
        return response
    }

    /**
     * Creates or updates a role
     * @param cmd Role data such: label(string), description(string) and enabled(boolean)
     * @param id [optional] if an update is going to be performed, the id of the role which is going to be updated
     * must be supplied
     * @return A json containing the id of the role if the operation was successful
     * <p><code>{success: true|false, id: <roleId>}</code></p>
     */
    def save(RoleCommand cmd, long id) {
        BRole e = cmd()
        BRole aux

        if(id){ //edit
            aux = BRole.get(id)
            aux.enabled = e.enabled ? e.enabled : false
            aux.description = e.description
            aux.label = e.label
        }
        else if (e.validate()){ //create
            aux = e
        }
        else{
            //todo: inform about the error
            return false
        }

        aux.save flush: true

        //set the corresponding permissions to the role
        if (cmd.permissions != null) {
            int s = cmd.permissions.size()
            if(s > 0) {
                if (aux.permissions) {
                    int ps = aux.permissions.size()
                    if (ps > 0) {
                        def o
                        List<BPermission> deleteList = []
                        for (int i = 0; i < ps; i++) {
                            o = aux.permissions[i]
                            if (!cmd.permissions.contains(o.permission.id)) {
                                deleteList.add(o.permission)
                            }
                        }
                        if (deleteList.size() > 0) {
                            BRole_Permission.removePermissions(aux, deleteList)
                        }
                    }
                }

                def p
                boolean ctrl = false
                for (int i = 0; i < s; i++) {
                    p = BPermission.get(cmd.permissions.get(i))
                    if (p != null) {
                        BRole_Permission.addPermission(aux, (p as BPermission))
                    } else {
                        ctrl = true
                    }
                }

                if (ctrl) {
                    //todo: inform this role isn't present
                }
            }
        }

        return aux
    }

    /**
     * Shows some role's info
     * @param id Identifier of the role that is going to be shown
     * @return A RoleBean entity with the role's info or false if none role is found
     */
    def show (long id){
        def e = Optional.ofNullable(BRole.get(id))
        if(e.isPresent()){
            def i = e.value
            if(i){
                return new RoleBean(id: i.id, label: i.label, description: i.description, enabled: i.enabled)
            }
        }
        //todo: inform about the error
        return false
    }

    /**
     * Deletes some role's info
     * @param id Identifier of the role that is going to be deleted
     * @return <code>true</code> or <code>false</code> depending on the result of the operation
     */
    def delete(long id) {
        def e = BRole.get(id)
        if(e){
            def ur = BUser_Role_OwnedEntity.findByRole(e)
            if(!ur){
                BRole_Permission.removeAllPermissionsFrom(e)
                e.delete()
                return true
            }
            else{
                //todo: inform about error
                return false
            }
        }
        //todo: inform about the error
        return false
    }

    /**
     * Returns all permissions associated to a role
     * @param id Role's id
     * @param params [optional] Parameters for paging the result
     * @return A json containing a list of permissions with the following structure if the operation was successful
     * <p><code>{success: true|false, items:[<it1>,...,<itn>], total: <totalCount>}</code></p>
     */
    def permissions(long id, Map params){
        Map response = [:]
        def mapped = []
        def list = BRole_Permission.getPermissionsByRole(id, params)
        list.each{
            mapped << new PermissionBean(id: it.id, label: it.label, name: it.name)
        }

        response.items = mapped
        response.total = list.totalCount ? list.totalCount : 0
        return response
    }

    boolean noRolesInDB() {
        BRole.count() < 1
    }

    boolean createDefaultAdminRole(){
        BRole r = new BRole(description: 'Role for administrators', label: 'ROLE_ADMIN', enabled: true)
        r.save(flush: true, failOnError: true)
        def brp = BPermission.findAll()
        brp.each {it ->
            BRole_Permission.addPermission(r, it)
        }

    }

    def activate(long id, boolean activate = true){
        final BRole e = BRole.get(id)
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
