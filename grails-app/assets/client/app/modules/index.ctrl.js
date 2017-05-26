/**
 * Created by Asiel on 11/6/2016.
 */

'use strict';


angular
    .module('gmsBoilerplate')
    .controller('indexCtrl', indexCtrl);

/*@ngInject*/
function indexCtrl($scope, indexSrv, sessionSrv, $timeout, systemSrv, configSrv, translatorSrv, navigationSrv) {

    var vm = this;
    var keyP = "__index__";
    var MAX_RETRY = 3, retries = 0;

    vm.wizard = {
        init: fnInit,
        go: fnGo,
        siteTitle: fnSiteTitle
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
        translatorSrv.setText("string.index", indexSrv, 'siteTile');
        vm.wizard.logged = sessionSrv.isLogged();
    }

    function fnSiteTitle() {
        return indexSrv.siteTile;
    }

    function fnGo(link) {
        navigationSrv.goTo(link);
    }
}