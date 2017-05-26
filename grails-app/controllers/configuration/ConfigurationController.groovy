package configuration

import command.SearchCommand
import command.configuration.ConfigurationCommand
import exceptions.ValidationsException
import org.springframework.http.HttpMethod
import org.springframework.security.access.annotation.Secured
import responseHandlers.ExceptionHandler

@Secured("isFullyAuthenticated()")
class ConfigurationController implements ExceptionHandler{

    def configurationService
    def ownedEntityService

    static allowedMethods = [
            lastAccessedOwnedEntity : HttpMethod.GET.name(),
            getConfig               : HttpMethod.GET.name(),
            saveConfig              : HttpMethod.POST.name(),
            setLanguage              : HttpMethod.POST.name(),
            getLanguage              : HttpMethod.GET.name()
    ]

    /**
     * Return the last accessed Owned Entity's info given a user's id
     * @param userId User's id whose is being searched for the last accessed Owned Entity
     * @return A json containing the Owned Entity's info if the operation was successful with the following structure
     * <p><code>{success: true|false, item:{<param1>,...,<paramN>}}</code></p>
     */
    def lastAccessedOwnedEntity(Long userId){
        def id = configurationService.getLastAccessedOwnedEntity(userId)
        def r
        r = id == null ? getDefaultOwnedEntityForUser(userId) : ownedEntityService.show(id as Long)

        doSuccessWithArgs("general.done.ok", [item: r])
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
        def args = ['multiEntity': false, 'isUserRegistrationAllowed': false, language: ""]
        def me = configurationService.isMultiEntityApplication()
        def ar = configurationService.isUserRegistrationAllowed()
        if(me) args.multiEntity = true
        if(ar) args.isUserRegistrationAllowed = true

        if(uid){
            def lan = configurationService.getLanguage(uid)
            args.language = lan
        }

        doSuccessWithArgs("general.done.ok", [items: args])
    }

    @Secured("hasRole('MANAGE__CONFIGURATION')")
    def saveConfig(ConfigurationCommand cmd) {
        if(cmd.validate()) configurationService.setIsMultiEntityApp(cmd.multiEntity)
        else throw new ValidationsException()
        doSuccess "general.done.ok"
    }

    @Secured("isFullyAuthenticated()")
    def setLanguage(ConfigurationCommand cmd) {
        configurationService.setLanguage(cmd.userId, cmd.lan)
        doSuccess "general.done.ok"
    }

    @Secured("isFullyAuthenticated()")
    def getLanguage(ConfigurationCommand cmd) {
        Map args = [:]
        def lan = configurationService.getLanguage(cmd.userId)
        if(lan){
            args.item = lan
        }
        doSuccessWithArgs("general.done.ok", args)
    }
}
