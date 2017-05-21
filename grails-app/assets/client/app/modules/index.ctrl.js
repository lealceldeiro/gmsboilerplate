/**
 * Created by Asiel on 11/6/2016.
 */

'use strict';


angular
    .module('gmsBoilerplate')
    .controller('indexCtrl', ['$scope', 'indexSrv', 'sessionSrv', '$timeout', 'systemSrv', 'configSrv', 'translatorSrv',
        'navigationSrv', indexCtrl]);

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
        _loadConfig();
        translatorSrv.setText("string.index", indexSrv, 'siteTile');
        vm.wizard.logged = sessionSrv.isLogged();
    }

    function fnSiteTitle() {
        return indexSrv.siteTile;
    }

    function fnGo(link) {
        navigationSrv.goTo(link);
    }

    function _loadConfig() {
        var fnKey = keyP + "_isSingleEntityApp";
        configSrv.loadConfig().then(
            function (data) {
                var e = systemSrv.eval(data, fnKey, false, false);
                if (e) {
                    configSrv.config = systemSrv.getItems(fnKey);
                }
                else {
                    if (retries++ < MAX_RETRY) {
                        $timeout(function () {
                            _loadConfig();
                        }, 3000)
                    }
                }
            }
        );
    }
}