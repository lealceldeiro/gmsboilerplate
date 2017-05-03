package security

import command.SearchCommand
import command.security.ownedentity.OwnedEntityCommand
import grails.transaction.Transactional
import mapping.security.OwnedEntityBean
import mapping.security.RoleBean
import mapping.security.UserBean

@Transactional
class OwnedEntityService {


    def createDefaultOwnedEntity(){
        EOwnedEntity e = new EOwnedEntity(name: 'HOME', username: 'home', description: 'Default Owned Entity created by System on First Startup. This should not be deleted for keeping consistency.')
        e.save(flush: true, failOnError: true)

        return e
    }

    def getDefaultOwnedEntity(){
        return EOwnedEntity.findByNameAndUsername('HOME', 'home')
    }

    //region CRUD

    /**
     * Search an ownedEntities(s) according to optional parameters
     * @param cmd       [optional] Grails command containing the parameters for searching the role(s)
     *                  q: Criteria for searching
     * @param params    [optional] Parameters for paging the result
     * @return          A json containing a list of roles with the following structure if the operation was successful
     * <p><code>{success: true|false, items:[<it1>,...,<itn>], total: <totalCount>}</code></p>
     */
    def search(SearchCommand cmd, Map params) {
        Map response = [:]

        def list = EOwnedEntity.createCriteria().list(params) {
            order("username", "asc")
            order("name", "asc")
            if(cmd.q) {
                or{
                    ilike("name", "%${cmd.q}%")
                    ilike("username", "%${cmd.q}%")
                }
            }

        }

        def mapped = []
        list.each {
            mapped << new OwnedEntityBean(id: it.id, name: it.name, username: it.username,
            description: it.description)
        }

        response.items = mapped
        response.total = list.totalCount
        return response
    }

    /**
     * Search an ownedEntities(s) according to optional parameters
     * @param cmd       [optional] Grails command containing the parameters for searching the ownedEntities(s)
     *                  q: Criteria for searching
     * @param id        User id
     * @param params    [optional] Parameters for paging the result
     * @return          A json containing a list of roles with the following structure if the operation was successful
     * <p><code>{success: true|false, items:[<it1>,...,<itn>], total: <totalCount>}</code></p>
     */
    def searchByUser(SearchCommand cmd, long id, Map params) {
        Map response = [items: []]

        def l = BUser_Role_OwnedEntity.getOwnedEntitiesByUser(id, params, cmd)

        l.each {
            response.items << new OwnedEntityBean(id: it.id, name: it.name, username: it.username,
                    description: it.description)
        }
        response.total = l.size()
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
    def save(OwnedEntityCommand cmd, long id) {
        EOwnedEntity e = cmd()
        EOwnedEntity aux

        if(id){ //edit
            aux = EOwnedEntity.get(id)
            aux.username = e.username
            aux.name = e.name
            aux.description = e.description
        }
        else if (e.validate()){ //create
            aux = e
        }
        else{
            //todo: inform about the error
            return false
        }

        aux.save flush: true, failOnError: true

        return aux
    }

    /**
     * Shows some entity's info
     * @param id Identifier of the entity that is going to be shown
     * @return An OwnedEntityBean entity with the entity's info or false if none role is found
     */
    def show (long id){
        def e = Optional.ofNullable(EOwnedEntity.get(id))
        if(e.isPresent()){
            def i = e.value
            if(i){
                return new OwnedEntityBean(name: i.name, username: i.username, id: i.id,
                description: i.description)
            }
        }
        //todo: inform about the error
        return false
    }


    /**
     * Deletes some ownedEntity's info
     * @param id Identifier of the ownedEntity that is going to be deleted
     * @return <code>true</code> or <code>false</code> depending on the result of the operation
     */
    def delete(long id) {
        def e = EOwnedEntity.get(id)
        if(e){
            def uro = BUser_Role_OwnedEntity.findByOwnedEntity(e)
            if(!uro){
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

    //endregion

    /**
     * Returns all users associated to an entity
     * @param eid Entity's id
     * @param params [optional] Parameters for paging the result
     * @return A json containing a list of users with the following structure if the operation was successful
     * <p><code>{success: true|false, items:[<it1>,...,<itn>], total: <totalCount>}</code></p>
     */
    def getUsersByOwnedEntity(long eid, Map params, SearchCommand cmd = null){
        Map response = [:]
        def mapped = []
        def list = BUser_Role_OwnedEntity.getUsersByOwnedEntity(eid, params, cmd)
        list.each{
            mapped << new UserBean(id: it.id, name: it.name, username: it.username, email: it.email, enabled: it.enabled)
        }

        response.items = mapped
        response.total = list.totalCount ? list.totalCount : 0
        return response
    }

    /**
     * Returns all users associated to an entities
     * @param eids Entities' ids
     * @param params [optional] Parameters for paging the result
     * @return A json containing a list of users with the following structure if the operation was successful
     * <p><code>{success: true|false, items:[<it1>,...,<itn>], total: <totalCount>}</code></p>
     */
    def getUsersByOwnedEntities(List<Long> eids, Map params, SearchCommand cmd = null){
        Map response = [:]
        def mapped = []
        def list = BUser_Role_OwnedEntity.getUsersByOwnedEntities(eids, params, cmd)
        list.each{
            mapped << new UserBean(id: it.id, name: it.name, username: it.username, email: it.email, enabled: it.enabled)
        }

        response.items = mapped
        response.total = list.totalCount ? list.totalCount : 0
        return response
    }

    /**
     * Returns all roles associated to a user over an entity
     * @param uid User's id
     * @param eid Entity's id
     * @param params [optional] Parameters for paging the result
     * @return A json containing a list of users with the following structure if the operation was successful
     * <p><code>{success: true|false, items:[<it1>,...,<itn>], total: <totalCount>}</code></p>
     */
    def getRolesByUserAndOwnedEntity(long uid, long eid, Map params, SearchCommand cmd = null){
        Map response = [:]
        def mapped = []
        def list = BUser_Role_OwnedEntity.getRolesByUserByOwnedEntity(uid, eid, params, cmd)
        list.each{
            mapped << new RoleBean(id: it.id, label: it.label, description: it.description, enabled: it.enabled)
        }

        response.items = mapped
        response.total = list.totalCount ? list.totalCount : 0
        return response
    }
}
