/**
 * Created by asiel on 26/05/17.
 */

'use strict';

angular
    .module('gmsBoilerplate')
    .service('registerSrv', registerSrv);

/*@ngInject*/
function registerSrv(baseSrv, $http, systemSrv) {
    var self = this;
    var url = systemSrv.APIAbsoluteUrl;
    self.service = {
        getByUsername: fnGetByUsername,
        getByEmail: fnGetByEmail
    };

    return self.service;

    //fn
    function fnGetByUsername(username) {
        return baseSrv.resolveDeferred($http.get(url + 'user/taken?username=' + username))
    }
    function fnGetByEmail(email) {
        return baseSrv.resolveDeferred($http.get(url + 'user/taken?email=' + email))
    }
}