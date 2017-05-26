/**
 * Created by asiel on 1/05/17.
 */

'use strict';

angular
    .module('gmsBoilerplate')
    .controller('configParamsCtrl', configParamsCtrl);

/*@ngInject*/
function configParamsCtrl(configSrv, $timeout, systemSrv, blockSrv, ROUTE, navigationSrv, sessionSrv, $window) {

    var vm = this;
    var keyP = "ADMIN_CONFIG_PARAMS";
    var retries = 0, MAX_RETRY = 3;

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
            vm.wizard.entity = {multiEntity: configSrv.config.multiEntity};
            Object.assign(vm.cached, configSrv.config);
        }
        else {
            _isMultiEntityApp();
        }
    }

    function _isMultiEntityApp() {
        blockSrv.setIsLoading(vm.wizard.entityData, true);
        var fnKey = keyP + "_isMultiEntityApp";
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
                multiEntity: vm.wizard.entity.multiEntity
            };
            var fnKey = keyP + "fnSave";
            configSrv.save(params, sessionSrv.currentUser().id).then(
                function (data) {
                    if (systemSrv.eval(data, fnKey, true, true)) {
                        if (vm.cached.multiEntity !== vm.wizard.entity.multiEntity) {
                            $window.location.reload();
                        }
                        else { fnCancel(); }
                    }
                }
            )
        }
    }
}