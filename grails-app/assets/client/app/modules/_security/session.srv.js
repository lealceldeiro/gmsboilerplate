/**
 * Created by Asiel on 11/6/2016.
 */

'use strict';

angular
    .module('gmsBoilerplate')
    .service('sessionSrv', sessionSrv);

/*@ngInject*/
function sessionSrv(localStorageService, $rootScope, systemSrv) {

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
        setLanguage: fnSetLanguage,

        has: has
    };

    //region show/hiders
    var up = systemSrv.grant;
    self.service.can = {
        conf:               function () { return (has(up.MANAGE_CONFIGURATION)) },

        manageOwnedEntity:  function () { return has(up.MANAGE_OWNED_ENTITY) && (self.service.can.createOwnedEntity() || self.service.can.readOwnedEntity()|| self.service.can.readAllOwnedEntity()) },
        readOwnedEntity:    function () { return has([up.READ_OWNED_ENTITY, up.READ_ALL_OWNED_ENTITY], true) },
        readAllOwnedEntity: function () { return has([up.READ_ALL_OWNED_ENTITY]) },
        createOwnedEntity:  function () { return has(up.CREATE_OWNED_ENTITY) },
        updateOwnedEntity:  function () { return has(up.UPDATE_OWNED_ENTITY) },
        deleteOwnedEntity:  function () { return has(up.DELETE_OWNED_ENTITY) },

        manageUser:         function () { return has(up.MANAGE_USER) && (self.service.can.createUser() || self.service.can.readUser() || self.service.can.readAllUser()) },
        readUser:           function () { return has([up.READ_USER, up.READ_ALL_USER], true) },
        readAllUser:        function () { return has(up.READ_ALL_USER) },
        createUser:         function () { return has(up.CREATE_USER) },
        updateUser:         function () { return has(up.UPDATE_USER) },
        deleteUser:         function () { return has(up.DELETE_USER) },

        manageRole:         function () { return has(up.MANAGE_ROLE) && (self.service.can.createRole() || self.service.can.readRole() || self.service.can.readAllRole()) },
        readRole:           function () { return has(up.READ_ROLE) },
        readAllRole:        function () { return has(up.READ_ALL_ROLE) },
        createRole:         function () { return has(up.CREATE_ROLE) },
        updateRole:         function () { return has(up.UPDATE_ROLE) },
        deleteRole:         function () { return has(up.DELETE_ROLE) },

        managePermission:   function () { return has(up.MANAGE_PERMISSION) && (self.service.can.createPermission() || self.service.can.readPermission()) },
        readPermission:     function () { return has(up.READ_PERMISSION) },
        createPermission:   function () { return has(up.CREATE_PERMISSION) },
        updatePermission:   function () { return has(up.UPDATE_PERMISSION) },
        deletePermission:   function () { return has(up.DELETE_PERMISSION) }
    };
    //endregion

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
        else {
            if (!lan) {
                lan = localStorageService.get(lanKey);
            }
            else {
                var has = false;
                for(var k in lan){
                    if (lan.hasOwnProperty(k)) {
                        has = true;
                        break;
                    }
                }
                if (!has) {
                    lan = localStorageService.get(lanKey);
                }
                else if(!localStorageService.get(lanKey)) {
                    localStorageService.set(lanKey, lan);
                }
            }
            return lan['_b_session'];
        }
    }

    function fnSetLanguage(language) {
        lan = localStorageService.get(lanKey) || {};
        var u = fnGetCurrentUser();
        if (u) {
            lan[u.id] = language;
        }
        else {
            lan['_b_session'] = language;
        }
        localStorageService.set(lanKey, lan);
    }

    function has(permArgs, any) {
        var p = fnGetPermissions();
        if (p) {
            if (angular.isArray(permArgs)) {
                var x = permArgs.length - 1;
                while (x >= 0) {
                    if (any) {
                        if (p.indexOf(permArgs[x--]) !== -1) {
                            return true
                        }
                    }
                    else {
                        if (p.indexOf(permArgs[x--]) === -1) {
                            return false
                        }
                    }
                }
                return !any
            }
            else return p.indexOf(permArgs) !== -1;
        }
    }

}