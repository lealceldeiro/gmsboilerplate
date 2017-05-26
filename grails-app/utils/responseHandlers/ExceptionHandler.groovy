package responseHandlers

import exceptions.CannotDeleteDueToAssociationException
import exceptions.CannotDeleteSystemElementException
import exceptions.GenericException
import exceptions.NotAssignedToException
import exceptions.NotFoundException
import exceptions.ValidationsException
import org.springframework.http.HttpStatus

/**
 * Created by asiel on 11/05/17.
 */
trait ExceptionHandler implements ResponseHandler{

    def handleException (Exception ex) {
        response.status = HttpStatus.INTERNAL_SERVER_ERROR.value()
        doFail(ex.message)
    }

    def handleNotFoundException(NotFoundException ex) {
        String err = g.message(code: ex.i18nMainMessage, args:[g.message(code:ex.i18nNotFoundEntity), ex.male ? "o" : "a"])
        response.status = HttpStatus.OK.value()
        doFail(err)
    }

    def handleNotAssignedToException(NotAssignedToException ex) {
        String from = g.message(code: ex.i18nFrom)
        String to = g.message(code: ex.i18nTo)
        String err = g.message(code: ex.i18nMainMessage, args:[ex.maleFrom ? "El" : "La", from,
                                                               ex.maleFrom ? "o" : "a", ex.maleTo ? "o" : "a",
                                                               to])
        response.status = HttpStatus.OK.value()
        doFail(err)
    }

    def handleCannotDeleteDueToAssociationException(CannotDeleteDueToAssociationException ex) {
        String who = g.message(code: ex.i18nWho)
        String with = g.message(code: ex.i18nWith)
        String err = g.message(code: ex.i18nMainMessage, args:[ex.maleWho ? "el" : "la", who,
                                                               ex.maleWith ? "o" : "a", ex.maleWith ? "" : "a",
                                                               with])
        response.status = HttpStatus.OK.value()
        doFail(err)
    }

    def handleValidationsException(ValidationsException ex) {
        response.status = HttpStatus.OK.value()
        String err = g.message(code:"general.exception.information.incorrect")
        if(ex.i18nMainMessage) {
            err = g.message(code: ex.i18nMainMessage) as String
        }
        doFail(err)
    }

    def handleGenericException(GenericException ex) {
        response.status = HttpStatus.OK.value()
        String err = g.message(code:"general.done.KO")
        if(ex.i18nMainMessage) {
            err = g.message(code: ex.i18nMainMessage) as String
        }
        doFail(err)
    }

    def handleCannotDeleteSystemElementException(CannotDeleteSystemElementException ex) {
        response.status = HttpStatus.OK.value()
        String err = g.message(code:"general.done.KO")
        if(ex.i18nMainMessage) {
            err = g.message(code: ex.i18nMainMessage) as String
        }
        doFail(err)
    }

}
