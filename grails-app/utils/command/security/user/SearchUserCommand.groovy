package command.security.user

import command.SearchCommand
import grails.validation.Validateable

/**
 * Created by asiel on 10/05/17.
 */
@Validateable
class SearchUserCommand extends SearchCommand{
    List<Long> e
}
