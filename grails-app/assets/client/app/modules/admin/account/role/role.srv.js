/**
 * Created by Asiel on 11/6/2016.
 */

angular
    .module('gmsBoilerplate')
    .service('roleSrv', roleSrv);

/*@ngInject*/
function roleSrv(systemSrv, $http, valueSrv, baseSrv) {

    var self = this;
    var rolesUrl = systemSrv.APIAbsoluteUrl + 'role/';

    self.service = {

        sessionData: {},

        search: fnSearch,
        searchAll: fnSearchAll,
        show: fnShow,
        remove: fnRemove,
        save: fnSave,
        activate: fnActivate,

        permissionsByUser: fnPermissionsByUser
    };

    return self.service;

    /**
     * Search for roles of this user and owned entity
     * @param uid Logged user's id
     * @param eid Active Owned Entity's id
     * @param offset offset for paging
     * @param max max offset for paging
     * @param criteria criteria for searching
     * @returns {*} Promise
     */
    function fnSearch(uid, eid, offset, max, criteria) {
        var params = baseSrv.getParams(offset, max, criteria);

        var def = $http.get(rolesUrl + uid + "/" + eid + "/" + params);
        return baseSrv.resolveDeferred(def);
    }

    /**
     * Search for roles
     * @param offset offset for paging
     * @param max max offset for paging
     * @param criteria criteria for searching
     * @returns {*} Promise
     */
    function fnSearchAll(offset, max, criteria) {
        var params = baseSrv.getParams(offset, max, criteria);

        var def = $http.get(rolesUrl + params);
        return baseSrv.resolveDeferred(def);
    }

    function fnRemove(id) {
        var def = $http.delete(rolesUrl + id);
        return baseSrv.resolveDeferred(def);
    }

    function fnShow(id) {
        var def = $http.get(rolesUrl + id);
        return baseSrv.resolveDeferred(def);
    }

    function fnSave(params, id) {
        var url = rolesUrl;

        if (typeof id !== 'undefined' && id != null && !isNaN(id)) {//update?
            url = rolesUrl + id;
            var def = $http.post(url, params);
        }
        else {//create?
            def = $http.put(url, params);
        }
        return baseSrv.resolveDeferred(def);
    }

    function fnActivate(id, activate) {
        var url = rolesUrl + id + "/activate/" + activate;
        return baseSrv.resolveDeferred($http.post(url))
    }

    function fnPermissionsByUser(id, offset, max) {
        var params = valueSrv.nNnN(offset) ? "?offset=" + offset : "";
        if (valueSrv.nNnN(max)) {
            params += params === "" ? "?max=" + max : "&max=" + max;
        }

        var def = $http.get(rolesUrl + id + '/permissions/' + params);
        return baseSrv.resolveDeferred(def);
    }
}
