package configuration

import command.SearchCommand
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

    def lastAccessedOwnedEntity(Long userId){
        def body = ['success': false]
        def id = configurationService.getLastAccessedOwnedEntity(userId)
        def r
        if(id == null){
            r = getDefaultOwnedEntity(userId)
        }
        else {
            r = ownedEntityService.show(id as Long)
        }
        body.success = true
        body.item = r

        render body as JSON
    }

    def getDefaultOwnedEntity(Long userId){
        def r = ownedEntityService.searchByUser(new SearchCommand(), userId, [:])
        if(r && r.total > 0){
            configurationService.setLastAccessedOwnedEntity(r.items[0].id as Long, userId)
            return r.items[0]
        }
        return null
    }
}
