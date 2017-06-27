package security.session

import command.security.session.ReauthenticateCommand
import exceptions.ValidationsException
import org.springframework.http.HttpMethod
import org.springframework.security.access.annotation.Secured
import responseHandlers.ExceptionHandler

@Secured("isFullyAuthenticated()")
class SessionController implements ExceptionHandler{

    def grailsApplication

    def ownedEntityService
    def configurationService
    def userService
    def permissionService

    def springSecurityService
    def tokenGenerator
    def tokenStorageService

    static allowedMethods = [
           reauthenticate   : HttpMethod.POST.name()
    ]

    def reauthenticate(ReauthenticateCommand cmd) {
        if(cmd.validate()){
            Long eid = cmd.e
            String username = springSecurityService.principal.username as String
            def user = userService.findByUsername(username)
            Long uid = user.id
            def roles = ownedEntityService.getRolesByUserAndOwnedEntity(uid, eid, [offset: 0, max: 0])

            if(roles){
                configurationService.setLastAccessedOwnedEntity(eid, uid)
                Set permissions = permissionService.getPermissionsFromRoles(roles.items as List)

                String authoritiesVar = grailsApplication.config.grails.plugin.springsecurity.rest.token.rendering.authoritiesPropertyName

                springSecurityService.reauthenticate(username)
                String tokenValue = tokenGenerator.generateAccessToken(springSecurityService.principal).accessToken
                tokenStorageService.storeToken(tokenValue, springSecurityService.principal)

                Map args = ['access_token': tokenValue]
                args.putAt(authoritiesVar, permissions)

                doSuccessWithArgs("general.done.ok", args)
            }
            else { doFail("session.user.has.no.role") }
        }
        else { throw new ValidationsException() }
    }
}
