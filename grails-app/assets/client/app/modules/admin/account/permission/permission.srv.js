/**
 * Created by Asiel on 1/20/2017.
 */

(function() {

    'use strict';

    angular
        .module('gmsBoilerplate')
        .service('permissionSrv',permissionSrv);

    /*@ngInject*/
    function permissionSrv(baseSrv, systemSrv, $http) {

        var self = this;
        var url = systemSrv.APIAbsoluteUrl + 'permission/';

        self.service = {
            search: fnSearch,

            searchByPageChange: fnSearchByPageChange
        };

        return self.service;

        //fn
        function fnSearch(offset, max, criteria) {
            var params = baseSrv.getParams(offset, max, criteria);

            var def =  $http.get(url + params);
            return baseSrv.resolveDeferred(def);
        }

        function fnSearchByPageChange() {
            fnSearch();
        }
    }

}());