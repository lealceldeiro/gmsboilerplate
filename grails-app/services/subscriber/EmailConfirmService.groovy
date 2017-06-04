package subscriber

import grails.transaction.Transactional
import security.EUser

@Transactional
class EmailConfirmService {

    static EMAIL_CONFIRMATION_OK = 1
    static EMAIL_CONFIRMATION_TOKEN_NOT_FOUND = 2
    static EMAIL_CONFIRMATION_TOKEN_NOT_ASSOCIATED_TO_USER = 3
    static EMAIL_CONFIRMATION_TOKEN_NOT_PROVIDED = 4

    def verifySubscriber(String token = null) {
        if(token != null && token != ""){
            BEmailVerificationToken found = BEmailVerificationToken.findByToken(token)
            if(found) {
                EUser user = EUser.findByUsername(found.user.username)
                if(user) {
                    user.emailVerified = true
                    user.enabled = true
                    user.emailVerificationToken = null
                    user.save flush: true, failOnError: true
                    found.delete()
                    return EMAIL_CONFIRMATION_OK
                }
                else { return EMAIL_CONFIRMATION_TOKEN_NOT_ASSOCIATED_TO_USER }
            }
            else { return EMAIL_CONFIRMATION_TOKEN_NOT_FOUND }
        }
        else { return EMAIL_CONFIRMATION_TOKEN_NOT_PROVIDED }
    }
}
