package util

import grails.plugin.springsecurity.annotation.Secured

@Secured('permitAll')
class EmailConfirmController {

    def emailConfirmService

    def verifySubscriber() {
        boolean confirmed = emailConfirmService.verifySubscriber(params.tkn as String)
        if(confirmed) {
            render(view: "confirmed")
        }
    }
}
