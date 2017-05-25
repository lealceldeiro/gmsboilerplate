/**
 * Created by Asiel on 11/6/2016.
 */
(function() {
    'use strict';

    var env = {
        supportHtml5: true,
        grant: {
            MANAGE_USER: "MANAGE__USER",
            CREATE_USER: "CREATE__USER",
            READ_USER: "READ__USER",
            READ_ALL_USER: "READ_ALL__USER",
            READ_ASSOCIATED_USER: "READ_ASSOCIATED__USER",
            UPDATE_USER: "UPDATE__USER",
            DELETE_USER: "DELETE__USER",

            MANAGE_ROLE: "MANAGE__ROLE",
            CREATE_ROLE: "CREATE__ROLE",
            READ_ROLE: "READ__ROLE",
            READ_ALL_ROLE: "READ_ALL__ROLE",
            UPDATE_ROLE: "UPDATE__ROLE",
            DELETE_ROLE: "DELETE__ROLE",

            MANAGE_PERMISSION: "MANAGE__PERMISSION",
            CREATE_PERMISSION: "CREATE__PERMISSION",
            READ_PERMISSION: "READ__PERMISSION",
            UPDATE_PERMISSION: "UPDATE__PERMISSION",
            DELETE_PERMISSION: "DELETE__PERMISSION",

            MANAGE_OWNED_ENTITY: "MANAGE__OWNED_ENTITY",
            CREATE_OWNED_ENTITY: "CREATE__OWNED_ENTITY",
            READ_OWNED_ENTITY: "READ__OWNED_ENTITY",
            READ_ALL_OWNED_ENTITY: "READ_ALL__OWNED_ENTITY",
            UPDATE_OWNED_ENTITY: "UPDATE__OWNED_ENTITY",
            DELETE_OWNED_ENTITY: "DELETE__OWNED_ENTITY",

            MANAGE_PROFILE: "MANAGE__PROFILE",
            READ_PROFILE: "READ__PROFILE",

            MANAGE_CONFIGURATION: "MANAGE__CONFIGURATION"
        }
    };

    var lan = {};

    //region language-loading...
    env.baseUrl = document.getElementById('appBaseUrl').href;
    var languages = ['en', 'es'];
    for (var lp = 0; lp < languages.length; lp++) {
        (function (idx) {
            $.getJSON(env.baseUrl + "assets/app/i18n/" + languages[idx] + ".json", function (translations) {
                lan[languages[idx]] = translations;
            });
        })(lp);
    }
    //endregion

    /*@ngInject*/
    function config($logProvider, $mdThemingProvider) {
        $logProvider.debugEnabled(true);

        $mdThemingProvider.theme('default')
            .primaryPalette('green')
            .accentPalette('blue');
    }


    /*@ngInject*/
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

    angular
        .module('gmsBoilerplate',
            [
                'ngRoute',                                          //routing
                'ngSanitize',                                       //ngSanitize module (for ui-select)
                'cl.paging',                                        //pagination
                'LocalStorageModule',                               //local storage module, used for instance for storing auth token
                'ngMaterial',
                'ngMessages',
                'pascalprecht.translate',                           //angular-translate
                'ngPasswordStrength'

            ]
        )
        .constant('__env', env)         // Register environment in AngularJS as constant
        .constant('lan', lan)           // Register languages strings as constant object
        .config(config)
        .run(runConfig);

}());