/**
 * Created by Asiel on 11/6/2016.
 */

'use strict';

angular
    .module('gmsBoilerplate')
    .service('toastSrv', ['$rootScope', 'BROADCAST', toastSrv]);

function toastSrv($rootScope, BROADCAST) {
    var self = this;

    self.service = {
        type: {
            INFO: "INFO",
            WARNING: "WARNING",
            ERROR: "ERROR",
            QUESTION: "QUESTION",
            SUCCESS: "SUCCESS"
        },
        buttons: [],
        text: null,

        show: fnShowToast
    };

    return self.service;

    //fn

    /**
     * Show a toast with a text and some action(s)
     * @param text Text to be show as message
     * @param config Object with actions to be shown on the toast. It can be an object as follow:
     *               {text: "Function name", function: someFunc}
     *               Or it can be an array fo object with the same config shown previous
     */
    function fnShowToast(text, config) {
        var show = false;
        if (angular.isDefined(text)) {
            self.service.text = text;
            show = true;
        }
        if (angular.isDefined(config)) {
            if (angular.isArray(config)) {
                self.service.buttons = config;
                show = true;
            }
            else if(angular.isObject(config)){
                if(angular.isFunction(config['function'])){
                    self.service.buttons = [config];
                    show = true;
                }
                else {
                    console.warn("Function not found on config object")
                }
            }
        }
        if (show) {
            $rootScope.$broadcast(BROADCAST.component.toast.OPEN);
        }
    }
}