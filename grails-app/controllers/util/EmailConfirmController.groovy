package util

import grails.plugin.springsecurity.annotation.Secured

@Secured('permitAll')
class EmailConfirmController {

    def emailConfirmService

    def userService

    def grailsLinkGenerator

    def verifySubscriber() {
        Map args = [header:"", body: "", actions:[[text:"", link:""]]]
        Integer result = emailConfirmService.verifySubscriber(params.tkn as String)
        switch (result) {
            case emailConfirmService.EMAIL_CONFIRMATION_OK:
                args.header = g.message(code: "subscription.confirmation.success")
                args.body = g.message(code: "subscription.confirmation.success.body")
                args.actions[0].text = g.message(code: "subscription.confirmation.success.goLoginPage")
                args.actions[0].link = g.createLink(uri: 'signin', absolute:true)
                break
            case emailConfirmService.EMAIL_CONFIRMATION_TOKEN_NOT_ASSOCIATED_TO_USER:
                args.header = g.message(code: "subscription.confirmation.failed.email.used")
                args.body = g.message(code: "subscription.confirmation.failed.email.used.body")
                args.actions[0].text = g.message(code: "subscription.confirmation.success.goLoginPage")
                args.actions[0].link = g.createLink(uri: '/signin', absolute:true)
                break
            case emailConfirmService.EMAIL_CONFIRMATION_TOKEN_NOT_FOUND:
                args.header = g.message(code: "subscription.confirmation.failed.email.expired")
                args.body = g.message(code: "subscription.confirmation.failed.email.expired.body")
                args.actions[0].text = g.message(code: "subscription.confirmation.failed.requestNewVerificationEmail")
                args.actions[0].link = g.createLink(controller: "emailConfirm", action: "requestVerificationEmail", absolute:true)
                break
            case emailConfirmService.EMAIL_CONFIRMATION_TOKEN_NOT_PROVIDED:
                args.header = g.message(code: "subscription.confirmation.failed.email.invalid")
                args.body = g.message(code: "subscription.confirmation.failed.email.invalid.body")
                args.actions[0].text = g.message(code: "subscription.confirmation.success.goLoginPage")
                args.actions[0].link = g.createLink(uri: '/signin', absolute:true)
                args.actions << [
                        text: g.message(code: "security.user.createAccount"),
                        link: g.createLink(uri: '/signup', absolute:true)
                ]
                break
        }
        render(view: "confirmResult", model: args)
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
