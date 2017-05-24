/**
 * Created by asiel on 1/05/17.
 */

'use strict';

angular
    .module('gmsBoilerplate')
    .service('configSrv', configSrv);

/*@ngInject*/
function configSrv(baseSrv, $http, systemSrv, sessionSrv) {

    var self = this;

    var url = systemSrv.APIAbsoluteUrl + "config/";

    self.service = {
        config:{},

        loadConfig: fnLoadConfig,
        save: fnSave,

        changeLanguage: fnChangeLanguage,
        getConfigLanguage: fnGetConfigLanguage
    };

    return self.service;

    //
    function fnLoadConfig(uid) {
        return baseSrv.resolveDeferred($http.get(url + (uid ? "?uid=" + uid : "")));
    }

    function fnSave(params, uid) {
        if (uid) {
            params['userId'] = uid;
        }
        return baseSrv.resolveDeferred($http.post(url, params));
    }

    function fnChangeLanguage(uid, lan) {
        var d = baseSrv.resolveDeferred($http.post(url + 'lan',  {'userId': uid, 'lan': lan}));
        sessionSrv.setLanguage(lan);
        return d
    }

    function fnGetConfigLanguage(uid) {
        return baseSrv.resolveDeferred($http.get(url + 'lan?userId=' + uid))
    }
}