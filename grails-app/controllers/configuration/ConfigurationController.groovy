package configuration

import command.SearchCommand
import command.configuration.ConfigurationCommand
import grails.converters.JSON
import org.springframework.http.HttpMethod
import org.springframework.security.access.annotation.Secured

@Secured("isFullyAuthenticated()")
class ConfigurationController {

    def configurationService
    def ownedEntityService

    static allowedMethods = [
            lastAccessedOwnedEntity : HttpMethod.GET.name(),
            getConfig               : HttpMethod.GET.name(),
            saveConfig              : HttpMethod.POST.name(),
            setLanguage              : HttpMethod.POST.name(),
            setLanguage              : HttpMethod.GET.name()
    ]

    /**
     * Return the last accessed Owned Entity's info given a user's id
     * @param userId User's id whose is being searched for the last accessed Owned Entity
     * @return A json containing the Owned Entity's info if the operation was successful with the following structure
     * <p><code>{success: true|false, item:{<param1>,...,<paramN>}}</code></p>
     */
    def lastAccessedOwnedEntity(long userId){
        def body = ['success': false]
        def id = configurationService.getLastAccessedOwnedEntity(userId)
        def r
        if(id == null){
            r = getDefaultOwnedEntityForUser(userId)
        }
        else {
            r = ownedEntityService.show(id as Long)
        }
        body.success = true
        body.item = r

        render body as JSON
    }

    private def getDefaultOwnedEntityForUser(Long userId){
        def r = ownedEntityService.searchByUser(new SearchCommand(), userId, [:])
        if(r && r.total > 0){
            configurationService.setLastAccessedOwnedEntity(r.items[0].id as Long, userId)
            return r.items[0]
        }
        return null
    }

    @Secured("permitAll")
    def getConfig(Long uid) {
        def body = ['success': false, 'items': ['multiEntity': false]]
        def me = configurationService.isMultiEntityApplication()
        if(me){
            body.items.multiEntity = true
        }
        if(uid){
            def lan = configurationService.getLanguage(uid)
            body.items.language = lan
        }
        body.success = true

        render body as JSON
    }

    @Secured("hasRole('MANAGE_CONFIGURATION')")
    def saveConfig(ConfigurationCommand cmd) {
        def body = ['success': false]
        if(cmd.validate()){
            configurationService.setIsMultiEntityApp(cmd.multiEntity)
            body.success = true
        }
        render body as JSON
    }

    @Secured("isFullyAuthenticated()")
    def setLanguage(ConfigurationCommand cmd) {
        def body = ['success': false]
        configurationService.setLanguage(cmd.userId, cmd.lan)
        body.success = true

        render body as JSON
    }

    @Secured("isFullyAuthenticated()")
    def getLanguage(ConfigurationCommand cmd) {
        def body = ['success': false]
        def lan = configurationService.getLanguage(cmd.userId)
        if(lan){
            body.item = lan
        }
        body.success = true

        render body as JSON
    }
}
