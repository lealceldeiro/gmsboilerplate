/**
 * Created by asiel on 1/05/17.
 */

'use strict';
angular
    .module('gmsBoilerplate')
    .service('errorSrv', [errorSrv]);

function errorSrv() {
    var self = this;

    self.service = {
        title: null,
        message: null
    };

    return self.service;

    //
}