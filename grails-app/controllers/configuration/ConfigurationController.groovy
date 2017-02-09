package configuration

import grails.converters.JSON
import org.springframework.http.HttpMethod
import org.springframework.security.access.annotation.Secured

@Secured("isFullyAuthenticated()")
class ConfigurationController {

    def configurationService
    def ownedEntityService

    static allowedMethods = [
            lastAccessedOwnedEntity: HttpMethod.GET.name()
    ]

    def lastAccessedOwnedEntity(){
        def body = ['success': false]
        long id = configurationService.getLastAccessedOwnedEntity()
        def r = ownedEntityService.show(id)
        if(r){
            body.success = true
            body.item = r
        }
        render body as JSON
    }
}
