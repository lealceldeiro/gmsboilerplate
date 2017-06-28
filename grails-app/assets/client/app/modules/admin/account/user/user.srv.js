/**
 * Created by Asiel on 22/12/2016.
 */

'use strict';

angular
    .module('gmsBoilerplate')
    .service('userSrv', userSrv);

/*@ngInject*/
function userSrv(systemSrv, $http, baseSrv, ownedEntitySrv, fileManagerSrv) {

    var self = this;
    var url = systemSrv.APIAbsoluteUrl + 'user/';

    self.service = {
        sessionData: {},

        search: fnSearch,
        searchAll: fnSearchAll,
        searchAllFromEntities: fnSearchAllFromEntities,
        show: fnShow,
        getByUsername: fnGetByUsername,
        getByEmail: fnGetByEmail,
        remove: fnRemove,
        save: fnSave,
        saveProfile: fnSaveProfile,
        updateProfilePicture: fnUpdateProfilePicture,
        activate: fnActivate,

        entitiesByUser: fnEntitiesByUser
    };

    return self.service;

    function fnSearch(eid, offset, max, criteria) {
        var params = baseSrv.getParams(offset, max, criteria);

        var def = $http.get(url + "entity/" + eid + "/" + params);
        return baseSrv.resolveDeferred(def);
    }

    function fnSearchAll(offset, max, criteria) {
        var params = baseSrv.getParams(offset, max, criteria);

        var def = $http.get(url + params);
        return baseSrv.resolveDeferred(def);
    }

    function fnSearchAllFromEntities(eidS, offset, max, criteria) {
        var params = baseSrv.getParams(offset, max, criteria);

        if (angular.isDefined(eidS) && angular.isArray(eidS)) {
            var es = !params ? "?e=" : "&e=";
            angular.forEach(eidS, function (id) {
                es += id + "&e=";
            })
        }

        var def = $http.get(url + "associated" + params + es.substring(0, es.length - 3));
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

    function fnGetByUsername(username) {
        var def = $http.get(url + "get?username=" + username);
        return baseSrv.resolveDeferred(def);
    }

    function fnGetByEmail(email) {
        var def = $http.get(url + "get?email=" + email);
        return baseSrv.resolveDeferred(def);
    }

    function fnSave(params, id) {
        var mUrl = url;

        if (typeof id !== 'undefined' && id !== null && !isNaN(id)) {//update?
            mUrl = url + id;
            var def = $http.post(mUrl, params);
        }
        else {//create?
            def = $http.put(mUrl, params);
        }

        return baseSrv.resolveDeferred(def);
    }

    function fnUpdateProfilePicture(userId, file, filename) {
        return fileManagerSrv.sendFile(userId, file, url + 'profile/picture', filename)
    }

    function fnSaveProfile(params, id) {
        return baseSrv.resolveDeferred($http.post(url + 'profile/' + id, params))
    }

    function fnActivate(id, activate) {
        return baseSrv.resolveDeferred($http.post(url + id + "/activate/" + activate))
    }


    function fnEntitiesByUser(id, offset, max) {
        return ownedEntitySrv.search(id, offset, max);
    }
}