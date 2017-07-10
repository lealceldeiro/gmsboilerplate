/**
 * Created by asiel on 26/05/17.
 */

(function() {

    'use strict';

    angular
        .module('gmsBoilerplate')
        .service('registerSrv', registerSrv);

    /*@ngInject*/
    function registerSrv(baseSrv, $http, systemSrv) {
        var self = this;
        var url = systemSrv.APIAbsoluteUrl + 'user/';
        self.service = {
            getByUsername: fnGetByUsername,
            getByEmail: fnGetByEmail,
            registerSubscriber: fnRegisterSubscriber
        };

        return self.service;

        //fn
        function fnGetByUsername(username) {
            return baseSrv.resolveDeferred($http.get(url + 'taken?username=' + username))
        }
        function fnGetByEmail(email) {
            return baseSrv.resolveDeferred($http.get(url + 'taken?email=' + email))
        }

        function fnRegisterSubscriber(params) {
            return baseSrv.resolveDeferred($http.put(url + 'register', params))
        }
    }

}());