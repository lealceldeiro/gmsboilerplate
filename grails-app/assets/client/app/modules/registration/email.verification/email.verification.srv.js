/**
 * Created by asiel on 3/06/17.
 */

(function() {

    'use strict';

    angular
        .module('gmsBoilerplate')
        .service('emailVerificationSrv', emailVerificationSrv);

    /*@ngInject*/
    function emailVerificationSrv(baseSrv, $http, systemSrv) {
        var self = this;
        var url = systemSrv.APIAbsoluteUrl + 'email/';
        self.service = {
            verifySubscriber: fnVerifySubscriber
        };

        //fn
        return self.service;

        function fnVerifySubscriber(token) {
            return baseSrv.resolveDeferred($http.get(url + 'verify/subscription?tkn=' + token));
        }
    }

}());