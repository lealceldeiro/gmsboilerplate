package command.security.ownedentity

import grails.validation.Validateable
import org.grails.databinding.BindUsing
import security.EOwnedEntity

/**
 * Created by Asiel on 1/24/2017.
 */

@Validateable
class OwnedEntityCommand {

    long id

    String name
    String username
    String description

    static constraints = {
        name nullable: false, blank: false
        username nullable: false, blank: false
        description nullable: false, blank: false
    }

    def call(){
        EOwnedEntity e = new EOwnedEntity(name: name, username: username, id: id, description: description)
        return e
    }
}
