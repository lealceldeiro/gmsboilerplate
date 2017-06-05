/**
 * Created by asiel on 26/05/17.
 */

'use strict';

angular
    .module('gmsBoilerplate')
    .controller('registerCtrl', registerCtrl);

/*@ngInject*/
function registerCtrl(indexSrv, registerSrv, systemSrv, dialogSrv, blockSrv, translatorSrv, $timeout, navigationSrv, ROUTE,
                      configSrv) {
    var vm = this;

    var keyP = "registerCtrl";
    vm.wizard = {
        passwordMatch : {},
        init: fnInit,

        checkUsername: fnCheckUsername,
        checkEmail: fnCheckEmail,
        register: fnRegister,
        seeValidUser: fnSeeValidUser,
        checkPasswordMatch: fnCheckPasswordMatch
    };

    fnInit();

    return vm.wizard;

    //fn
    function fnInit() {
        if (angular.isDefined(configSrv.config.isUserRegistrationAllowed)) {
            if (!configSrv.config.isUserRegistrationAllowed) {
                navigationSrv.goTo(ROUTE.HOME);
            }
        } else {
            configSrv.loadConfig().then(
                function (config) {
                    if (!configSrv.config.isUserRegistrationAllowed) {
                        navigationSrv.goTo(ROUTE.HOME);
                    }
                }
            );
        }
        translatorSrv.setText("LOGIN.new_account", indexSrv, 'siteTitle');
    }

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

    function fnRegister(form) {
        if (form) {
            form.$setSubmitted();
            if (form.$valid && !vm.wizard.passwordMatch.notMatch && !vm.wizard.userTaken && !vm.wizard.emailTaken) {
                var params = {
                    username: vm.wizard.username,
                    name: vm.wizard.name,
                    email: vm.wizard.email,
                    password: vm.wizard.password,
                    enabled: false
                };
                blockSrv.block();

                var fnKey = keyP + "fnSave";
                registerSrv.registerSubscriber(params).then(function (data) {
                    var e = systemSrv.eval(data, fnKey, false, true);
                    if (e) {
                        vm.msg = {};
                        translatorSrv.setText("REGISTER.almost_finished", vm.msg, 'headline');
                        translatorSrv.setText("REGISTER.email_sent", vm.msg, 'text', {email: vm.wizard.email});
                        $timeout(function () {
                            dialogSrv.showDialog(dialogSrv.type.SUCCESS, vm.msg['headline'], vm.msg['text']);
                            vm.msg = {};
                        });
                        navigationSrv.goTo(ROUTE.HOME);
                    }
                    blockSrv.unBlock();
                })
            }
        }
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

