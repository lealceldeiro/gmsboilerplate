/**
 * Created by Asiel on 2/10/2017.
 */

(function() {

    'use strict';

    var isDlgOpen;

    angular
        .module('gmsBoilerplate')
        .controller('toastCtrl', toastCtrl)
        .controller('toastManagerCtrl', toastManagerCtrl);

    /*@ngInject*/
    function toastCtrl($scope, $mdToast, BROADCAST) {

        $scope.$on(BROADCAST.component.toast.OPEN, function () {
            $scope.showCustomToast();
        });

        $scope.showCustomToast = function() {
            $mdToast.show({
                hideDelay   : 3000,
                parent      : document.getElementById('toaster'),
                position    : 'top right',
                controller  : 'toastManagerCtrl',
                templateUrl : 'assets/app/modules/_components/toast/toast.tmpl.html'
            });
        };
    }

    /*@ngInject*/
    function toastManagerCtrl($scope, $mdToast, toastSrv) {

        $scope.typeClass = '';
        switch (toastSrv.messageType) {
            case toastSrv.type.INFO:
                $scope.typeClass = '';
                break;
            case toastSrv.type.WARNING:
                $scope.typeClass = 'md-warn';
                break;
            case toastSrv.type.ERROR:
                $scope.typeClass = '';
                break;
            case toastSrv.type.QUESTION:
                $scope.typeClass = '';
                break;
            case toastSrv.type.SUCCESS:
                $scope.typeClass = '';
                break;
        }

        $scope.closeToast = function() {

            if (isDlgOpen) return;

            $mdToast
                .hide()
                .then(function() {
                    isDlgOpen = false;
                });
        };

        $scope.buttons = toastSrv.buttons;

        $scope.text = toastSrv.text;
    }

}());