package command.security.role

import grails.validation.Validateable
import org.grails.databinding.BindUsing
import security.BRole

/**
 * Created by Asiel on 11/20/2016.
 */
@Validateable
class RoleCommand {

    long id
    String label
    String description
    boolean enabled

    @BindUsing({ object, source ->
        String p = (source['permissions'] as String)
        p = p.substring(1, p.length() - 1).replaceAll(" ", "")
        p.split(',')
    })
    List<Long> permissions

    static constraints = {
        label nullable: false, blank: false
        enabled nullable: true
        description nullable: true
        permissions nullable: false
    }

    def call(){
        BRole e = new BRole(label: label, description: description ? description : "security.role.no_found",
                enabled: enabled ? enabled : false)
        e.id = id
        return e
    }
}