package security

import command.SearchCommand
import grails.transaction.Transactional
import nomenclator.EnumPermission

@Transactional
class PermissionService {

    boolean noPermissionInDB() {
        BPermission.count() < 1
    }

    def createDefaultPermissions(){
        List<EnumPermission> ps = EnumPermission.values()
        ps.each { new BPermission(name: it.toString(), label: it.toString().replace("_", " ")).save(flush: true) }
        return true
    }


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

        def list = BPermission.createCriteria().list(params) {
            order("label", "asc")
            if(cmd.q) {
                or{
                    ilike("label", "%${cmd.q}%")
                    ilike("name", "%${cmd.q}%")
                }
            }

        }

        def mapped = []
        list.each {
            mapped << [id: it.id, label: it.label, name: it.name]
        }

        response.items = mapped
        response.total = list.totalCount
        return response
    }

    Set<String> getPermissionsFromRoles(List roleList) {
        Set<String> allPermissions = []

        def permissions
        roleList.each {
            if(it.enabled){ //guarantee the role is enabled
                permissions = BRole_Permission.getPermissionsByRoleAsStrings((it.id as Long), [:])
                allPermissions.addAll(permissions as List)
            }
        }

        return allPermissions
    }

}
