/**
 * Created by Asiel on 2/10/2017.
 */

'use strict';

angular
    .module('gmsBoilerplate')
    .controller('chipCtrl', ['$mdConstant', chipCtrl]);

function chipCtrl($mdConstant) {
    this.separatorKeys = [$mdConstant.KEY_CODE.ENTER, $mdConstant.KEY_CODE.COMMA, $mdConstant.KEY_CODE.SPACE];
    this.createMode = false;
    this.transformChip = function (chip) {
        // If it is an object, it's already a known chip
        if (angular.isObject(chip)) {
            return chip;
        }

        // Otherwise, create a new one if possible
        return { label: chip }
    }
}