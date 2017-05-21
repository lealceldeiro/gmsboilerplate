/**
 * Created by Asiel on 11/7/2016.
 */

'use strict';

angular
    .module('gmsBoilerplate')
    .config(['$mdThemingProvider', conf])
    .run(['$rootScope', 'sessionSrv', 'navigationSrv', '__env', 'errorSrv', 'translatorSrv', runConfig]);


function runConfig($rootScope, sessionSrv, navigationSrv, __env, errorSrv, translatorSrv) {
    var prevRoute, currentRoute, params;

    $rootScope.$on('$routeChangeStart', function (event, next, data) {
        if (next && next['$$route']) {
            var secured = next['$$route']['secured'];
            var route = next['$$route']['originalPath'];

            //security
            if (secured) {
                if (sessionSrv.isLogged()) {
                    var p = sessionSrv.getPermissions(),
                        permit = true,
                        requiresAll = secured['requiresAll'],
                        requiresAny = secured['requiresAny'],
                        x;
                    //check for all mandatory permissions required
                    if (requiresAll && angular.isArray(requiresAll) && p && angular.isArray(p)) {
                        var temp = true;
                        x = requiresAll.length - 1;
                        while (x >= 0 && temp){
                            (function (i) {
                                if (p.indexOf(requiresAll[i]) === -1){
                                    temp = false;
                                }
                            })(x--);
                        }
                        permit = temp;
                    }
                    //check for any of the permissions required (permissions which at least one is required, but not al of them)
                    else if (requiresAny && angular.isArray(requiresAny) && p && angular.isArray(p)) {
                        permit = false;
                        x = requiresAny.length - 1;
                        while (x >= 0 && !permit){
                            (function (i) {
                                if (p.indexOf(requiresAny[i]) !== -1){
                                    permit = true;
                                }
                            })(x--);
                        }
                    }

                    if (!permit) {_doLogout(event, route)}
                }
                else {_doLogout(event, route);}
            }

            if (route) {
                params = next['params'];

                //trying to access to login page after logged in?...redirect to main
                if(route.toString().indexOf(navigationSrv.LOGIN_PATH) !== -1 && sessionSrv.isLogged()) event.preventDefault();

                //errors (config, browser...)
                if (!__env.supportHtml5) {
                    if (next.toString().indexOf(navigationSrv.CONFIG_ERROR_PATH) === -1) { //trying to access to a view when config is wrong
                        if(!__env.supportHtml5){
                            var titleKey = "config.error.browser_not_supported.title";
                            var msgKey = "config.error.browser_not_supported.message";
                        }
                        else {
                            errorSrv.title = "config.error.vars.title";
                            errorSrv.message = "config.error.vars.message";
                        }
                        event.preventDefault();
                        translatorSrv.setText(titleKey, errorSrv, "title");
                        translatorSrv.setText(msgKey, errorSrv, "message");
                        sessionSrv.logOut();
                        navigationSrv.goTo(navigationSrv.CONFIG_ERROR_PATH);
                    }
                }
                else if (route.toString().indexOf(navigationSrv.CONFIG_ERROR_PATH) !== -1) event.preventDefault();

            }
        }

    });

    function _doLogout(event, route) {
        sessionSrv.logOut(); //clean session data
        event.preventDefault();
        if (route !== navigationSrv.DEFAULT_PATH) {
            navigationSrv.goTo(navigationSrv.LOGIN_PATH);
        }
    }

    $rootScope.$on('$routeChangeSuccess', function (event, prev, data) {
        if (prev && prev['$$route']) {
            if (currentRoute) {
                prevRoute = currentRoute;
            }
            currentRoute = prev['$$route']['originalPath'];
        }
    });

    //triggered when a new token was retrieved since the old one expired, so we need to refresh the last requested
    //view, since it wasn't resolved due to the forbidden backend response
    $rootScope.$on('UNAUTHORIZED_BACKWARD', function () {
        if (prevRoute) {
            if (params && typeof params['id']  !== 'undefined' && params['id'] !== null
                && prevRoute.indexOf(':id') !== -1) {
                navigationSrv.goTo(prevRoute, ':id', params['id']);
            }
            else { navigationSrv.goTo(prevRoute); }
        }
        else { navigationSrv.goTo(navigationSrv.DEFAULT_PATH); }
    });

    $rootScope.$on('NAVIGATION_GO_BACK', function (event, data) {
        if (prevRoute) {
            var placeholder = [],
                values = [];
            if(data) {
                for(var k in data){
                    if (data.hasOwnProperty(k) && (data[k] || data[k] === 0)) {
                        placeholder.push(k);
                        values.push(data[k]);
                    }
                }
            }
            navigationSrv.goTo(prevRoute, placeholder, values);
        }
    });

}

function conf($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('green')
        .accentPalette('blue');
}