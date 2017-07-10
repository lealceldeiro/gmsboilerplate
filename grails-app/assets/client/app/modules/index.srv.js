/**
 * Created by Asiel on 11/6/2016.
 */

(function() {

    'use strict';

    angular
        .module('gmsBoilerplate')
        .service('indexSrv', indexSrv);

    /*@ngInject*/
    function indexSrv(translatorSrv) {

        var self = this;

        self.service = {
            siteTitle: '',
            setTitle: fnSetTitle
        };

        return self.service;

        function fnSetTitle(i18nTitle) {
            translatorSrv.setText(i18nTitle, self.service, 'siteTitle');
        }
    }

}());