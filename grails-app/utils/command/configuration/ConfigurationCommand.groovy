package command.configuration

import grails.validation.Validateable

/**
 * Created by asiel on 1/05/17.
 */

@Validateable
class ConfigurationCommand {

    Boolean multiEntity = false

    static constraints = {
        multiEntity nullable: true, blank: false
    }
}
