package util

import grails.transaction.Transactional
import security.EUser

@Transactional
class EmailConfirmService {

    def verifySubscriber(String token = null) {
        if(token != null){
            BEmailVerificationToken found = BEmailVerificationToken.findByToken(token)
            if(found) {
                EUser user = EUser.findByUsername(found.user.username)
                if(user) {
                    user.emailVerified = true
                    user.emailVerificationToken = null
                    user.save flush: true, failOnError: true
                    found.delete()
                    return true
                }
                else {
                    //todo
                }
            }
            else {
                //todo
            }
        }
        else {
            //todo
        }
    }
}
