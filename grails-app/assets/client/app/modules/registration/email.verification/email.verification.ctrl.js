/**
 * Created by asiel on 3/06/17.
 */

'use strict';

angular
    .module('gmsBoilerplate')
    .controller('emailVerificationCtrl', emailVerificationCtrl);

/*@ngInject*/
function emailVerificationCtrl(emailVerificationSrv, navigationSrv, systemSrv, translatorSrv, blockSrv) {
    var vm = this;

    var keyP = 'EMAIL_';

    vm.wizard = {
        code: {
            "EMAIL_CONFIRMATION_OK": 1,
            "EMAIL_CONFIRMATION_TOKEN_NOT_FOUND": 2,
            "EMAIL_CONFIRMATION_TOKEN_NOT_ASSOCIATED_TO_USER": 3,
            "EMAIL_CONFIRMATION_TOKEN_NOT_PROVIDED": 4
        },
        response: {
            code: 1,
            header: "",
            message: ""
        },
        init: fnInit
    };

    fnInit();

    //fn
    return vm.wizard;

    function fnInit() {
        blockSrv.block();
        translatorSrv.setText("REGISTER.verify_email", indexSrv, 'siteTitle');
        var params = navigationSrv.currentParams();
        if (params && params['token']) {
            var fnKey = keyP + "fnInit-verifySubscriber";
            emailVerificationSrv.verifySubscriber(params['token']).then(function (data) {
                    var e = systemSrv.eval(data, fnKey, false, true);
                    vm.wizard.response = systemSrv.getItems(fnKey);
                    vm.wizard.response.header = systemSrv.getMessage(fnKey);
                    blockSrv.unBlock();
                }
            )
        }
    }

}