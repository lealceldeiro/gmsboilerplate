/**
 * Created by Asiel on 11/20/2016.
 */

'use strict';

angular
    .module('gmsBoilerplate')
    .factory('envValidityChecker', interceptor)
    .config(conf);

/*@ngInject*/
function interceptor(sessionSrv, systemSrv, notificationSrv, $rootScope, BROADCAST) {

    var SERVER_ERROR = 500;
    var FORBIDDEN = 403;
    var noConnNotified = false;

    function request(req) {
        var lan = sessionSrv.getLanguage();
        if (lan) {
            req.headers['Accept-Language'] = lan;
            req.headers['Content-Language'] = lan;
        }
        //AUTH
        var token = sessionSrv.securityToken();
        if (token) {
            //put custom header for sending the token along with request
            req.headers[systemSrv.header_auth_token_req] = (systemSrv.header_auth_bearer_req ?
                    systemSrv.header_auth_bearer_req + " " : "") + token;   //if bearer present, otherwise, put just token
        }

        return req;
    }

    function responseError(rejection) {
        if(rejection.status === systemSrv.unauthorized_code_resp){
            noConnNotified = false;
            if (sessionSrv.isLogged()) {
                // do not show messages when a 401 for token expired occurred and user is logged in, since a new one is going to be retrieved
                notificationSrv.mutedNotifications = true;
                $rootScope.$broadcast(BROADCAST.auth.REFRESH_TOKEN);
            }
            else {
                if (!notificationSrv.mutedNotifications) {
                    notificationSrv.showNotification(notificationSrv.type.ERROR, notificationSrv.utilText.unauthorized);
                }
                if (!notificationSrv.doNotDoUNAUTHORIZED_BACKWARD) {
                    $rootScope.$broadcast(BROADCAST.auth.UNAUTHORIZED_BACKWARD);
                }
            }

        }
        else if(rejection.status === FORBIDDEN){
            noConnNotified = false;
            $rootScope.$broadcast(BROADCAST.auth.UNAUTHORIZED_BACKWARD);
        }
        else if(!noConnNotified && rejection.status === -1 && !rejection.data && !rejection.statusText) {
            noConnNotified = true;
            notificationSrv.showNotification(notificationSrv.type.ERROR, notificationSrv.utilText.no_response_from_server);
        }
        else if (rejection.status === SERVER_ERROR) {
            notificationSrv.showNotification(notificationSrv.type.ERROR, notificationSrv.utilText.server_error);
        }
    }

    return {
        request: request,
        responseError: responseError
    };

}

/*@ngInject*/
function conf($httpProvider) {
    $httpProvider['interceptors'].push('envValidityChecker');
}