package security

import command.SearchCommand
import exceptions.ValidationsException
import org.springframework.http.HttpMethod
import org.springframework.security.access.annotation.Secured
import responseHandlers.ExceptionHandler

@Secured("hasRole('MANAGE__PERMISSION')")
class PermissionController implements ExceptionHandler{

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
        if(cmd.validate()){
            def result = permissionService.search(cmd, params)
            if(result){ doSuccessWithArgs("general.done.ok", result) }
            doFail("general.done.KO")
        }
        else { throw new ValidationsException() }
    }
}
