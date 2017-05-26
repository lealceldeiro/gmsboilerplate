package security

class BRole_Permission implements Serializable{

    BPermission permission

    BRole role

    static belongsTo = [role: BRole]

    static constraints = {
        id: unique: true
    }

    static mapping = {
        id composite: ['permission', 'role']
        version false
        table: 'brole_permission'

        role lazy: false
    }

    static BRole_Permission addPermission(BRole role, BPermission permission) {
        if(!findByRoleAndPermission(role, permission)){
            def e = new BRole_Permission(role: role, permission: permission)
            e.save(flush: true, insert: true)
        }
    }

    static def removePermission(BRole role, BPermission permission){
        executeUpdate("delete from BRole_Permission rp where rp.role = :role and rp.permission = :permission", [role: role, permission: permission])
    }

    static def removePermissions(BRole role, List<BPermission> permissions){
        executeUpdate("delete from BRole_Permission rp where rp.role = :role and rp.permission in (:permissions)", [role: role, permissions: permissions])
    }

    static def removeAllPermissionsFrom(BRole role){
        executeUpdate("delete from BRole_Permission rp where rp.role = :role", [role: role])
    }

    static def getPermissionsByRole(Long id, Map params){
        createCriteria().list(params) {

            projections { property("permission") }

            role {
                eq "id", id
            }

            permission {
                order("label", "asc")
                order("name", "asc")
            }

        }
    }
}
