/**
 * Created by asiel on 1/05/17.
 */

'use strict';

angular
    .module('gmsBoilerplate')
    .service('configSrv', configSrv);

/*@ngInject*/
function configSrv(baseSrv, $http, systemSrv, sessionSrv, $timeout, $translate) {

    var self = this;
    var MAX_RETRY = 3, retries = 0;

    var url = systemSrv.APIAbsoluteUrl + "config/";

    self.service = {
        config:{
            isUserRegistrationAllowed: undefined,
            multiEntity: undefined
        },

        loadConfig: fnLoadConfig,
        save: fnSave,

        changeLanguage: fnChangeLanguage,
        getConfigLanguage: fnGetConfigLanguage
    };

    return self.service;

    //
    function fnLoadConfig(uid) {
        var fnKey = "configSrvFnLoadConfig";
        var def =  $http.get(url + (uid ? "?uid=" + uid : ""));
        def.then(
            function (response) {
                var data = response.data;
                var e = systemSrv.eval(data, fnKey, false, false);
                if (e) {
                    self.service.config = systemSrv.getItems(fnKey);
                }
                return self.service.config;
            },
            function (err) {
                if (retries++ < MAX_RETRY) {
                    $timeout(function () {
                        return fnLoadConfig();
                    }, 3000)
                }
            }
        );
        return def;
    }

    function fnSave(params, uid) {
        if (uid) {
            params['userId'] = uid;
        }
        return baseSrv.resolveDeferred($http.post(url, params));
    }

    function fnChangeLanguage(lan, doNotPersist) {
        if (lan) {
            $translate.use(lan);
            sessionSrv.setLanguage(lan);
            if (!doNotPersist) {
                var u = sessionSrv.currentUser();
                if (u) {
                    var d = baseSrv.resolveDeferred($http.post(url + 'lan',  {'userId': u['id'], 'lan': lan}));
                }
            }
            return d
        }
    }

    function fnGetConfigLanguage(uid) {
        return baseSrv.resolveDeferred($http.get(url + 'lan?userId=' + uid))
    }
}