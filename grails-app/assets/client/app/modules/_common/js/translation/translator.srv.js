/**
 * Created by asiel on 9/05/17.
 */

'use strict';

angular
    .module('gmsBoilerplate')
    .service('translatorSrv', translatorSrv);

/*@ngInject*/
function translatorSrv($translate) {

    var self = this;

    self.service = {
        setText: fnSetText
    };

    return self.service;

    //fn
    function fnSetText(i18nKey, objectWithText, textVarKey, interpolationObject) {
        return $translate(i18nKey, interpolationObject).then(
            function (text) {
                objectWithText[textVarKey] = text;
            },
            function (textId) {
                objectWithText[textVarKey] = textId;
            }
        )
    }
}