package lan

import org.springframework.web.servlet.support.RequestContextUtils as RCU

import javax.servlet.http.HttpServletRequest

/**
 * Created by asiel on 11/05/17.
 */
class LangChecker {

    static getLocale(HttpServletRequest request) {
        return String.valueOf(RCU.getLocale(request))
    }

}