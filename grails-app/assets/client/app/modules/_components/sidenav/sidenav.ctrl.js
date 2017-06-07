/**
 * Created by asiel on 6/06/17.
 */

'use strict';

angular
    .module('gmsBoilerplate')
    .controller('GMSSideNavCtrl', GMSSideNavCtrl);

/*@ngInject*/
function GMSSideNavCtrl($mdSidenav, $scope, BROADCAST) {
    var vm = this;
    vm.wizard = {
        close: fnClose
    };

    $scope.$on(BROADCAST.sidenav.close, function () {
        fnClose();
    });

    return vm.wizard;

    function fnClose() {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav('snLeft').close()
            .then(function () {});
    }
}