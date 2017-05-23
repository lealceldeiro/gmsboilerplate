import grails.plugin.springsecurity.rest.credentials.AbstractJsonPayloadCredentialsExtractor
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken

import javax.servlet.http.HttpServletRequest

/**
 * Created by asiel on 21/05/17.
 */
class DefaultJsonPayloadCredentialsExtractor extends AbstractJsonPayloadCredentialsExtractor {
    String usernamePropertyName = 'usrnm' //check this later: these properties should be configured by the security plugin
    String passwordPropertyName = 'pswrd'

    def userService

    UsernamePasswordAuthenticationToken extractCredentials(HttpServletRequest httpServletRequest) {
        def jsonBody = getJsonBody(httpServletRequest)
        String us = "--"
        String pass = "--"
        if (jsonBody) {
            String usernameOrEmail = jsonBody."${usernamePropertyName}"
            String password = jsonBody."${passwordPropertyName}"
            def e = userService.getBy([username: usernameOrEmail, email: usernameOrEmail], true)
            if(e) {
                us = e.username
                pass = password
            }
        }
        return new UsernamePasswordAuthenticationToken(us, pass)
    }
}
