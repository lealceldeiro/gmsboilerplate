package security

import command.SearchCommand
import command.security.user.UserCommand
import grails.converters.JSON
import org.springframework.http.HttpMethod
import org.springframework.security.access.annotation.Secured

@Secured("hasRole('MANAGE__USER')")
class UserController{

    def userService

    def configurationService

    def ownedEntityService

    static allowedMethods = [
            search          : HttpMethod.GET.name(),
            searchAll       : HttpMethod.GET.name(),
            create          : HttpMethod.PUT.name(),
            update          : HttpMethod.POST.name(),
            activate        : HttpMethod.POST.name(),
            show            : HttpMethod.GET.name(),
            delete          : HttpMethod.DELETE.name(),
            roles           : HttpMethod.GET.name(),
            getByUsername   : HttpMethod.GET.name(),
            entities        : HttpMethod.GET.name()
    ]

    //region CRUD
    /**
     * Searches for users by entity which match with the specified params
     * @param cmd Search criteria:
     *                              q: Criteria for searching the users
     * @param eid Entity's id which is associated to users who are going to be searched
     * @return A json containing the user's info if the operation was successful with the following structure
     * <p><code>{success: true|false, items:[{<param1>,...,<paramN>}}]</code></p>
     */
    @Secured("hasRole('READ__USER')")
    def search(SearchCommand cmd, long eid) {
        def body = ['success': false]
        if(cmd.validate()){
            def result = ownedEntityService.getUsersByOwnedEntity(eid, params, cmd)

            body.success = true
            body.total = result['total']
            body.items = result['items']
        }

        render body as JSON
    }

    /**
     * Searches for all users which match with the specified params
     * @param cmd Search criteria:
     *                              q: Criteria for searching the users
     * @return A json containing the user's info if the operation was successful with the following structure
     * <p><code>{success: true|false, items:[{<param1>,...,<paramN>}}]</code></p>
     */
    @Secured("hasRole('READ__USER') and hasRole('READ_ALL__USER')")
    def searchAll(SearchCommand cmd) {
        def body = ['success': false]
        if(cmd.validate()){
            def result = userService.search(cmd, params)

            body.success = true
            body.total = result['total']
            body.items = result['items']
        }

        render body as JSON
    }

    /**
     * Creates a new User
     * @param cmd User information:
     *                              username:           User's username
     *                              email:              [optional] user's email
     *                              name:               User's name
     *                              password:           User's password
     *                              roles               List with the User's roles's identifiers
     * @return JSON informing whether the action was successful or not. If successful, it also contains the id of the
     * just created/edited user
     */
    @Secured("hasRole('CREATE__USER')")
    def create(UserCommand cmd){
        save(cmd)
    }

    /**
     * Updates an existing user
     * @param cmd User information:
     *                              username:           User's username
     *                              email:              [optional] user's email
     *                              name:               User's name
     *                              password:           User's password
     *                              roles               List with the User's roles's identifiers
     * @param id Identifier of User which is going to be edited
     * @return JSON informing whether the action was successful or not. If successful, it also contains the id of the
     * just created/edited user
     */
    @Secured("hasRole('UPDATE__USER')")
    def update(UserCommand cmd, long id){
        save(cmd, id)
    }

    protected save(UserCommand cmd, long id = 0){
        def body = ['success' : false]

        final e = userService.save(cmd, id)
        if(e){
            body.success = true
            body.id = e.id
        }

        render body as JSON
    }

    /**
     * Return a user's info
     * @param id User's identifier
     * @return A json containing the user's info if the operation was successful with the following structure
     * <p><code>{success: true|false, item:{<param1>,...,<paramN>}}</code></p>
     */
    @Secured("hasRole('READ__USER')")
    def show(long id){
        def body = ['success' : false]
        def e = userService.show(id)
        if(e){
            body.success = true
            body.item = e
        }
        render body as JSON
    }

    /**
     * Deletes a User
     * @param id Users's identifier
     * @return A json containing the user's id if the operation was successful with the following structure
     * <p><code>{success: true|false, id: <identifier></code></p>
     */
    @Secured("hasRole('DELETE__USER')")
    def delete(long id){
        boolean markDefaultAdminAsUnset = false

        if(!configurationService.isDefaultAdminUnSetup()){
            List<EUser> list = userService.getDefaultAdminWithId(id)
            if(list.size() > 0){
                if(id == list.get(0).id){
                    markDefaultAdminAsUnset = true
                }
            }
        }

        def body = ['success': false]
        final e = userService.delete(id)
        if(e){
            body.success = true
            body.id = id

            if(markDefaultAdminAsUnset){
                configurationService.setDefaultAdminUnSetUp()
            }
        }
        render body as JSON
    }
    //endregion

    @Secured("hasRole('UPDATE__USER')")
    def activate (long id, boolean value){
        def body = ['success' : false]
        final e = userService.activate(id, value)
        if(e){
            body.success = true
            body.id = e.id
        }

        render body as JSON
    }


    /**
     * Return a user's info
     * @param username User's identifier
     * @return A json containing the user's info if the operation was successful with the following structure
     * <p><code>{success: true|false, item:{<param1>,...,<paramN>}}</code></p>
     */
    @Secured("hasAnyRole('READ__USER', 'READ__PROFILE')")
    def getByUsername(String username){
        def body = ['success' : false]
        def e = userService.getByUsername(username)
        if(e){
            body.success = true
            body.item = e
        }
        render body as JSON
    }


    /**
     * Returns a user's roles by its id
     * @param id user's id
     * @return A <code>List</code> of roles
     */
    @Secured("hasRole('READ__USER')")
    def roles(long id, long eid){
        def body = ['success': false]
        if(id){
            final r = userService.roles(id, eid, params)
            if(r){
                body.success = true
                body.items = r['items']
                body.total = r['total']
            }
        }
        render body as JSON
    }

    /**
     * Returns a user's entities by its id
     * @param id user's id
     * @return A <code>List</code> of entities
     */
    @Secured("hasRole('READ__USER', 'READ_OWNED__ENTITY')")
    def entities(long id){
        def body = ['success': false]
        SearchCommand cmd = new SearchCommand()
        if(id){
            final r = ownedEntityService.search(cmd, params)
            if(r){
                body.success = true
                body.items = r['items']
                body.total = r['total']
            }
        }
        render body as JSON
    }
}
