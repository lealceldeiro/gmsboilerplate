/**
 * Created by Asiel on 01/24/2016.
 */

'use strict';

angular
    .module('gmsBoilerplate')
    .service('ownedEntitySrv', ['systemSrv', '$http', 'valueSrv', 'baseSrv', ownedEntitySrv]);

function ownedEntitySrv(systemSrv, $http, valueSrv, baseSrv) {
    var self = this;
    var url = systemSrv.APIAbsoluteUrl + 'entity/';

    self.service = {
        sessionData: {},

        search: fnSearch,
        searchAll: fnSearchAll,
        getByUsername: fnGetByUsername,
        show: fnShow,
        remove: fnRemove,
        save: fnSave,

        usersByEntity: fnUsersByEntity
    };

    return self.service;

    /**
     * Search for owned entities associated to a user
     * @param uid User who owned entities are being searched for
     * @param offset offset for paging
     * @param max max for paging
     * @param criteria criteria for searching
     * @returns {*} Promise
     */
    function fnSearch(uid, offset, max, criteria) {
        var params = baseSrv.getParams(offset, max, criteria);

        var def = $http.get(url + "user/" + uid + "/" + params);
        return baseSrv.resolveDeferred(def);
    }

    /**
     * Search for all owned entities registered on system
     * @param offset offset for paging
     * @param max max for paging
     * @param criteria criteria for searching
     * @returns {*} Promise
     */
    function fnSearchAll(offset, max, criteria) {
        var params = baseSrv.getParams(offset, max, criteria);

        var def = $http.get(url + params);
        return baseSrv.resolveDeferred(def);
    }

    function fnRemove(id) {
        var def = $http.delete(url + id);
        return baseSrv.resolveDeferred(def);
    }

    function fnShow(id) {
        var def = $http.get(url + id);
        return baseSrv.resolveDeferred(def);
    }

    function fnSave(params, id) {
        var mUrl = url;

        if (typeof id !== 'undefined' && id !== null && !isNaN(id)) {//update?
            mUrl = url + id;
            var def = $http.post(mUrl, params);
        }
        else {//create?
            def = $http.put(url, params);
        }
        return baseSrv.resolveDeferred(def);
    }

    function fnUsersByEntity(id, offset, max) {
        var params = valueSrv.nNnN(offset) ? "?offset=" + offset : "";
        if (valueSrv.nNnN(max)) {
            params += params === "" ? "?max=" + max : "&max=" + max;
        }

        var def = $http.get(url + "users/" + id + params);
        return baseSrv.resolveDeferred(def);
    }

    function fnGetByUsername(username) {
        var def = $http.get(url + "get?username=" + username);
        return baseSrv.resolveDeferred(def);
    }
}
