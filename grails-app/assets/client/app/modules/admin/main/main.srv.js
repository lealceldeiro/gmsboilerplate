/**
 * Created by Asiel on 11/6/2016.
 */

(function() {

    'use strict';

    angular
        .module('gmsBoilerplate')
        .service('mainSrv', mainSrv);

    /*@ngInject*/
    function mainSrv() {

        var self = this;


        self.service = {
        };

        return self.service;
    }

}());