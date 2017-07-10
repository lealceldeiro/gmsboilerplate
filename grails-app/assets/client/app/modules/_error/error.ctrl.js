/**
 * Created by asiel on 1/05/17.
 */

(function() {

    'use strict';

    angular
        .module('gmsBoilerplate')
        .controller('errorCtrl', errorCtrl);

    /*@ngInject*/
    function errorCtrl(errorSrv, indexSrv) {

        var vm = this;

        vm.wizard = {
            init: fnInit
        };

        fnInit();
        return vm.wizard;

        //fn
        function fnInit() {
            indexSrv.siteTitle = 'Error';
            vm.wizard.title = errorSrv.title;
            vm.wizard.message = errorSrv.message;
        }
    }

}());