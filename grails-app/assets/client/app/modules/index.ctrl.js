/**
 * Created by Asiel on 11/6/2016.
 */

(function() {

    'use strict';


    angular
        .module('gmsBoilerplate')
        .controller('indexCtrl', indexCtrl);

    /*@ngInject*/
    function indexCtrl($scope, indexSrv, sessionSrv, configSrv, navigationSrv, BROADCAST) {

        var vm = this;

        vm.wizard = {

            canRegister: false,

            lan: {
                //keys must be the same as defined in i18n files (en.json and es.json)
                'spanish': 'es',
                'english': 'en',
                current: null,
                countryFlag: null
            },
            lanFlag: { //flags properties names must match the language
                'es': 'es', //spanish flag
                'en': 'us'  //english flag
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

        $scope.$on(BROADCAST.language.CHANGED, function (evt, data) {
            __updateLanguageInCtrl(data['lan']);
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
            indexSrv.setTitle('string.index');
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
                __updateLanguageInCtrl(lan);
            }

        }

        function __updateLanguageInCtrl(lan) {
            for(var k in vm.wizard.lan){
                if (vm.wizard.lan.hasOwnProperty(k) && vm.wizard.lan[k]) {
                    if(vm.wizard.lan[k] === lan.substring(0, 2)){
                        vm.wizard.lan.current = "LANGUAGE." + k;
                        vm.wizard.lan.countryFlag = vm.wizard.lan[k];
                        break;
                    }
                }
            }
        }
    }

}());