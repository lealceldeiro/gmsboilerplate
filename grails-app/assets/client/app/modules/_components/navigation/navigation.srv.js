/**
 * Created by Asiel on 11/6/2016.
 */


'use strict';

angular
    .module('gmsBoilerplate')
    .service('navigationSrv', navigationSrv);

/*@ngInject*/
function navigationSrv($location, $route, ROUTE, stringSrv, $rootScope, BROADCAST, $window) {

    var self = this;

    self.service = {

        prevRoute: null,

        DEFAULT_PATH: ROUTE.HOME,
        LOGIN_PATH: ROUTE.LOGIN,
        CONFIG_ERROR_PATH: ROUTE.ADMIN_CONFIG_ERROR,

        goTo: fnGoTo,
        back: fnBack,

        currentPath: fnCurrentPath,
        currentParams: fnCurrentParams
    };

    return self.service;

    function fnGoTo(link, placeholders, params) {
        if (placeholders && params) {
            if (angular.isArray(placeholders) && angular.isArray(params)) {
                if (placeholders.length !== params.length) {
                    throw new Error('Placeholders and params must be of equal length');
                }
                angular.forEach(placeholders, function (obj, idx) {
                    link = stringSrv.replaceAll(link, obj, params[idx])
                })
            }
            else{
                link = stringSrv.replaceAll(link, placeholders, params);
            }
        }
        if (link){
            if ($location.path() === link){
                $route.reload();
            }else{
                $location.path(link);
            }
        }
    }


    function fnCurrentPath() {
        return $location.path();
    }

    function fnCurrentParams() {
        return $route && $route.current ? $route.current.params : null;
    }

    function fnBack(params) {
        $window.history.back();
        //todo fix
        // $rootScope.$broadcast(BROADCAST.navigation.GO_BACK, params)
    }

}