/**
 * Created by Asiel on 11/6/2016.
 */

'use strict';


angular
    .module('gmsBoilerplate')
    .controller('indexCtrl', indexCtrl);

/*@ngInject*/
function indexCtrl($scope, indexSrv, sessionSrv, configSrv, translatorSrv, navigationSrv) {

    var vm = this;

    vm.wizard = {

        canRegister: false,

        lan: {
            //keys must be the same as defined in i18n files (en.json and es.json)
            'spanish': 'es',
            'english': 'en',
            current: null
        },
        init: fnInit,
        go: fnGo,
        siteTitle: fnSiteTitle,

        changeLanguage: fnChangeLanguage
    };

    $scope.$watch(function () {return vm.wizard.siteTitle();},function (nVal, oVal) {});

    //update users's logged in/out status
    $scope.$on('TRIGGER_ACTION_AUTH', function () {
        vm.wizard.logged = sessionSrv.isLogged();
    });

    vm.wizard.init();

    return vm.wizard;

    //fn
    function fnInit() {
        if (angular.isDefined(configSrv.config.isUserRegistrationAllowed)) {
            vm.wizard.canRegister = configSrv.config.isUserRegistrationAllowed;
        } else {
            configSrv.loadConfig().then(
                function (config) {
                    vm.wizard.canRegister = configSrv.config.isUserRegistrationAllowed;
                }
            );
        }
        translatorSrv.setText("string.index", indexSrv, 'siteTitle');
        vm.wizard.logged = sessionSrv.isLogged();

        fnChangeLanguage(sessionSrv.getLanguage(), true);
    }

    function fnSiteTitle() {
        return indexSrv.siteTitle;
    }

    function fnGo(link) {
        navigationSrv.goTo(link);
    }

    function fnChangeLanguage(lan, doNotPersist) {
        if (lan) {
            configSrv.changeLanguage(lan, doNotPersist);
            for(var k in vm.wizard.lan){
                if (vm.wizard.lan.hasOwnProperty(k)) {
                    if(vm.wizard.lan[k] === lan.substring(0, 2)){
                        vm.wizard.lan.current = "LANGUAGE." + k;
                        break;
                    }
                }
            }
        }

    }
}