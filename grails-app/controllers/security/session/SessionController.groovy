package security.session

import command.security.session.ReauthenticateCommand
import exceptions.ValidationsException
import org.springframework.http.HttpMethod
import org.springframework.security.access.annotation.Secured
import responseHandlers.ExceptionHandler

@Secured("isFullyAuthenticated()")
class SessionController implements ExceptionHandler{

    def ownedEntityService
    def configurationService
    def springSecurityService
    def userService
    def permissionService

    static allowedMethods = [
           reauthenticate   : HttpMethod.POST.name()
    ]

    def reauthenticate(ReauthenticateCommand cmd) {
        if(cmd.validate()){
            Long eid = cmd.e
            def user = userService.findByUsername(springSecurityService.principal.username as String)
            Long uid = user.id
            def roles = ownedEntityService.getRolesByUserAndOwnedEntity(uid, eid, [offset: 0, max: 0])

            if(roles){
                configurationService.setLastAccessedOwnedEntity(eid, uid)
                def permissions = permissionService.getPermissionsFromRoles(roles.items as List)
                //todo: "reauthenticate"? Spring
                doSuccessWithArgs("general.done.ok", [items: permissions])
            }
            else { doFail("session.user.has.no.role") }
        }
        else { throw new ValidationsException() }
    }
}
