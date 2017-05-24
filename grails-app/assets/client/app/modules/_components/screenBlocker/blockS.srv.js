/**
 * Created by Asiel on 1/10/2017.
 */

'use strict';

angular
    .module('gmsBoilerplate')
    .service('blockSrv', blockSrv);

/*@ngInject*/
function blockSrv($timeout) {

    var self = this;

    var timer, miniTimer;

    var blocked = false;

    self.service = {
        block: fnBlock,
        unBlock: fnUnBlock,
        isBlocked: fnIsBlocked,

        setIsLoading: fnSetIsLoading
    };

    return self.service;

    /**
     * Blocks the entire screen with a loading image
     * @param message Message to be shown
     * @param instantly Whether the screen blocking should be done instantly or not. It is recommended to leave
     * this parameters as <code>false</code>.
     */
    function fnBlock(message, instantly) {
        var t = 500;
        if (instantly) {
            t = 0;
        }
        $timeout.cancel(timer);
        timer = $timeout(function () {
            blocked = true;
        },t);
    }

    /**
     * Unblocks the entire screen from the loader image
     */
    function fnUnBlock() {
        $timeout.cancel(timer);
        blocked = false;
    }

    /**
     * Marks as loading or unloading an object element by setting a property in it as "loading"
     * <code>false</code> or <code>true</code>
     * @param varToBeSet Var to be set as loading or not
     * @param isLoading Whether the var should be blocked or unblocked
     */
    function fnSetIsLoading(varToBeSet, isLoading) {
        if (angular.isDefined(varToBeSet)) {
            if (angular.isObject(varToBeSet) || angular.isArray(varToBeSet)) {
                $timeout.cancel(miniTimer);
                //if it is unblock, do it immediately
                if (!isLoading) {
                    varToBeSet['loading'] = false;
                }
                else{
                    miniTimer = $timeout(function () {
                        varToBeSet['loading'] = true;
                    }, 500)
                }
            }
        }
    }

    function fnIsBlocked() {
        return blocked;
    }
}
