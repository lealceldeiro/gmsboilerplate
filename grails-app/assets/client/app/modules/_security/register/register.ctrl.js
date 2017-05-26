/**
 * Created by asiel on 26/05/17.
 */

'use strict';

angular
.module('gmsBoilerplate')
.controller('registerCtrl', registerCtrl);

/*@ngInject*/
function registerCtrl(registerSrv, systemSrv, dialogSrv) {
    var vm = this;

    var keyP = "registerCtrl";
    vm.wizard = {
        passwordMatch : {},
        init: fnInit,

        checkUsername: fnCheckUsername,
        checkEmail: fnCheckEmail,
        register: fnRegister,
        seeValidUser: fnSeeValidUser,
        c2heckPasswordMatch: fnCheckPasswordMatch
    };

    fnInit();

    return vm.wizard;

    //fn
    function fnInit() {}

    function fnCheckUsername() {
        vm.wizard.userTaken = false;
        if (typeof vm.wizard.username !== 'undefined' && vm.wizard.username !== null) {
            var fnKey = keyP + "fnCheckUsername";
            registerSrv.getByUsername(vm.wizard.username).then(
                function (data) {
                    vm.wizard.userTaken = systemSrv.eval(data, fnKey);
                }
            )
        }
    }

    function fnCheckEmail() {
        vm.wizard.emailTaken = false;
        if (typeof vm.id === 'undefined' || vm.id === null) {
            var fnKey = keyP + "fnCheckUsername";
            registerSrv.getByEmail(vm.wizard.email).then(
                function (data) {
                    vm.wizard.emailTaken = systemSrv.eval(data, fnKey);
                }
            )
        }
    }
    
    function fnRegister() {
        console.log('to do');
    }

    function fnSeeValidUser() {
        dialogSrv.showDialogValidUser();
    }

    function fnCheckPasswordMatch() {
        delete vm.wizard.passwordMatch.notMatch;
        if (vm.wizard.password && vm.wizard.password2 &&
            vm.wizard.password != vm.wizard.password2) {
            vm.wizard.passwordMatch.notMatch = true;
        }
    }
}

