package security

import command.SearchCommand
import grails.converters.JSON
import org.springframework.http.HttpMethod
import org.springframework.security.access.annotation.Secured

@Secured("hasRole('MANAGE__PERMISSION')")
class PermissionController {

    def permissionService

    static allowedMethods = [
            search: HttpMethod.GET.name()
    ]

    /**
     * Searches for permissions which match with the specified params
     * @param cmd Search criteria:
     *                              q: Criteria for searching the permissions
     * @return A json containing the permissions' info if the operation was successful with the following structure
     * <p><code>{success: true|false, items:[{<param1>,...,<paramN>}}]</code></p>
     */
    @Secured("hasRole('READ__PERMISSION')")
    def search(SearchCommand cmd) {
        def body = ['success': false]
        if(cmd.validate()){
            def result = permissionService.search(cmd, params)

            body.success = true
            body.total = result['total']
            body.items = result['items']
        }


        render body as JSON
    }
}
