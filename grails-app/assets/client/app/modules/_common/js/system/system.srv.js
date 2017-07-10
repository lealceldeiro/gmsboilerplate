/**
 * Created by Asiel on 11/17/2016.
 */

(function() {

    'use strict';

    angular
        .module('gmsBoilerplate')
        .service('systemSrv', systemSrv);

    /*@ngInject*/
    function systemSrv(notificationSrv, __env) {

        var self = this;

        self.service = {
            //region PERMISSIONS
            grant: __env.grant,
            //endregion

            //region configVars
            api_relative_url_req:           'api/',
            header_auth_token_req:          'Authorization',
            header_un_auth_token_req:       'X-Auth-Token',
            header_auth_bearer_req:         'Bearer',
            auth_new_token_requester_req:   'grant_type',
            auth_login_user_req:            'usrnm',
            auth_login_password_req:        'pswrd',

            item_refresh_token_req_resp:    'refresh_token',

            success_resp:                   'success',
            error_message_resp:             'errorMessage',
            success_message_resp:           'successMessage',
            total_count_resp:               'total',
            items_resp:                     'items',
            item_resp:                      'item',
            itemUlr_resp:                   'url',
            item_token_resp:                'access_token',
            auth_user_resp:                 'username',
            auth_permissions_resp:          'permissions',
            unauthorized_code_resp:         401,
            //endregion

            // accessible from outside, but not recommended to do so, internal service usage
            apiMessage: {},
            apiTotalCount: {},
            apiItems: {},
            apiItem: {},
            apiItemUrl: {},
            userAuthResponse: {},
            itemToken: {},
            itemRefreshToken: {},


            eval: fnEvaluateResponseData,
            evalAuth: fnEvaluateAuthenticationData,

            getMessage: fnGetMessage,
            getTotal: fnGetTotalCount,
            getItems: fnGetItems,
            getItem: fnGetItem,
            getItemUrl: fnGetItemUrl,

            getAuthToken: fnGetAuthToken,
            getAuthRefreshToken: fnGetAuthRefreshToken,
            getAuthUser: fnGetAuthUser,
            getAuthPermissions: fnGetAuthUser,
            gtAuthPermissions: fnGetAuthPermissions
        };

        self.service.APIAbsoluteUrl = __env.baseUrl + self.service.api_relative_url_req;
        self.service.SystemBaseUrl = __env.baseUrl;

        return self.service;

        /**
         * Evaluates a data from a server response and indicates whether the server said the operation was successful
         * or not. By successful or not it is excluded server errors, denies, etc (500, 401, 403, and so on). By
         * successful or not it is said if, for instance, there was not business rules violated and the operations
         * finished properly.
         * @param data data to be evaluated
         * @param storeKey key under which the data will be store
         * @param notifyOnSuccess Whether a notification should be shown or not on success result
         * @param notifyOnUnSuccess Whether a notification should be shown or not on non-success result
         * @param successCallback A callback to be shown in the notification as an action to be taken by the user if
         * the result is successful
         * @param successCallbackText A text for callback to be shown in the notification as an action to be taken
         * by the user if the result is successful
         * @param unSuccessCallback A callback to be shown in the notification as an action to be taken by the user if
         * the result is unsuccessful
         * @param unSuccessCallbackText A text for callback to be shown in the notification as an action to be taken
         * by the user if the result is unsuccessful
         * @returns {boolean} true if success, false otherwise
         */
        function fnEvaluateResponseData(data, storeKey, notifyOnSuccess, notifyOnUnSuccess, successCallback,
                                        successCallbackText, unSuccessCallback, unSuccessCallbackText) {
            validate(storeKey);
            if (data) {
                self.service.apiItems[storeKey] = data[self.service.items_resp];
                self.service.apiTotalCount[storeKey] = data[self.service.total_count_resp];
                self.service.apiItem[storeKey] = data[self.service.item_resp];
                self.service.apiItemUrl[storeKey] = data[self.service.itemUlr_resp];
                if (data[self.service.success_resp]) {
                    self.service.apiMessage[storeKey] = (notifyOnSuccess && typeof notifyOnSuccess === "string") ? notifyOnSuccess :
                        data[self.service.success_message_resp] || notificationSrv.utilText.successful_operation;
                    if (notifyOnSuccess) {
                        notificationSrv.showNotification(notificationSrv.type.SUCCESS, self.service.apiMessage[storeKey],
                            successCallback ? [successCallback] : [], successCallbackText ? [successCallbackText] : []);
                    }
                    return true
                }
                else {
                    self.service.apiMessage[storeKey] = data[self.service.error_message_resp] ||
                        notificationSrv.utilText.unsuccessful_operation;

                    if (notifyOnUnSuccess && !notificationSrv.mutedNotifications) {
                        notificationSrv.showNotification(notificationSrv.type.ERROR, self.service.apiMessage[storeKey],
                            unSuccessCallback ? [unSuccessCallback] : [], unSuccessCallbackText ? [unSuccessCallbackText] : []);
                    }

                    return false
                }
            }
            // self.service.apiMessage[storeKey] = 'There was not data provided for request with key "' + storeKey + '"';
            console.log('Forbidden access attempt (' + storeKey + ')');
            self.service.apiMessage[storeKey] = null;
            if (notifyOnUnSuccess && !notificationSrv.mutedNotifications && self.service.apiMessage[storeKey]) {
                notificationSrv.showNotification(notificationSrv.type.ERROR, self.service.apiMessage[storeKey],
                    unSuccessCallback ? [unSuccessCallback] : [], unSuccessCallbackText ? [unSuccessCallbackText] : []);
            }
            return false
        }

        /**
         * Evaluates a data from a server response on "login action" and indicates whether the server said the
         * operation was successful or not. By successful or not it is excluded server errors, denies,
         * etc (500, 401, 403, and so on). By
         * successful or not it is said if, for instance, there was not business rules violated and the operations
         * finished properly.
         * @param data data to be evaluated
         * @param storeKey key under which the data will be store
         * @param notifyOnSuccess Whether a notification should be shown or not on success result
         * @param notifyOnUnSuccess Whether a notification should be shown or not on non-success result
         * @param successCallback A callback to be shown in the notification as an action to be taken by the user if
         * the result is successful
         * @param successCallbackText A text for callback to be shown in the notification as an action to be taken
         * by the user if the result is successful
         * @param unSuccessCallback A callback to be shown in the notification as an action to be taken by the user if
         * the result is unsuccessful
         * @param unSuccessCallbackText A text for callback to be shown in the notification as an action to be taken
         * by the user if the result is unsuccessful
         * @returns {boolean} true if success, false otherwise
         */
        function fnEvaluateAuthenticationData(data, storeKey, notifyOnSuccess, notifyOnUnSuccess, successCallback,
                                              successCallbackText, unSuccessCallback, unSuccessCallbackText) {
            if (data) {
                if (data[self.service.item_token_resp]) {
                    self.service.userAuthResponse = data[self.service.auth_user_resp];
                    self.service.itemToken = data[self.service.item_token_resp];
                    self.service.itemRefreshToken = data[self.service.item_refresh_token_req_resp];
                    self.service.authPermissions = data[self.service.auth_permissions_resp];
                    self.service.apiMessage[storeKey] = (notifyOnSuccess && typeof notifyOnSuccess === "string") ? notifyOnSuccess :
                        data[self.service.success_message_resp] || notificationSrv.utilText.successful_operation;
                    if (notifyOnSuccess) {
                        notificationSrv.showNotification(notificationSrv.type.SUCCESS, self.service.apiMessage[storeKey],
                            successCallback ? [successCallback] : [], successCallbackText ? [successCallbackText] : []);
                    }

                    return true
                }
                else {
                    self.service.apiMessage[storeKey] = data[self.service.error_message_resp] ||
                        notificationSrv.getText(notificationSrv.utilText.unsuccessful_operation);

                    if (notifyOnUnSuccess) {
                        notificationSrv.showNotification(notificationSrv.type.ERROR, notificationSrv.utilText.error_label + ": " +
                            self.service.apiMessage[storeKey], unSuccessCallback ? [unSuccessCallback] : [],
                            unSuccessCallbackText ? [unSuccessCallbackText] : []);
                    }

                    return false
                }
            }
            self.service.apiMessage[storeKey] = 'There was not data provided for request with key "' + storeKey + '"';
            if (notifyOnUnSuccess && !notificationSrv.mutedNotifications) {
                notificationSrv.showNotification(notificationSrv.type.ERROR, self.service.apiMessage[storeKey],
                    unSuccessCallback ? [unSuccessCallback] : [], unSuccessCallbackText ? [unSuccessCallbackText] : []);
            }
            return false
        }

        function fnGetMessage(key) {
            validate(key);
            return self.service.apiMessage[key]
        }

        function fnGetTotalCount(key) {
            validate(key);
            return self.service.apiTotalCount[key]
        }

        function fnGetItems(key) {
            validate(key);
            return self.service.apiItems[key]
        }

        function fnGetItem(key) {
            validate(key);
            return self.service.apiItem[key]
        }

        function fnGetItemUrl(key) {
            validate(key);
            return self.service.apiItemUrl[key]
        }


        function fnGetAuthUser() {
            return self.service.userAuthResponse
        }

        function fnGetAuthToken() {
            return self.service.itemToken
        }

        function fnGetAuthRefreshToken() {
            return self.service.itemRefreshToken
        }

        function fnGetAuthPermissions() {
            return self.service.authPermissions
        }


        function validate(key) {
            if (typeof key === 'undefined' || key === null) {
                throw Error('A Key must be provided in order to store the server response')
            }
        }
    }

}());