/**
 * Created by asiel on 3/07/17.
 */

angular
    .module('gmsBoilerplate')
    .service('formSrv', formSrv);

/*@ngInject*/
function formSrv($timeout) {
    var self = this;

    var scopes = {};

    self.service = {
        setAllPristine: fnSetAllPristine,
        setAllSubmitted: fnSetAllSubmitted,
        readyToSave: fnReadyToSave
    };

    return self.service;


    /**
     * Sets a formElement and its sub-components recursively $pristine and $untouched (AngularJS' $pristine and AngularJS'
     * $untouched). Optionally it reset the error object present in these components.
     * @param formElement to be set as $pristine and $untouched
     * @param scope [optional] controller's scope in order to apply possible fixes. A scpe.$apply will be executed after
     * the fix is being applies, because DOM elements may be modified outside the AngularJS context.
     * @param removeErrorObject [optional] whether the error object should be reset or not
     */
    function fnSetAllPristine(formElement, scope, removeErrorObject) {
        if (formElement) {
            $timeout(function () {
                if (formElement.$setPristine) {
                    formElement.$setPristine();
                }
                if (formElement.$setUntouched) {
                    formElement.$setUntouched();
                }
                if (removeErrorObject) {
                    formElement['$error'] = {};
                }
                angular.forEach(formElement, function(item) {
                    if(item && item.$$parentForm === formElement && (item.$setPristine || item.$setUntouched)) {
                        fnSetAllPristine(item, removeErrorObject);
                    }
                });

                //apply fixes and update angular context
                if (scope && scope.$apply) {
                    scopes[formElement['$name']] = scope;
                    $timeout(function () {
                        fix_HideNgMessageOnFormReset();
                        scopes[formElement['$name']].$apply()
                    }, 100);
                }
            });
        }
    }

    /**
     * Sets a formElement and its sub-components recursively $dirty and $touched (AngularJS' $dirty and AngularJS'
     * $touched). Optionally it reset the error object present in these components.
     * @param formElement to be set as $pristine and $untouched
     * @param setDirty whether the element should be set to $dirty or not
     * @param setTouched whether the element should be set to $touched or not
     */
    function fnSetAllSubmitted(formElement, setDirty, setTouched) {
        if (formElement) {
            if (setTouched && formElement.$setTouched) { //todo
                formElement.$setTouched();
            }
            if (setDirty && formElement.$setDirty) {
                formElement.$setDirty();
            }
            if (formElement.$setSubmitted) {
                formElement.$setSubmitted();
            }
            angular.forEach(formElement, function (item) {
                if (item && item.$$parentForm === formElement && (item.$setSubmitted || item.$setDirty || item.$setTouched)) {
                    fnSetAllSubmitted(item, setDirty, setTouched);
                }
            });
        }
    }

    function fnReadyToSave(form) {
        return form && form.$dirty;
    }
}