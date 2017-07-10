/**
 * Created by Asiel on 1/10/2017.
 */

(function() {

    'use strict';

    angular
        .module('gmsBoilerplate')
        .controller('blockCtrl', blockCtrl);

    /*@ngInject*/
    function blockCtrl($scope, blockSrv) {

        var vm = this;

        vm.wizard = {
            blocked: false
        };

        $scope.$watch(
            function () {
                return blockSrv.isBlocked();
            },
            function (newVal) {
                vm.wizard.blocked = newVal
            }
        );

        return vm.wizard;
    }

}());