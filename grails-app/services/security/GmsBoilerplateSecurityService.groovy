package security

import grails.transaction.Transactional
import grails.util.Environment

@Transactional
class GmsBoilerplateSecurityService {

    def springSecurityService

    EUser authenticatedUser() {
        if (springSecurityService.isLoggedIn() && !(springSecurityService.principal instanceof String))
            return EUser.findByUsername(springSecurityService.principal.username as String)
        if (Environment.current == Environment.DEVELOPMENT) {
            return EUser.first()
        }
        return null
    }
}
