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

    @BindUsing({ object, source ->
        String r = (source['roles'] as String)
        r = r.substring(1, r.length() - 1).replaceAll(" ", "")
        r.split(',')
    })
    List<Long> roles

    static constraints = {
        name nullable: false, blank: false
        username nullable: false, blank: false
        roles nullable: false, blank: false
    }

    def call(){
        EOwnedEntity e = new EOwnedEntity(name: name, username: username, id: id)
        return e
    }
}
