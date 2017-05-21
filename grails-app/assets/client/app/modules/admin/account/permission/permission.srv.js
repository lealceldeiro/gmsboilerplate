/**
 * Created by Asiel on 1/20/2017.
 */

'use strict';

angular
    .module('gmsBoilerplate')
    .service('permissionSrv', ['baseSrv', 'systemSrv', '$http', permissionSrv]);

function permissionSrv(baseSrv, systemSrv, $http) {
    var self = this;
    var url = systemSrv.APIAbsoluteUrl + 'permission/';

    self.service = {
        search: fnSearch
    };

    return self.service;

    //fn
    function fnSearch(offset, max, criteria) {
        var params = baseSrv.getParams(offset, max, criteria);

        var def =  $http.get(url + params);
        return baseSrv.resolveDeferred(def);
    }
}