/**
 * Created by Asiel on 11/6/2016.
 */

'use strict';

angular
    .module('gmsBoilerplate')
    .service('sessionSrv', sessionSrv);

/*@ngInject*/
function sessionSrv(localStorageService, $rootScope) {

    var self = this;
    var lsPrefix = "gMS_localS_";

    var refreshTKey = lsPrefix + "RefreshToken";
    var tokenKey =  lsPrefix + "AuthToken";
    var currentUKey =  lsPrefix + "CurrentUsr";
    var permissionsKey =  lsPrefix + "uPermissions";
    var oEntityKey =  lsPrefix + "oCEntity";
    var lanKey =  lsPrefix + "lan";

    var sToken = null;
    var rToken = null;
    var currentUser = null;
    var permissions = null;
    var ownedEntity = null; //house, enterprise, business, or any other over which the user has control over

    var lan = {};

    var logged;

    self.service = {
        isLogged: fnIsLogged,
        logOut: fnLogOut,

        securityToken: fnSecurityToken,
        setSecurityToken: fnSetSecurityToken,

        securityRefreshToken: fnSecurityRefreshToken,
        setSecurityRefreshToken: fnSetSecurityRefreshToken,

        currentUser: fnGetCurrentUser,
        setCurrentUser: fnSetCurrentUser,

        loginEntity: fnGetCurrentOwnedEntity,
        setCurrentOwnedEntity: fnSetCurrentOwnedEntity,

        setPermissions: fnSetPermissions,
        getPermissions: fnGetPermissions,

        clearSession: fnClearSession,

        getLanguage: fnGetLanguage,
        setLanguage: fnSetLanguage
    };

    return self.service;

    function fnIsLogged() {
        if (logged === false) {
            return false;
        }
        else if(logged === true){
            return true;
        }
        else{
            sToken = localStorageService.get(tokenKey);
            logged = (typeof sToken !== 'undefined' && sToken !== null);
            return logged
        }
    }

    function fnLogOut() {
        fnClearSession();
        //notify of login action
        $rootScope.$broadcast('TRIGGER_ACTION_AUTH'); //$rootScope so the change is propagated to all scopes
    }

    function fnSecurityToken() {
        if (!sToken) {
            sToken = localStorageService.get(tokenKey);
        }
        else{
            if (!localStorageService.get(tokenKey)) {
                fnSetSecurityToken(sToken)
            }
        }
        return sToken;
    }

    function fnSetSecurityToken(token) {
        sToken = token;
        localStorageService.set(tokenKey, sToken);
        logged = true;
    }

    function fnClearSession() {
        localStorageService.remove(tokenKey);
        localStorageService.remove(refreshTKey);
        localStorageService.remove(currentUKey);
        localStorageService.remove(permissionsKey);
        localStorageService.remove(oEntityKey);

        logged = false;
        sToken = null;
        rToken = null;
        currentUser = null;
        permissions = null;
        ownedEntity = null;
    }


    function fnSecurityRefreshToken() {
        if (!rToken) {
            rToken = localStorageService.get(refreshTKey);
        }
        else {
            if (!localStorageService.get(refreshTKey)) {
                fnSetSecurityRefreshToken(rToken);
            }
        }

        return rToken;
    }

    function fnSetSecurityRefreshToken(refreshToken) {
        rToken = refreshToken;
        localStorageService.set(refreshTKey, rToken);
    }


    function fnSetCurrentUser(u) {
        currentUser = u;
        localStorageService.set(currentUKey, currentUser);
    }

    function fnGetCurrentUser() {
        if (!currentUser) {
            currentUser = localStorageService.get(currentUKey);
        }
        else{
            if(!localStorageService.get(currentUKey)){
                fnSetCurrentUser(currentUser)
            }
        }
        return currentUser;
    }


    function fnSetCurrentOwnedEntity(e) {
        ownedEntity = e;
        localStorageService.set(oEntityKey, ownedEntity);
    }

    function fnGetCurrentOwnedEntity() {
        if (!ownedEntity) {
            ownedEntity = localStorageService.get(oEntityKey);
        }
        else{
            if(!localStorageService.get(oEntityKey)){
                fnSetCurrentOwnedEntity(ownedEntity)
            }
        }
        return ownedEntity;
    }


    function fnSetPermissions(uPermissions) {
        permissions = uPermissions;
        localStorageService.set(permissionsKey, permissions);
    }

    function fnGetPermissions() {
        if (!permissions) {
            permissions = localStorageService.get(permissionsKey);
        }
        else{
            if(!localStorageService.get(permissionsKey)){
                fnSetPermissions(permissions)
            }
        }
        return permissions;
    }



    function fnGetLanguage() {
        var u = fnGetCurrentUser();
        if (u) {
            if (!lan || !lan[u.id]) {
                lan = localStorageService.get(lanKey);
            }
            else {
                if (!localStorageService.get(lanKey) || !localStorageService.get(lanKey)[u.id]) {
                    localStorageService.set(lanKey, lan);
                }
            }
            return lan ? lan[u.id] : null;
        }
    }

    function fnSetLanguage(language) {
        var u = fnGetCurrentUser();
        if (u) {
            lan = localStorageService.get(lanKey) || {};
            lan[u.id] = language;
            localStorageService.set(lanKey, lan);
        }
    }

}