package mail

import grails.transaction.Transactional

@Transactional
class EmailSenderService {

    def grailsApplication

    def mailService

    def sendSubscriptionVerification(def to, String subject, String bodyText, String buttonText, String buttonUrl) {
        send to, subject, "/email/emailConfirmationRequired", [bodyText: bodyText, buttonUrl: buttonUrl, buttonText: buttonText]
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
