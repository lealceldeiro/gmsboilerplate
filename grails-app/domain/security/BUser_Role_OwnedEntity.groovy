package security

import command.SearchCommand

class BUser_Role_OwnedEntity implements Serializable{

    EUser user

    BRole role

    EOwnedEntity ownedEntity

    static belongsTo = [user: EUser]

    static constraints = {
        id unique: true
    }

    static mapping = {
        id composite: ['user', 'role', 'ownedEntity']
        version false
        table: 'buser_role_owned_entity'

        role lazy: false
    }

    /**
     * Adds a roles to a user over a specific entity
     * @param user User to add role to
     * @param role Role to be added
     * @param ownedEntity Entity which user will have the assigned role
     * @return
     */
    static BUser_Role_OwnedEntity addRole(EUser user, BRole role, EOwnedEntity ownedEntity) {
        if(findByUserAndRoleAndOwnedEntity(user, role, ownedEntity)){
            return null
            //todo: inform error
        }
        def e = new BUser_Role_OwnedEntity(user: user, role: role, ownedEntity: ownedEntity)
        e.save(flush: true, insert: true)
    }

    /**
     * Removes a specific roles from a user over an entity
     * @param user User to remove roles from
     * @param role Role to be removed
     * @param ownedEntity Entity to remove roles from
     * @return
     */
    static def removeRole(EUser user, BRole role, EOwnedEntity ownedEntity){
        executeUpdate(
                "delete from BUser_Role_OwnedEntity ur where ur.user = :user and ur.role = :role and ur.ownedEntity = :entity",
                [user: user, role: role, entity: ownedEntity]
        )
    }
    /**
     * Removes a list of roles assigned to a user from some entity
     * @param user User to remove roles from
     * @param roles Roles to be removed
     * @param ownedEntity Entity to remove roles from
     * @return
     */
    static def removeRoles(EUser user, List<BRole> roles, EOwnedEntity ownedEntity){
        executeUpdate(
                "delete from BUser_Role_OwnedEntity ur where ur.user = :user and ur.role in (:roles) and ur.ownedEntity = :entity",
                [user: user, roles: roles, entity: ownedEntity]
        )
    }

    /**
     * Removes all Roles from an users over an specific entity
     * @param User user to remove roles from
     * @param ownedEntity Entity to remove roles from
     * @return
     */
    static def removeAllRolesFrom(EUser user, EOwnedEntity ownedEntity){
        executeUpdate(
                "delete from BUser_Role_OwnedEntity ur where ur.user = :user and ur.ownedEntity = : entity",
                [user: user, entity: ownedEntity]
        )
    }

    /**
     * Removes all Roles from an users over all entities
     * @param User user to remove roles from
     * @return
     */
    static def removeAllRolesFromAll(EUser user){
        executeUpdate("delete from BUser_Role_OwnedEntity ur where ur.user = :user",[user: user])
    }

    /**
     * Returns all user's roles in a specific entity
     * @param uid user's id
     * @param eid Owned entity id
     * @param params filter params
     * @return
     */
    static def getRolesByUserByOwnedEntity(long uid, Long eid, Map params, SearchCommand cmd = null){
        createCriteria().list(params) {

            projections { property("role") }

            //for this specific user
            user { eq "id", uid }

            //for this specific entity
            if(eid != null){
                ownedEntity {
                    eq "id", eid
                }
            }

            role {
                order("label", "asc")
                order("description", "asc")
                //filter for searching
                if(cmd?.q) {
                    or {
                        ilike("label", "%${cmd.q}%")
                        ilike("description", "%${cmd.q}%")
                    }
                }
            }
        }.unique {it.id}
    }

    /**
     * Returns all ownedEntity's users in a specific entity
     * @param eid ownedEntity's id
     * @param params filter params
     * @return
     */
    static def getUsersByOwnedEntity(long eid, Map params, SearchCommand cmd = null){
        def list = createCriteria().list() {
            projections { property("user") }

            //for this specific entity
            ownedEntity { eq "id", eid }

            user {
                order("enabled", "desc")
                order("username", "asc")
                order("name", "asc")
                order("email", "asc")

                //filter for searching
                if(cmd?.q){
                    or{
                        ilike("username", "%${cmd.q}%")
                        ilike("name", "%${cmd.q}%")
                        ilike("email", "%${cmd.q}%")
                    }
                }
            }
        }.unique {
            it.id
        }

        int s = list.size()
        int offset = params?.offset ? params?.offset as int: 0
        int max = (params?.max ? (params?.max as int) : s) + offset
        if(max > s){
            max = s
        }

        def aux = []
        for(int i = offset; i < max; i++){
            aux << list.get(i)
        }

        aux.metaClass.totalCount = s

        return aux
    }

    /**
     * Returns all ownedEntities' users in a specific entities
     * @param eids ownedEntities' ids
     * @param params filter params
     * @return
     */
    static def getUsersByOwnedEntities(List<Long> eids, Map params, SearchCommand cmd = null){
        def list = createCriteria().list() {
            projections { property("user") }

            //for these specific entities
            ownedEntity { inList "id", eids }

            user {
                order("enabled", "desc")
                order("username", "asc")
                order("name", "asc")
                order("email", "asc")

                //filter for searching
                if(cmd?.q){
                    or{
                        ilike("username", "%${cmd.q}%")
                        ilike("name", "%${cmd.q}%")
                        ilike("email", "%${cmd.q}%")
                    }
                }
            }
        }.unique {
            it.id
        }

        int s = list.size()
        int offset = params?.offset ? params?.offset as int: 0
        int max = (params?.max ? (params?.max as int) : s) + offset
        if(max > s){
            max = s
        }

        def aux = []
        for(int i = offset; i < max; i++){
            aux << list.get(i)
        }

        aux.metaClass.totalCount = s

        return aux
    }

    /**
     * Returns all user's owned entities for a specific user
     * @param id user's id
     * @param params filter params
     * @return
     */
    static def getOwnedEntitiesByUser(long id, Map params, SearchCommand cmd = null){
        createCriteria().list(params) {
            projections { property("ownedEntity") }

            //for this specific user
            user { eq "id", id }

            ownedEntity {
                order("name", "asc")
                order("username", "asc")
                order("description", "asc")
                //filter for searching
                if(cmd?.q){
                    or{
                        ilike("username", "%${cmd.q}%")
                        ilike("name", "%${cmd.q}%")
                        ilike("description", "%${cmd.q}%")
                    }

                }
            }
        }.unique {it.id}
    }
}
