/**
 * Created by asiel on 4/06/17.
 */

'use strict';

angular
    .module('gmsBoilerplate')
    .service('emailRequestSrv', emailRequestSrv);

/*@ngInject*/
function emailRequestSrv(baseSrv, $http, systemSrv) {
    var self = this;
    var url = systemSrv.APIAbsoluteUrl + 'email/';
    self.service = {
        requestNewEmail: fnRequestNewEmail
    };

    //fn
    return self.service;

    function fnRequestNewEmail(email) {
        return baseSrv.resolveDeferred($http.get(url + 'new?email=' + email));
    }
}