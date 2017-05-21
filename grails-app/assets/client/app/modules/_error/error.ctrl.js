/**
 * Created by asiel on 1/05/17.
 */

'use strict';

angular
    .module('gmsBoilerplate')
    .controller('errorCtrl', ['errorSrv', 'indexSrv', errorCtrl]);

function errorCtrl(errorSrv, indexSrv) {
    var vm = this;

    vm.wizard = {
        init: fnInit
    };

    fnInit();
    return vm.wizard;

    //fn
    function fnInit() {
        indexSrv.siteTile = 'Error';
        vm.wizard.title = errorSrv.title;
        vm.wizard.message = errorSrv.message;
    }
}