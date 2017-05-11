package command.configuration

import grails.validation.Validateable

/**
 * Created by asiel on 1/05/17.
 */

@Validateable
class ConfigurationCommand {

    Long userId
    Boolean multiEntity = false
    String lan

    static constraints = {
        multiEntity nullable: true, blank: false
        lan nullable: true, blank: false
        userId nullable: true, blank: false
    }
}
