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
    function config($logProvider) {
        $logProvider.debugEnabled(true);
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
        .config(config);

}());