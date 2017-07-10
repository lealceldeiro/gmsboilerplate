/**
 * Created by asiel on 4/06/17.
 */

(function() {

    'use strict';

    angular
        .module('gmsBoilerplate')
        .controller('emailRequestCtrl', emailRequestCtrl);

    /*@ngInject*/
    function emailRequestCtrl(emailRequestSrv, systemSrv, translatorSrv, blockSrv, indexSrv, registerSrv, $timeout,
                              navigationSrv, dialogSrv, ROUTE) {
        var vm = this;

        var keyP = 'EMAIL_REQUEST';

        vm.wizard = {
            init: fnInit,
            sendEmail: fnSendEmail,

            checkEmail: fnCheckEmail
        };

        fnInit();

        //fn
        return vm.wizard;

        function fnInit() {
            indexSrv.setTitle('button.requestNewVerificationEmail');
        }

        function fnSendEmail(form) {
            if (form && form.$valid && vm.wizard.emailExists) {
                blockSrv.block();
                var fnKey = keyP + "fnSendEmail";
                emailRequestSrv.requestNewEmail(vm.wizard.email).then(function (data) {
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

        function fnCheckEmail() {
            vm.wizard.emailExists = false;
            if (typeof vm.id === 'undefined' || vm.id === null) {
                var fnKey = keyP + "fnCheckEmail";
                registerSrv.getByEmail(vm.wizard.email).then(
                    function (data) {
                        vm.wizard.emailExists = systemSrv.eval(data, fnKey);
                    }
                )
            }
        }

    }

}());