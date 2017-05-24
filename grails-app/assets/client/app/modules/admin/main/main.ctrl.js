/**
 * Created by Asiel on 11/6/2016.
 */

'use strict';

angular
    .module('gmsBoilerplate')
    .controller('mainCtrl', mainCtrl);

/*@ngInject*/
function mainCtrl(indexSrv) {

    var vm = this;

    vm.wizard = {
        init: fnInit
    };

    vm.wizard.init();

    return vm.wizard;

    //fn
    function fnInit() {
        indexSrv.siteTile = 'Main'
    }

}