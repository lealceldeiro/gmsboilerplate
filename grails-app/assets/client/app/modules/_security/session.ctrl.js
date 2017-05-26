/**
 * Created by Asiel on 11/6/2016.
 */

'use strict';

angular
    .module('gmsBoilerplate')
    .controller('sessionCtrl', sessionCtrl);

/*@ngInject*/
function sessionCtrl(sessionSrv, navigationSrv, ROUTE, systemSrv, configSrv, $timeout, $translate) {

    var vm = this;
    var keyP = "__SESSIONCTRL__";
    var MAX_RETRY = 3, retries = 0;

    vm.wizard = {
        lan: {
            'spanish': 'es',
            'english': 'en'
        },
        isMultiEntityApp: false,

        init: fnInit,

        logout: fnLogout,
        go: goTo,

        viewProfile: fnViewProfile,

        changeLanguage: fnChangeLanguage
    };

    vm.wizard.init();

    //region show/hiders
    var up = systemSrv.grant;
    vm.wizard.can = {
        conf:               function () { return (has(up.MANAGE_CONFIGURATION)) },

        manageOwnedEntity:  function () { return has(up.MANAGE_OWNED_ENTITY) && (vm.wizard.can.createOwnedEntity() || vm.wizard.can.readOwnedEntity()|| vm.wizard.can.readAllOwnedEntity()) },
        readOwnedEntity:    function () { return has([up.READ_OWNED_ENTITY, up.READ_ALL_OWNED_ENTITY], true) },
        readAllOwnedEntity: function () { return has([up.READ_ALL_OWNED_ENTITY]) },
        createOwnedEntity:  function () { return has(up.CREATE_OWNED_ENTITY) },
        updateOwnedEntity:  function () { return has(up.UPDATE_OWNED_ENTITY) },
        deleteOwnedEntity:  function () { return has(up.DELETE_OWNED_ENTITY) },

        manageUser:         function () { return has(up.MANAGE_USER) && (vm.wizard.can.createUser() || vm.wizard.can.readUser() || vm.wizard.can.readAllUser()) },
        readUser:           function () { return has([up.READ_USER, up.READ_ALL_USER], true) },
        readAllUser:        function () { return has(up.READ_ALL_USER) },
        createUser:         function () { return has(up.CREATE_USER) },
        updateUser:         function () { return has(up.UPDATE_USER) },
        deleteUser:         function () { return has(up.DELETE_USER) },

        manageRole:         function () { return has(up.MANAGE_ROLE) && (vm.wizard.can.createRole() || vm.wizard.can.readRole() || vm.wizard.can.readAllRole()) },
        readRole:           function () { return has(up.READ_ROLE) },
        readAllRole:        function () { return has(up.READ_ALL_ROLE) },
        createRole:         function () { return has(up.CREATE_ROLE) },
        updateRole:         function () { return has(up.UPDATE_ROLE) },
        deleteRole:         function () { return has(up.DELETE_ROLE) },

        managePermission:   function () { return has(up.MANAGE_PERMISSION) && (vm.wizard.can.createPermission() || vm.wizard.can.readPermission()) },
        readPermission:     function () { return has(up.READ_PERMISSION) },
        createPermission:   function () { return has(up.CREATE_PERMISSION) },
        updatePermission:   function () { return has(up.UPDATE_PERMISSION) },
        deletePermission:   function () { return has(up.DELETE_PERMISSION) }
    };
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
                fnChangeLanguage(lan, true);
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
                        fnChangeLanguage(it);
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

    function fnChangeLanguage(lan, doNotPersist) {
        $translate.use(lan);
        if (!doNotPersist) {
            configSrv.changeLanguage(vm.wizard.user.id, lan);
        }
    }

    function has(permArgs, any) {
        return sessionSrv.has(permArgs, any);
    }

}