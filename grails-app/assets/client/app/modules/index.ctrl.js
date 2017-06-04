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

        lan: {
            'spanish': 'es',
            'english': 'en'
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
        translatorSrv.setText("string.index", indexSrv, 'siteTitle');
        vm.wizard.logged = sessionSrv.isLogged();

        configSrv.changeLanguage(sessionSrv.getLanguage(), true);
    }

    function fnSiteTitle() {
        return indexSrv.siteTitle;
    }

    function fnGo(link) {
        navigationSrv.goTo(link);
    }

    function fnChangeLanguage(lan, doNotPersist) {
        configSrv.changeLanguage(lan, doNotPersist);
    }
}