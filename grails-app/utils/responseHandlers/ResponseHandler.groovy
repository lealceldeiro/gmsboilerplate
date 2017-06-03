package responseHandlers

import grails.converters.JSON
import grails.converters.XML
import org.springframework.http.HttpStatus

/**
 * Created by asiel on 11/05/17.
 */
trait ResponseHandler {

    def doRender = { def object ->
        withFormat {
            json {
                render object as JSON
                return
            }
            xml {
                render object as XML
                return
            }
        }
    }

    def doSuccess (String successMessage) {
        Map r = [success: true, successMessage: g.message(code: successMessage)]
        doRender r
    }

    def doSuccessWithArgs (String successMessage, Map args) {
        Map r = [success: true, successMessage: g.message(code: successMessage)]+ args
        doRender r
    }

    def doFail(String errorMessage) {
        Map r = [success: false, errorMessage: g.message(code: errorMessage)]
        doRender r
    }

    def doFailWithArgs(String errorMessage, Map args) {
        Map r = [success: false, errorMessage: g.message(code: errorMessage)] + args
        doRender r
    }
    def doForbidden(String errorMessage) {
        response.status = HttpStatus.UNAUTHORIZED.value()
        doFail(errorMessage)
    }
}
