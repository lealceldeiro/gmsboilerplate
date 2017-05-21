/**
 * Created by Asiel on 2/10/2017.
 */

'use strict';

angular
    .module('gmsBoilerplate')
    .controller('fabSpeedDial', [fabSpeedDial]);

function fabSpeedDial() {
    this.isOpen = false;
    this.selectedMode = 'md-fling';
    this.selectedDirection = 'left';
}