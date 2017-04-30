package security

import command.SearchCommand
import command.security.ownedentity.OwnedEntityCommand
import grails.converters.JSON
import org.springframework.http.HttpMethod
import org.springframework.security.access.annotation.Secured

@Secured("hasRole('MANAGE_OWNED__ENTITY')")
class OwnedEntityController {

    def ownedEntityService

    static allowedMethods = [
            search          : HttpMethod.GET.name(),
            searchAll       : HttpMethod.GET.name(),
            create          : HttpMethod.PUT.name(),
            update          : HttpMethod.POST.name(),
            show            : HttpMethod.GET.name(),
            delete          : HttpMethod.DELETE.name(),
            permissions     : HttpMethod.GET.name()
    ]

    //region CRUD
    /**
     * Searches for owned entities which belong to a user whose id match with the specified id passed as parameter and
     * their attributes match the "params" param
     * @param cmd Search criteria:
     *                              q: Criteria for searching the roles
     * @param id User's id
     * @return A json containing the owned entities' info if the operation was successful with the following structure
     * <p><code>{success: true|false, items:[{<param1>,...,<paramN>}}]</code></p>
     */
    @Secured("hasRole('READ__OWNED_ENTITY')")
    def search(SearchCommand cmd, long uid) {
        def body = ['success': false]
        if(cmd.validate()){
            def result = ownedEntityService.searchByUser(cmd, uid, params)

            body.success = true
            body.total = result['total']
            body.items = result['items']
        }

        render body as JSON
    }

    /**
     * Searches for all owned entities which match with the specified params
     * @param cmd Search criteria:
     *                              q: Criteria for searching the roles
     * @return A json containing the roles' info if the operation was successful with the following structure
     * <p><code>{success: true|false, items:[{<param1>,...,<paramN>}}]</code></p>
     */
    @Secured("hasRole('READ_ALL__OWNED_ENTITY')")
    def searchAll(SearchCommand cmd) {
        def body = ['success': false]
        if(cmd.validate()){
            def result = ownedEntityService.search(cmd, params)

            body.success = true
            body.total = result['total']
            body.items = result['items']
        }


        render body as JSON
    }

    /**
     * Creates a new Owned Entity
     * @param cmd Owned Entity information:
     *                              name:       unique name for this Owned Entity
     *                              username:   unique username for this Owned Entity
     * @param uid User identifier who owns this entity
     * @return JSON informing whether the action was successful or not. If successful, it also contains the id of the
     * just created/edited Owned Entity
     */
    @Secured("hasRole('CREATE__OWNED_ENTITY')")
    def create(OwnedEntityCommand cmd){
        save(cmd)
    }

    /**
     * Updates an existing Owned Entity
     * @param cmd Owned Entity information:
     *                              name:       unique name for this Owned Entity
     *                              username:   unique username for this Owned Entity
     * @param id Identifier of the Owned Entity which is going to be edited
     * @return JSON informing whether the action was successful or not. If successful, it also contains the id of the
     * just created/edited Owned Entity
     */
    @Secured("hasRole('UPDATE__OWNED_ENTITY')")
    def update(OwnedEntityCommand cmd, long id){
        save(cmd, id)
    }

    protected save(OwnedEntityCommand cmd, long id = 0){
        def body = ['success' : false]

        final e = ownedEntityService.save(cmd, id)
        if(e){
            body.success = true
            body.id = e.id
        }

        render body as JSON
    }

    /**
     * Return a Owned Entity's info
     * @param id Owned Entity's identifier
     * @return A json containing the role's info if the operation was successful with the following structure
     * <p><code>{success: true|false, item:{<param1>,...,<paramN>}}</code></p>
     */
    @Secured("hasRole('READ__OWNED_ENTITY')")
    def show(long id){
        def body = ['success' : false]
        def e = ownedEntityService.show(id)
        if(e){
            body.success = true
            body.item = e
        }
        render body as JSON
    }

    /**
     * Deletes a Owned Entity
     * @param id Owned Entity's identifier
     * @return  A json containing the Owned Entity's id if the operation was successful with the following structure
     * <p><code>{success: true|false, id: <identifier></code></p>
     */
    @Secured("hasRole('DELETE__OWNED_ENTITY')")
    def delete(long id){
        def body = ['success': false]
        final e = ownedEntityService.delete(id)
        if(e){
            body.success = true
            body.id = id
        }
        render body as JSON
    }
    //endregion

    /**
     * Returns a Owned Entity's users by its id
     * @param id Owned Entity's id
     * @return A <code>List</code> of users
     */
    @Secured("hasRole('READ__OWNED_ENTITY')")
    def users(long id){
        def body = ['success': false]
        if(id){
            final r = ownedEntityService.getUsersByOwnedEntity(id, params)
            if(r){
                body.success = true
                body.items = r['items']
                body.total = r['total']
            }
        }
        render body as JSON
    }
}
