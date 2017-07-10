/**
 * Created by asiel on 1/05/17.
 */

(function() {

    'use strict';

    angular
        .module('gmsBoilerplate')
        .controller('configParamsCtrl', configParamsCtrl);

    /*@ngInject*/
    function configParamsCtrl(configSrv, systemSrv, blockSrv, ROUTE, navigationSrv, sessionSrv, $window, indexSrv) {

        var vm = this;
        var keyP = "ADMIN_CONFIG_PARAMS";

        vm.cached = {};

        vm.wizard = {
            entity: null,
            entityData: {},

            init: fnInit,
            cancel: fnCancel,
            save: fnSave
        };

        fnInit();

        return vm.wizard;

        //fn
        function fnInit() {
            if (typeof configSrv.config.multiEntity !== 'undefined' && configSrv.config.multiEntity !== null) {
                vm.wizard.entity = {
                    multiEntity: configSrv.config.multiEntity,
                    isUserRegistrationAllowed: configSrv.config.isUserRegistrationAllowed
                };
                Object.assign(vm.cached, configSrv.config);
            }
            else {
                _isMultiEntityApp();
            }
            indexSrv.setTitle('CONFIGURATION.configuration');
        }

        function _isMultiEntityApp() {
            blockSrv.setIsLoading(vm.wizard.entityData, true);
            configSrv.loadConfig().then(
                function (config) {
                    vm.wizard.entity= {multiEntity: configSrv.config.multiEntity};
                    Object.assign(vm.cached, configSrv.config);
                    blockSrv.setIsLoading(vm.wizard.entityData, false);
                }
            );
        }

        function fnCancel() {
            navigationSrv.goTo(ROUTE.MAIN);
        }

        function fnSave(form) {
            if (form && form.$valid) {
                var params = {
                    multiEntity: vm.wizard.entity.multiEntity,
                    isUserRegistrationAllowed: vm.wizard.entity.isUserRegistrationAllowed
                };
                var fnKey = keyP + "fnSave";
                configSrv.save(params, sessionSrv.currentUser().id).then(
                    function (data) {
                        if (systemSrv.eval(data, fnKey, true, true)) {
                            if (vm.cached.multiEntity !== vm.wizard.entity.multiEntity ||
                                vm.cached.isUserRegistrationAllowed !== vm.wizard.entity.isUserRegistrationAllowed) {
                                $window.location.reload();
                            }
                            else { fnCancel(); }
                        }
                    }
                )
            }
        }
    }

}());