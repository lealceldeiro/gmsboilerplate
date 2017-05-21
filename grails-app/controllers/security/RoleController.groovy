package security

import command.SearchCommand
import command.security.role.RoleCommand
import exceptions.ValidationsException
import org.springframework.http.HttpMethod
import org.springframework.security.access.annotation.Secured
import responseHandlers.ExceptionHandler

@Secured("hasRole('MANAGE__ROLE')")
class RoleController implements ExceptionHandler{

    def roleService

    def ownedEntityService

    static allowedMethods = [
            search          : HttpMethod.GET.name(),
            searchAll       : HttpMethod.GET.name(),
            create          : HttpMethod.PUT.name(),
            update          : HttpMethod.POST.name(),
            activate        : HttpMethod.POST.name(),
            show            : HttpMethod.GET.name(),
            delete          : HttpMethod.DELETE.name(),
            permissions     : HttpMethod.GET.name()
    ]

    //region CRUD
    /**
     * Searches for roles which match with the specified params
     * @param cmd Search criteria:
     *                              q: Criteria for searching the roles
     * @return A json containing the roles' info if the operation was successful with the following structure
     * <p><code>{success: true|false, items:[{<param1>,...,<paramN>}}]</code></p>
     */
    @Secured("hasRole('READ__ROLE')")
    def search(SearchCommand cmd, Long uid, Long eid) {
        if(cmd.validate()){
            def result = ownedEntityService.getRolesByUserAndOwnedEntity(uid, eid, params, cmd)
            if(result){ doSuccessWithArgs("general.done.ok", result) }
            doFail("general.done.KO")
        }
        else { throw new ValidationsException() }
    }

    /**
     * Searches for all roles which match with the specified params
     * @param cmd Search criteria:
     *                              q: Criteria for searching the roles
     * @return A json containing the roles' info if the operation was successful with the following structure
     * <p><code>{success: true|false, items:[{<param1>,...,<paramN>}}]</code></p>
     */
    @Secured("hasRole('READ__ROLE') and hasRole('READ_ALL__ROLE')")
    def searchAll(SearchCommand cmd) {
        if(cmd.validate()){
            def result = roleService.search(cmd, params)
            if(result){ doSuccessWithArgs("general.done.ok", result) }
            doFail("general.done.KO")
        }
        else { throw new ValidationsException() }
    }

    /**
     * Creates a new Role
     * @param cmd Role information:
     *                              label:          unique identifier for this role
     *                              description:    [optional] a brief description for this role
     *                              enabled:         [optional] whether the role is enabled or not
     * @return JSON informing whether the action was successful or not. If successful, it also contains the id of the
     * just created/edited role
     */
    @Secured("hasRole('CREATE__ROLE')")
    def create(RoleCommand cmd){
        final e = roleService.save(cmd)
        if(e){
            String p0 = g.message(code:"article.the_male_singular"), p1 = g.message(code:"security.role.role")
            doSuccessWithArgs(g.message(code: "general.action.CREATE.success", args: [p0, p1, "o"]) as String, [id: e.id])
        }
    }

    /**
     * Updates an existing role
     * @param cmd Role information:
     *                              label:          unique identifier for this role
     *                              description:    [optional] a brief description for this role
     *                              enabled:         [optional] whether the role is enabled or not
     * @param id Identifier of Role which is going to be edited
     * @return JSON informing whether the action was successful or not. If successful, it also contains the id of the
     * just created/edited role
     */
    @Secured("hasRole('UPDATE__ROLE')")
    def update(RoleCommand cmd, Long id){
        final e = roleService.save(cmd, id)
        if(e){
            String p0 = g.message(code:"article.the_male_singular"), p1 = g.message(code:"security.role.role")
            doSuccessWithArgs(g.message(code: "general.action.UPDATED.success", args: [p0, p1, "o"]) as String, [id: e.id])
        }
    }

    /**
     * Return a role's info
     * @param id Role's identifier
     * @return A json containing the role's info if the operation was successful with the following structure
     * <p><code>{success: true|false, item:{<param1>,...,<paramN>}}</code></p>
     */
    @Secured("hasRole('READ__ROLE')")
    def show(Long id){
        def e = roleService.show(id)
        if(e){ doSuccessWithArgs("general.done.ok", [item: e]) }
        else { doFail("general.done.KO") }
    }

    /**
     * Deletes a Role
     * @param id Role's identifier
     * @return  A json containing the role's id if the operation was successful with the following structure
     * <p><code>{success: true|false, id: <identifier></code></p>
     */
    @Secured("hasRole('DELETE__ROLE')")
    def delete(Long id){
        String p0 = g.message(code:"article.the_male_singular"), p1 = g.message(code:"security.role.role")
        final e = roleService.delete(id)
        if(e) { doSuccessWithArgs(g.message(code: "general.action.DELETE.success", args: [p0, p1, "o"]) as String, [id: id]) }
        else doFail "general.done.KO"
    }
    //endregion

    @Secured("hasRole('UPDATE__ROLE')")
    def activate (Long id, Boolean value){
        final e = roleService.activate(id, value)
        if(e) { doSuccessWithArgs("general.done.ok", [id: e.id]) }
        else doFail "general.done.KO"
    }

    /**
     * Returns a role's permissions by its id
     * @param id role's id
     * @return A <code>List</code> of permissions
     */
    @Secured("hasRole('READ__ROLE')")
    def permissions(Long id){
            final r = roleService.permissions(id, params)
            if(r){
                doSuccessWithArgs("general.done.ok", r)
            }
        else doFail "general.done.KO"
    }
}
