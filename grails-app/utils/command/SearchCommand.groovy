package command

import grails.validation.Validateable

/**
 * Created by Asiel on 12/17/2016.
 */
@Validateable
class SearchCommand {
    /**
     * Criteria for searching role(s)
     */
    String q

    static constraints = {
        q nullable: true, blank: false
    }
}
