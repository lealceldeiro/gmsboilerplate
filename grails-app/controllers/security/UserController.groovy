package security

import command.SearchCommand
import command.security.user.SearchUserCommand
import command.security.user.UserCommand
import exceptions.ValidationsException
import grails.plugin.springsecurity.annotation.Secured
import org.springframework.http.HttpMethod
import responseHandlers.ExceptionHandler

@Secured("hasRole('MANAGE__USER')")
class UserController implements ExceptionHandler{

    def userService

    def configurationService

    def ownedEntityService

    def gmsBoilerplateSecurityService

    static allowedMethods = [
            search                  : HttpMethod.GET.name(),
            searchAll               : HttpMethod.GET.name(),
            create                  : HttpMethod.PUT.name(),
            update                  : HttpMethod.POST.name(),
            updateProfile           : HttpMethod.POST.name(),
            activate                : HttpMethod.POST.name(),
            show                    : HttpMethod.GET.name(),
            delete                  : HttpMethod.DELETE.name(),
            roles                   : HttpMethod.GET.name(),
            getBy                   : HttpMethod.GET.name(),
            isTaken                 : HttpMethod.GET.name(),
            entities                : HttpMethod.GET.name(),
            getAssociatedToEntities : HttpMethod.GET.name()
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
    def search(SearchCommand cmd, Long eid) {
        if(cmd.validate()){
            def result = ownedEntityService.getUsersByOwnedEntity(eid, params, cmd)
            if(result){ doSuccessWithArgs("general.done.ok", result) }
            doFail("general.done.KO")
        }
        else { throw new ValidationsException() }
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
        if(cmd.validate()){
            def result = userService.search(cmd, params)
            if(result){ doSuccessWithArgs("general.done.ok", result) }
            doFail("general.done.KO")
        }
        else { throw new ValidationsException() }
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
        final e = userService.save(cmd)
        if(e){
            String p0 = g.message(code:"article.the_male_singular"), p1 = g.message(code:"security.user.user")
            doSuccessWithArgs(g.message(code: "general.action.CREATE.success", args: [p0, p1, "o"]) as String, [id: e.id])
        }
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
    def update(UserCommand cmd, Long id){
        final e = userService.save(cmd, id)
        if(e){
            String p0 = g.message(code:"article.the_male_singular"), p1 = g.message(code:"security.user.user")
            doSuccessWithArgs(g.message(code: "general.action.UPDATED.success", args: [p0, p1, "o"]) as String, [id: e.id])
        }
    }

    /**
     * Updates the user profile
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
    @Secured("hasRole('UPDATE__PROFILE')")
    def updateProfile(UserCommand cmd, Long id){
        Long aUId = gmsBoilerplateSecurityService.authenticatedUser().id
        if(aUId == id) {
            final e = userService.save(cmd, id, true)
            if(e){
                String p0 = g.message(code:"article.the_male_singular"), p1 = g.message(code:"security.user.user")
                doSuccessWithArgs(g.message(code: "general.action.UPDATED.success", args: [p0, p1, "o"]) as String, [id: e.id])
            }
        }
        else {
            doForbidden("general.security.forbidden.update.profile")
        }
    }

    /**
     * Return a user's info
     * @param id User's identifier
     * @return A json containing the user's info if the operation was successful with the following structure
     * <p><code>{success: true|false, item:{<param1>,...,<paramN>}}</code></p>
     */
    @Secured("hasAnyRole('READ__USER', 'READ__PROFILE')")
    def show(Long id){
        def e = userService.show(id)
        if(e){ doSuccessWithArgs("general.done.ok", [item: e]) }
        else { doFail("general.done.KO") }
    }

    /**
     * Deletes a User
     * @param id Users's identifier
     * @return A json containing the user's id if the operation was successful with the following structure
     * <p><code>{success: true|false, id: <identifier></code></p>
     */
    @Secured("hasRole('DELETE__USER')")
    def delete(Long id){
        boolean markDefaultAdminAsUnset = false
        if(!configurationService.isDefaultAdminUnSetup()){
            List<EUser> list = userService.getDefaultAdminWithId(id)
            if(list.size() > 0){
                if(id == list.get(0).id){
                    markDefaultAdminAsUnset = true
                }
            }
        }

        final e = userService.delete(id)
        if(e){
            if(markDefaultAdminAsUnset){ configurationService.setDefaultAdminUnSetUp() }
            String p0 = g.message(code:"article.the_male_singular"), p1 = g.message(code:"security.user.user")
            doSuccessWithArgs(g.message(code: "general.action.DELETE.success", args: [p0, p1, "o"]) as String, [id: id])
        }
        else doFail "general.done.KO"
    }
    //endregion

    @Secured("hasRole('UPDATE__USER')")
    def activate (Long id, Boolean value){
        final e = userService.activate(id, value)
        if(e) { doSuccessWithArgs("general.done.ok", [id: e.id]) }
        else doFail "general.done.KO"
    }


    /**
     * Return a user's info
     * @param username User's identifier
     * @return A json containing the user's info if the operation was successful with the following structure
     * <p><code>{success: true|false, item:{<param1>,...,<paramN>}}</code></p>
     */
    @Secured("hasAnyRole('READ__USER', 'READ__PROFILE')")
    def getBy(){
        def e = userService.getBy(params)
        if(e) { doSuccessWithArgs("general.done.ok", [item: e]) }
        else doFail "general.done.KO"
    }

    @Secured("permitAll")
    def isTaken() {
        def e = userService.getBy(params)
        if(e) { doSuccessWithArgs("general.done.ok", [item: true]) }
        else doFail "general.done.KO"
    }

    /**
     * Return a user's info
     * @param e A List of long with the entities ids
     * @return A json containing the user's info if the operation was successful with the following structure
     * <p><code>{success: true|false, item:{<param1>,...,<paramN>}}</code></p>
     */
    @Secured("hasAnyRole('READ__USER', 'READ__PROFILE')")
    def getAssociatedToEntities(SearchUserCommand cmd){
        if(cmd.validate()){
            def result = ownedEntityService.getUsersByOwnedEntities(cmd.e, params, cmd)
            if(result){ doSuccessWithArgs("general.done.ok", result) }
            doFail("general.done.KO")
        }
        else { throw new ValidationsException() }
    }
}
