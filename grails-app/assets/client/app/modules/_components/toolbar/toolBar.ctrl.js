/**
 * Created by Asiel on 2/10/2017.
 */

'use strict';

angular
    .module('gmsBoilerplate')
    .controller('toolBarCtrl', toolBarCtrl);

/*@ngInject*/
function toolBarCtrl($scope, BROADCAST, toolBarSrv) {

    var self  = this;

    self.wizard = {
        buttonsArr: [],
        show : false,
        isOpen: false,
        direction: 'left',
        doAction: fnDoAction
    };

    $scope.$on(BROADCAST.component.toolbar.OPEN, function () {
        self.wizard.buttonsArr = toolBarSrv.buttonsArr;
        self.show = true;
    });
    $scope.$on(BROADCAST.component.toolbar.CLOSE, function () {
        self.show = false;
    });

    return self.wizard;

    function fnDoAction(idx) {
        return toolBarSrv.doAction(idx);
    }
}