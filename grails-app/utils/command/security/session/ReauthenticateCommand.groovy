package command.security.session

import grails.validation.Validateable

/**
 * Created by asiel on 13/06/17.
 */
@Validateable
class ReauthenticateCommand {
    Long e

    static constraints = {
        e nullable: false, blank: false
    }
}
