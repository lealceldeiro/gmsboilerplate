package security

import command.SearchCommand
import command.security.ownedentity.OwnedEntityCommand
import exceptions.ValidationsException
import org.springframework.http.HttpMethod
import org.springframework.security.access.annotation.Secured
import responseHandlers.ExceptionHandler

@Secured("isFullyAuthenticated()")
class OwnedEntityController implements ExceptionHandler{

    def ownedEntityService

    static allowedMethods = [
            search          : HttpMethod.GET.name(),
            searchAll       : HttpMethod.GET.name(),
            create          : HttpMethod.PUT.name(),
            update          : HttpMethod.POST.name(),
            show            : HttpMethod.GET.name(),
            delete          : HttpMethod.DELETE.name(),
            permissions     : HttpMethod.GET.name(),
            getByUsername     : HttpMethod.GET.name()
    ]

    //region CRUD
    /**
     * Searches for owned entities which belong to a user whose id match with the specified id passed as parameter and
     * their attributes match the "params" param
     * @param cmd Search criteria:
     *                              q: Criteria for searching the owned entities
     * @param id User's id
     * @return A json containing the owned entities' info if the operation was successful with the following structure
     * <p><code>{success: true|false, items:[{<param1>,...,<paramN>}}]</code></p>
     */
    def search(SearchCommand cmd, Long uid) {
        if(cmd.validate()){
            def result = ownedEntityService.searchByUser(cmd, uid, params)
            if(result){ doSuccess("general.done.ok", result) }
            doFail("general.done.KO")
        }
        else { throw new ValidationsException() }
    }

    /**
     * Searches for all owned entities which match with the specified params
     * @param cmd Search criteria:
     *                              q: Criteria for searching the owned entities
     * @return A json containing the roles' info if the operation was successful with the following structure
     * <p><code>{success: true|false, items:[{<param1>,...,<paramN>}}]</code></p>
     */
    @Secured("hasRole('READ_ALL__OWNED_ENTITY')")
    def searchAll(SearchCommand cmd) {
        if(cmd.validate()){
            def result = ownedEntityService.search(cmd, params)
            if(result){ doSuccess("general.done.ok", result) }
            doFail("general.done.KO")
        }
        else { throw new ValidationsException() }
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
        final e = ownedEntityService.save(cmd)
        if(e){
            String p0 = g.message(code:"article.the_female_singular"), p1 = g.message(code:"security.owned_entity.entity")
            doSuccess(g.message(code: "general.action.CREATE.success", args: [p0, p1, "a"]) as String, [id: e.id])
        }
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
    def update(OwnedEntityCommand cmd, Long id){
        final e = ownedEntityService.save(cmd, id)
        if(e){
            String p0 = g.message(code:"article.the_female_singular"), p1 = g.message(code:"security.owned_entity.entity")
            doSuccess(g.message(code: "general.action.UPDATED.success", args: [p0, p1, "a"]) as String, [id: e.id])
        }
    }


    /**
     * Return a Owned Entity's info
     * @param id Owned Entity's identifier
     * @return A json containing the owned entity's info if the operation was successful with the following structure
     * <p><code>{success: true|false, item:{<param1>,...,<paramN>}}</code></p>
     */
    @Secured("hasRole('READ__OWNED_ENTITY')")
    def show(Long id){
        def e = ownedEntityService.show(id)
        if(e){
            doSuccess("general.done.ok", [item: e])
        }
        else {
            doFail("general.done.KO")
        }
    }

    /**
     * Deletes a Owned Entity
     * @param id Owned Entity's identifier
     * @return  A json containing the Owned Entity's id if the operation was successful with the following structure
     * <p><code>{success: true|false, id: <identifier></code></p>
     */
    @Secured("hasRole('DELETE__OWNED_ENTITY')")
    def delete(Long id){
        String p0 = g.message(code:"article.the_female_singular"), p1 = g.message(code:"security.owned_entity.entity")
        final e = ownedEntityService.delete(id)
        if(e) {
            doSuccess g.message(code: "general.action.DELETE.success", args: [p0, p1, "a"]) as String, [id: id]
        }
    }
    //endregion

    /**
     * Returns a Owned Entity's users by its id
     * @param id Owned Entity's id
     * @return A <code>List</code> of users
     */
    @Secured("hasRole('READ__OWNED_ENTITY')")
    def users(Long id){
        final r = ownedEntityService.getUsersByOwnedEntity(id, params)
        if(r){ doSuccess "general.done.ok", r }
        else { doFail "general.done.KO" }
    }

    @Secured("hasRole('READ__OWNED_ENTITY')")
    def getByUsername(String username){
        def e = ownedEntityService.getByUsername(username)
        if(e){ doSuccess "general.done.ok", [item: e] }
        else { doFail "general.done.KO" }
    }
}
