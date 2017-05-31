package mail

import grails.transaction.Transactional

@Transactional
class EmailSenderService {

    def grailsApplication

    def mailService

    def sendSubscriptionVerification(def to, String subject, String bodyText, String buttonText, String confirmUrl) {
        send to, subject, "/email/emailConfirmationRequired",
                [bodyText: bodyText, confirmUrl: confirmUrl, buttonText: buttonText]
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
