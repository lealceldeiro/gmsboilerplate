package util

import grails.plugin.springsecurity.annotation.Secured

@Secured('permitAll')
class EmailConfirmController {

    def emailConfirmService

    def verifySubscriber() {
        Map args = [header:"", body: ""]
        Integer result = emailConfirmService.verifySubscriber(params.tkn as String)
        switch (result) {
            case emailConfirmService.EMAIL_CONFIRMATION_OK:
                args.header = g.message(code: "subscription.confirmation.success")
                args.body = g.message(code: "subscription.confirmation.success.body")
                break
            case emailConfirmService.EMAIL_CONFIRMATION_TOKEN_NOT_ASSOCIATED_TO_USER:
                args.header = g.message(code: "subscription.confirmation.failed.email.used")
                args.body = g.message(code: "subscription.confirmation.failed.email.used.body")
                break
            case emailConfirmService.EMAIL_CONFIRMATION_TOKEN_NOT_FOUND:
                args.header = g.message(code: "subscription.confirmation.failed.email.expired")
                args.body = g.message(code: "subscription.confirmation.failed.email.expired.body")
                break
            case emailConfirmService.EMAIL_CONFIRMATION_TOKEN_NOT_PROVIDED:
                args.header = g.message(code: "subscription.confirmation.failed.email.invalid")
                args.body = g.message(code: "subscription.confirmation.failed.email.invalid.body")
                break
        }
        render(view: "confirmResult", model: args)
    }
}
