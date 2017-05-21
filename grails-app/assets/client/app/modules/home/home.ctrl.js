/**
 * Created by asiel on 15/05/17.
 */

'use strict';

angular
    .module('gmsBoilerplate')
    .controller('homeCtrl', [homeCtrl]);

function homeCtrl() {
    var vm = this;

    vm.wizard = {
        init: fnInit
    };

    fnInit();

    return vm.wizard;

    //fn
    function fnInit() {
    }
}