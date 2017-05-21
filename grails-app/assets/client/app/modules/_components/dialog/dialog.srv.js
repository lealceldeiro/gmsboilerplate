/**
 * Created by Asiel on 11/6/2016.
 */

'use strict';

angular
    .module('gmsBoilerplate')
    .service('dialogSrv', ['$rootScope', 'BROADCAST', '$timeout', 'translatorSrv', dialogSrv]);

function dialogSrv($rootScope, BROADCAST, $timeout, translatorSrv) {
    var self = this;

    self.service = {

        messageType: "INFO",
        type: {
            INFO: "INFO",
            WARNING: "WARNING",
            ERROR: "ERROR",
            QUESTION: "QUESTION",
            SUCCESS: "SUCCESS"
        },

        data: {},
        showTabDialog: fnShowTabDialog,
        showStaticTabDialog: fnShowStaticTabDialog,

        showDialog: fnShowSimpleDialog,
        showStaticDialog: fnShowStaticSimpleDialog,

        showDialogValidUser: fnShowDialogValidUser
    };

    return self.service;

    //fn
    /**
     * Sets a tabbed modal components and shows it
     * @param messageType modal type: "INFO" (default), "WARNING", "ERROR", "QUESTION", "SUCCESS"
     * @param title modal title
     * @param tabsHeaders modal tabs titles
     * @param tabsTitles header for each tab content
     * @param tabsContent Content of each tab of the modal
     * @param buttons Buttons of the modal
     * @param cancelAction Action to be taken if action canceled
     * @param ev Event which fired the modal
     * @param isStatic whether the modal should be static or not
     */
    function fnShowTabDialog(messageType, title, tabsTitles, tabsContent, tabsHeaders, buttons, cancelAction, ev, isStatic) {
        if (self.service.type.hasOwnProperty(messageType)) {
            self.service.messageType = messageType;
        } else {
            console.log("Wrong message (" + messageType + ") type provided for dialog service. Default value was used instead.");
        }
        self.service.title = title;
        self.service.tabsHeaders = tabsHeaders;
        self.service.tabsTitles = tabsTitles;
        self.service.tabsContent = tabsContent;
        self.service.buttons = buttons;
        self.service.cancelAction = cancelAction;
        self.service.ev = ev;
        self.service.static = isStatic;
        $rootScope.$broadcast(BROADCAST.modal.SHOW_DIALOG_TAB)
    }

    /**
     * Sets a static tabbed modal components and shows it. When modal is static, it does not get closed when user
     * clicks outside it.
     * @param messageType modal type: "INFO", "WARNING", "ERROR", "QUESTION", "SUCCESS"
     * @param title modal title
     * @param tabsHeaders modal tabs titles
     * @param tabsTitles header for each tab content
     * @param tabsContent Content of each tab of the modal
     * @param buttons Buttons of the modal
     * @param cancelAction Action to be taken if action canceled
     * @param ev Event which fired the modal
     */
    function fnShowStaticTabDialog(messageType, title, tabsTitles, tabsContent, tabsHeaders, buttons, cancelAction, ev){
        fnShowTabDialog(messageType, title, tabsTitles, tabsContent, tabsHeaders, buttons, cancelAction, ev, true);
    }


    /**
     * Sets a simple modal components and shows it
     * @param messageType modal type: "INFO", "WARNING", "ERROR", "QUESTION", "SUCCESS"
     * @param title modal title
     * @param text Content of the modal
     * @param buttons Buttons of the modal
     * @param cancelAction Action to be taken if action canceled
     * @param ev Event which fired the modal
     * @param isStatic whether the modal should be static or not
     */
    function fnShowSimpleDialog(messageType, title, text, buttons, cancelAction, ev, isStatic) {
        if (self.service.type.hasOwnProperty(messageType)) {
            self.service.messageType = messageType;
        } else {
            console.log("Wrong message (" + messageType + ") type provided for dialog service. Default value was used instead.");
        }
        self.service.title = title;
        self.service.text = text;
        self.service.buttons = buttons;
        self.service.cancelAction = cancelAction;
        self.service.ev = ev;
        self.service.static = isStatic;
        $rootScope.$broadcast(BROADCAST.modal.SHOW_DIALOG);
    }

    /**
     * Sets a simple static modal component and shows it. When modal is static, it does not get closed when user
     * clicks outside it.
     * @param messageType modal type: "INFO", "WARNING", "ERROR", "QUESTION", "SUCCESS"
     * @param title modal title
     * @param text Content of the modal
     * @param buttons Buttons of the modal
     * @param cancelAction Action to be taken if action canceled
     * @param ev Event which fired the modal
     */
    function fnShowStaticSimpleDialog(messageType, title, text, buttons, cancelAction, ev){
        fnShowSimpleDialog(messageType, title, text, buttons, cancelAction, ev, true);
    }

    function fnShowDialogValidUser() {
        var aux = {};
        translatorSrv.setText('string.valid_user_description', aux, 'messageText');
        translatorSrv.setText('string.headline.information', aux, 'headline');
        $timeout(function () {
            fnShowSimpleDialog(self.service.type.INFO, aux['headline'], aux['messageText']);
        });
    }
}