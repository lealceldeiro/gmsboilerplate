/**
 * Created by Asiel on 11/6/2016.
 */

'use strict';

angular
    .module('gmsBoilerplate')
    .service('notificationSrv', ['toastSrv', '$translate', notificationSrv]);

function notificationSrv(toastSrv, $translate) {
    var self = this;

    self.service = {
        mutedNotifications: false,
        type: {
            INFO: "INFO",
            WARNING: "WARNING",
            ERROR: "ERROR",
            QUESTION: "QUESTION",
            SUCCESS: "SUCCESS"
        },

        utilText: {
            "error_label": "error_label",
            "success_label": "success_label",
            "successful_operation": "successful_operation",
            "unsuccessful_operation": "unsuccessful_operation",
            "select_element_required": "select_element_required",
            "unauthorized": "unauthorized",
            "user_and_password_incorrect": "user_and_password_incorrect",
            "no_response_from_server": "no_response_from_server"
        },

        showNotification: fnShow
    };

    return self.service;

    /**
     * Shows a notification
     * @param message Notification message
     * @param type (optional) Notification type: "INFO" (default), "WARNING", "ERROR", "QUESTION", "SUCCESS"
     * @param actions (optional) Functions to be executed as action presented by a Text
     * @param actionNames (optional) Texts which names the actions
     * @param primaryActionName name of the action marked as primary (highlighted by default). It must be exactly one of
     * the strings in the array "actionNames"
     */
    function fnShow(type, message, actions, actionNames, primaryActionName) {
        if (self.service.utilText.hasOwnProperty(message)) {
            $translate(message).then(function (text) {
                _showMsg(type, text, actions, actionNames, primaryActionName)
            }, function (textID) {
                _showMsg(type, textID, actions, actionNames, primaryActionName)
            });
        }
        else {
            _showMsg(type, message, actions, actionNames, primaryActionName)
        }
    }

    function _showMsg(type, message, actions, actionNames, primaryActionName){
        var buttons = [];
        //wrap buttons info
        if (angular.isDefined(actions) && angular.isDefined(actionNames)) {
            if (angular.isArray(actions) && angular.isArray(actionNames)) {
                if (actions.length === actionNames.length) {
                    var act;
                    angular.forEach(actions,function (obj, idx) {
                        if (angular.isDefined(obj) && angular.isFunction(obj)) {
                            act = {function: obj, text: actionNames[idx]};
                            if (actionNames[idx] === primaryActionName) {
                                act.primary = true;
                            }
                            buttons.push(act);
                        }
                        else{ console.warn('Action for text ' + actionNames[idx] + ' must be a function'); }
                    })
                } else { console.warn('Action and actions names must be the same length'); }
            } else { console.warn('Action and actions names must be arrays'); }
        }
        toastSrv.messageType = type;
        toastSrv.show(message, buttons);
    }
}