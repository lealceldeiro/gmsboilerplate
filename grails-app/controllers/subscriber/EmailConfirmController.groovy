package subscriber

import grails.plugin.springsecurity.annotation.Secured
import org.springframework.http.HttpMethod
import responseHandlers.ExceptionHandler

@Secured('permitAll')
class EmailConfirmController implements ExceptionHandler{

    def emailConfirmService

    def userService

    def grailsLinkGenerator

    static allowedMethods = [
            verifySubscriber    : HttpMethod.GET.name(),
    ]

    @Secured('permitAll')
    def verifySubscriber() {
        Integer result = emailConfirmService.verifySubscriber(params.tkn as String)
        Map args = [message: "", code: result]
        boolean success = false
        String messageCode = ""

        switch (result) {
            case emailConfirmService.EMAIL_CONFIRMATION_OK:
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
                     confirmBaseUrl = g.createLink(controller: "emailConfirm", action: "verifySubscriber", absolute:true)
        String email = params.email
        if(email != null && email != ""){
            Boolean r = userService.requestNewVerificationEmail(email, subject, emailText, subButtonText, confirmBaseUrl)

            if(r){
                //todo
            }
            else {
                //todo
            }
        }
        else {
            //todo
        }



    }

    def requestVerificationEmail (){
        render view: "/email/requestVerificationEmail"
    }
}
