/**
 * Created by Asiel on 1/10/2017.
 */

(function() {

    'use strict';

    angular
        .module('gmsBoilerplate')
        .directive('gmsScreenLoader', gmsScreenLoader);

    /*@ngInject*/
    function gmsScreenLoader() {

        return {
            templateUrl: 'assets/app/modules/_components/screenLoader/screen.loader.tpl.html',
            transclude: true,
            restrict: 'EAC',
            scope: {screenType: '@'}
        }
    }

}());
