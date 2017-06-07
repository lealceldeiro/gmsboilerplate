/**
 * Created by asiel on 6/06/17.
 */

'use strict';

angular
    .module('gmsBoilerplate')
    .controller('menuCtrl', menuCtrl);

/*@ngInject*/
function menuCtrl($mdSidenav, GMSSideNavSrv) {
    var vm = this;
    vm.wizard = {
        toggleMenu: buildToggler('snLeft'),
        closeSideNav: fnCloseSideNav
    };

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