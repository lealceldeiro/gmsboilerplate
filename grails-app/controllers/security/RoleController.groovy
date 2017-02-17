package security

import command.SearchCommand
import command.security.role.RoleCommand
import grails.converters.JSON
import org.springframework.http.HttpMethod
import org.springframework.security.access.annotation.Secured

@Secured("hasRole('MANAGE__ROLE')")
class RoleController {

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
    def search(SearchCommand cmd, long uid, long eid) {
        def body = ['success': false]
        if(cmd.validate()){
            def result = ownedEntityService.getRolesByUserAndOwnedEntity(uid, eid, params, cmd)

            body.success = true
            body.total = result['total']
            body.items = result['items']
        }


        render body as JSON
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
        def body = ['success': false]
        if(cmd.validate()){
            def result = roleService.search(cmd, params)

            body.success = true
            body.total = result['total']
            body.items = result['items']
        }


        render body as JSON
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
        save(cmd)
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
    def update(RoleCommand cmd, long id){
        save(cmd, id)
    }

    protected save(RoleCommand cmd, long id = 0){
        def body = ['success' : false]

        final e = roleService.save(cmd, id)
        if(e){
            body.success = true
            body.id = e.id
        }

        render body as JSON
    }

    /**
     * Return a role's info
     * @param id Role's identifier
     * @return A json containing the role's info if the operation was successful with the following structure
     * <p><code>{success: true|false, item:{<param1>,...,<paramN>}}</code></p>
     */
    @Secured("hasRole('READ__ROLE')")
    def show(long id){
        def body = ['success' : false]
        def e = roleService.show(id)
        if(e){
            body.success = true
            body.item = e
        }
        render body as JSON
    }

    /**
     * Deletes a Role
     * @param id Role's identifier
     * @return  A json containing the role's id if the operation was successful with the following structure
     * <p><code>{success: true|false, id: <identifier></code></p>
     */
    @Secured("hasRole('DELETE__ROLE')")
    def delete(long id){
        def body = ['success': false]
        final e = roleService.delete(id)
        if(e){
            body.success = true
            body.id = id
        }
        render body as JSON
    }
    //endregion

    @Secured("hasRole('UPDATE__ROLE')")
    def activate (long id, boolean value){
        def body = ['success' : false]
        final e = roleService.activate(id, value)
        if(e){
            body.success = true
            body.id = e.id
        }

        render body as JSON
    }

    /**
     * Returns a role's permissions by its id
     * @param id role's id
     * @return A <code>List</code> of permissions
     */
    @Secured("hasRole('READ__ROLE')")
    def permissions(long id){
        def body = ['success': false]
        if(id){
            final r = roleService.permissions(id, params)
            if(r){
                body.success = true
                body.items = r['items']
                body.total = r['total']
            }
        }
        render body as JSON
    }
}
