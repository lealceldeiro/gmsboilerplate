/**
 * Created by Asiel on 2/10/2017.
 */

'use strict';

angular
    .module('gmsBoilerplate')
    .controller('dialogCtrl', dialogCtrl);

/*@ngInject*/
function dialogCtrl($mdDialog, dialogSrv, $scope, BROADCAST) {

    var type;

    $scope.$on(BROADCAST.modal.SHOW_DIALOG_TAB, function () {
        type = BROADCAST.modal.SHOW_DIALOG_TAB;
        showDialog();
    });
    $scope.$on(BROADCAST.modal.SHOW_DIALOG, function () {
        type = BROADCAST.modal.SHOW_DIALOG;
        showDialog();
    });

    function showDialog (messageType, title, tabsHeaders, tabsTitles, simpleDialogText, tabsContent, buttons,
                         cancelAction, ev, isStatic) {
        dialogSrv.messageType = messageType || dialogSrv.messageType;
        dialogSrv.title = title || dialogSrv.title;
        dialogSrv.tabsHeaders = tabsHeaders || dialogSrv.tabsHeaders;
        dialogSrv.tabsTitles = tabsTitles || dialogSrv.tabsTitles;
        dialogSrv.tabsContent = tabsContent || dialogSrv.tabsContent;
        dialogSrv.text = simpleDialogText || dialogSrv.text;
        dialogSrv.buttons = buttons ||  dialogSrv.buttons;
        dialogSrv.cancelAction = cancelAction ||  dialogSrv.cancelAction;
        dialogSrv.ev = ev || dialogSrv.ev;
        dialogSrv.static = isStatic || dialogSrv.static;

        if (dialogSrv.title || dialogSrv.tabs || dialogSrv.tabsTitles || dialogSrv.tabsContent
            || dialogSrv.buttons || dialogSrv.cancelAction || dialogSrv.ev || dialogSrv.text) {
            var template;
            switch (type){
                case BROADCAST.modal.SHOW_DIALOG_TAB:
                    template = "dialog_tab.tmpl.html";
                    break;
                case BROADCAST.modal.SHOW_DIALOG:
                    template = "dialog_simple.tmpl.html";
                    break;
            }

            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'assets/app/modules/_components/dialog/' + template,
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: dialogSrv.static !== true
            })
                .then(function(answer) {
                    //something selected
                }, function() {
                    if (angular.isDefined(dialogSrv.cancelAction) && angular.isFunction(dialogSrv.cancelAction)) {
                        dialogSrv.cancelAction();
                    }
                });
        }
        else{ console.warn('There was no data provided for dialog') }

    }

    function DialogController($scope, $mdDialog) {

        $scope.title = dialogSrv.title;
        $scope.text = dialogSrv.text;
        $scope.tabsHeaders = dialogSrv.tabsHeaders;
        $scope.tabsTitles = dialogSrv.tabsTitles;
        $scope.simpleContent = dialogSrv.simpleContent;
        $scope.tabsContent = dialogSrv.tabsContent;
        $scope.buttons = dialogSrv.buttons;
        $scope.ev = dialogSrv.ev;
        $scope.isStatic = dialogSrv.static;

        $scope.typeClass = '';
        switch (dialogSrv.messageType) {
            case dialogSrv.type.INFO:
                $scope.typeClass = '';
                break;
            case dialogSrv.type.WARNING:
                $scope.typeClass = 'md-warn';
                break;
            case dialogSrv.type.ERROR:
                $scope.typeClass = 'red';
                break;
            case dialogSrv.type.QUESTION:
                $scope.typeClass = 'md-hue-2';
                break;
            case dialogSrv.type.SUCCESS:
                $scope.typeClass = 'md-accent';
                break;
        }

        $scope.hide = function() { $mdDialog.hide(); };

        $scope.cancel = function() { $mdDialog.cancel(); };

        $scope.answer = function(answer) { $mdDialog.hide(answer); };
    }
}