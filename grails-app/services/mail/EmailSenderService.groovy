package mail

import grails.transaction.Transactional

@Transactional
class EmailSenderService {

    def grailsApplication

    def mailService

    def sendSubscriptionVerification(def to, String subject, String bodyText, String buttonText, String token) {
        send to, subject, "/email/emailConfirmationRequired", [bodyText: bodyText, token: token, buttonText: buttonText]
    }

    private send(def toWho, String mSubject, String viewToBeRendered, Map args) {
        mailService.sendMail {
            to toWho as String
            subject mSubject
            from grailsApplication.config.grails.mail.from as String
            html view: viewToBeRendered, model: args
        }
    }

}
