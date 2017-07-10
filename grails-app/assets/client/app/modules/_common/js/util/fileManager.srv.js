/**
 * Created by asiel on 28/06/17.
 */

(function() {

    'use strict';

    angular
        .module('gmsBoilerplate')
        .service('fileManagerSrv', fileManagerSrv);

    /*@ngInject*/
    function fileManagerSrv(baseSrv, Upload) {
        var self = this;

        self.service = {
            sendFile: fnSendFile
        };

        return self.service;

        function fnSendFile(userId, file, url, fileName) {
            return baseSrv.resolveDeferred(Upload.upload({'url': url, 'data': {'userId': userId, 'file': file, 'fileName': fileName}}))
        }
    }

}());
