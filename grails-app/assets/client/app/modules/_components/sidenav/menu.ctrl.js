/**
 * Created by asiel on 6/06/17.
 */

(function() {

    'use strict';

    angular
        .module('gmsBoilerplate')
        .controller('menuCtrl', menuCtrl);

    /*@ngInject*/
    function menuCtrl($mdSidenav, GMSSideNavSrv, $scope, BROADCAST, navBarSrv) {
        var vm = this;
        vm.wizard = {
            leftButtons: [],

            toggleMenu: buildToggler('snLeft'),
            closeSideNav: fnCloseSideNav
        };

        $scope.$on(BROADCAST.navBav.updateLeftButtons, function () {
            vm.wizard.leftButtons = navBarSrv.leftButtons;
        });

        return vm.wizard;

        function buildToggler(navID) {
            return function () {
                // Component lookup should always be available since we are not using `ng-if`
                $mdSidenav(navID)
                    .toggle()
                    .then(function () {});
            };
        }

        function fnCloseSideNav() {
            GMSSideNavSrv.closeSideNav();
        }
    }

}());