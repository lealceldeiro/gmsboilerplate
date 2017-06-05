package subscriber

import exceptions.ValidationsException
import grails.plugin.springsecurity.annotation.Secured
import org.springframework.http.HttpMethod
import responseHandlers.ExceptionHandler

@Secured('permitAll')
class SubscriberEmailController implements ExceptionHandler{

    def emailConfirmService

    def userService

    def grailsLinkGenerator

    static allowedMethods = [
            verifySubscriber                : HttpMethod.GET.name(),
            requestNewVerificationEmail     : HttpMethod.GET.name(),
    ]

    def verifySubscriber() {
        Integer result = emailConfirmService.verifySubscriber(params.tkn as String)
        Map args = [message: "", code: result]
        boolean success = false
        String messageCode = ""

        switch (result) {
            case emailConfirmService.EMAIL_CONFIRMATION_OK:
                success = true
                messageCode = "subscription.confirmation.success"
                args.message = g.message(code: "subscription.confirmation.success.body")
                break
            case emailConfirmService.EMAIL_CONFIRMATION_TOKEN_NOT_ASSOCIATED_TO_USER:
                messageCode = "subscription.confirmation.failed.email.used"
                args.message = g.message(code: "subscription.confirmation.failed.email.used.body")
                break
            case emailConfirmService.EMAIL_CONFIRMATION_TOKEN_NOT_FOUND:
                messageCode = "subscription.confirmation.failed.email.expired"
                args.message = g.message(code: "subscription.confirmation.failed.email.expired.body")
                break
            case emailConfirmService.EMAIL_CONFIRMATION_TOKEN_NOT_PROVIDED:
                messageCode = "subscription.confirmation.failed.email.invalid"
                args.message = g.message(code: "subscription.confirmation.failed.email.invalid.body")
                break
        }
        if(success) { doSuccessWithArgs(messageCode, [items: args]) }
        else { doFailWithArgs(messageCode, [items: args]) }
    }

    def requestNewVerificationEmail(){
        final String emailText = g.message(code: "subscription.confirmation.required.text", args: [grailsLinkGenerator.serverBaseURL]),
                     subButtonText = g.message(code: "subscription.confirmation.required.button"),
                     subject = g.message(code: "subscription.confirmation.required.subject"),
                     confirmBaseUrl = g.createLink(uri: "/email/verification/", absolute:true)
        String email = params.email
        if(email != null && email != ""){
            final def r = userService.requestNewVerificationEmail(email, subject, emailText, subButtonText, confirmBaseUrl)
            if(r){
                String p0 = g.message(code:"article.the_male_singular"), p1 = g.message(code:"security.user.user")
                doSuccessWithArgs(g.message(code: "general.action.CREATE.success", args: [p0, p1, "o"]) as String, [id: r.id])
            }
            else doFail("subscription.error.generating.email")
        }
        else { throw new ValidationsException() }
    }

}
