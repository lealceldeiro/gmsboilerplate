/**
 * Created by Asiel on 11/6/2016.
 */

'use strict';

angular
    .module('gmsBoilerplate')
    .controller('sessionCtrl', sessionCtrl);

/*@ngInject*/
function sessionCtrl(sessionSrv, navigationSrv, ROUTE, systemSrv, configSrv, $translate, $rootScope, BROADCAST) {

    var vm = this;
    var keyP = "__SESSIONCTRL__";

    vm.wizard = {
        isMultiEntityApp: false,

        init: fnInit,

        logout: fnLogout,
        go: goTo,

        viewProfile: fnViewProfile
    };

    vm.wizard.init();

    //region show/hiders
    vm.wizard.can = sessionSrv.can;
    //endregion

    return vm.wizard;

    //fn
    function fnInit() {
        if (angular.isDefined(configSrv.config.multiEntity)) {
            vm.wizard.isMultiEntityApp = configSrv.config.multiEntity;
        }
        else { _loadConfig(); }
        if (sessionSrv.isLogged()) {
            vm.wizard.user = sessionSrv.currentUser();
            vm.wizard.oEntity = sessionSrv.loginEntity();
            vm.wizard.permissions = sessionSrv.getPermissions();

            var lan = sessionSrv.getLanguage();
            if(lan){
                configSrv.changeLanguage(lan, true);
                $rootScope.$broadcast(BROADCAST.language.CHANGED, {lan: lan});
            } else {
                var fnKey = keyP + "fnInit-getConfigLanguage";
                configSrv.getConfigLanguage(vm.wizard.user.id).then(
                    function (data) {
                        var it = systemSrv.eval(data, fnKey);
                        if (it) {
                            it = systemSrv.getItem(fnKey);
                            if (!it) {
                                it = $translate.preferredLanguage();
                            }
                        }
                        else { it = $translate.preferredLanguage(); }
                        configSrv.changeLanguage(it);
                        $rootScope.$broadcast(BROADCAST.language.CHANGED, {lan: it});
                    }
                )
            }
            navigationSrv.goTo(ROUTE.MAIN)
        }
        else {
            navigationSrv.goTo(navigationSrv.LOGIN_PATH);
        }
    }

    function fnLogout() {
        sessionSrv.logOut();
        navigationSrv.goTo(ROUTE.LOGIN);
    }

    function goTo(r) {
        navigationSrv.goTo(r);
    }

    function fnViewProfile() {
        navigationSrv.goTo(ROUTE.USER_PROFILE);
    }

    function _loadConfig() {
        configSrv.loadConfig().then(
            function (config) {
                vm.wizard.isMultiEntityApp = configSrv.config.multiEntity
            }
        );
    }
}