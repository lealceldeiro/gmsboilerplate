/**
 * Created by Asiel on 11/6/2016.
 */

'use strict';

angular
    .module('gmsBoilerplate')
    .service('indexSrv', indexSrv);

/*@ngInject*/
function indexSrv() {

    var self = this;

    self.service = {
        siteTile: ''
    };

    return self.service;
}