/**
 * Created by asiel on 8/06/17.
 */

angular
    .module('gmsBoilerplate')
    .service('navBarSrv', navBarSrv);

/*@ngInject*/
function navBarSrv($rootScope, BROADCAST) {
    var self = this;

    var ngShows = {};
    var ngHides = {};

    self.service = {
        leftButtons: [],

        setLeftButtons: fnSetLeftButtons,
        icoButton: fnCreateIconButton,
        labelButton: fnCreateLabelButton,
        cleanLeftButtons: fnCleanLeftButtons
    };

    return self.service;

    //
    function fnCleanLeftButtons() {
        self.service.leftButtons = [];
        $rootScope.$broadcast(BROADCAST.navBav.updateLeftButtons);
    }

    function fnSetLeftButtons(buttons) {
        if (buttons) {
            if (angular.isArray(buttons)) {
                self.service.leftButtons = buttons;
            }
            else if(angular.isObject(buttons)){ //only one button
                self.service.leftButtons = [buttons]
            }
            $rootScope.$broadcast(BROADCAST.navBav.updateLeftButtons);
        }
    }

    function fnCreateIconButton(i18n, ngClickAction, icon, ngShowFunc, ngHideFunc) {
        if (!i18n) { throw Error('"i18n" is mandatory'); }
        if (!ngClickAction) { throw Error('"ngClickAction" is mandatory'); }
        if (!icon) { throw Error('"icon" is mandatory'); }
        var b =  {
            text: i18n,
            action: ngClickAction,
            icon: icon,
            bClass: 'md-icon-button text-white'
        };

        if (ngShowFunc && typeof ngShowFunc === 'function') {
            b.ngShow = bNgShow;
            //take i18n and icon combo as key for storing the show func
            ngShows[i18n + icon] = ngShowFunc;
        }
        else if (ngHideFunc && typeof ngHideFunc === 'function') {
            b.ngShow = bNgShow;
            //take i18n and icon combo as key for storing the hider func
            ngHides[i18n + icon] = ngHideFunc;
            b.tryToHide = true;
        }
        else {
            b.ngShow = function() { return true };
        }

        return b;
    }
    function fnCreateLabelButton() {

    }

    function bNgShow(keyI18nPlusIcon, inverse) {
        if (!inverse && ngShows[keyI18nPlusIcon] && typeof ngShows[keyI18nPlusIcon] === 'function') {
            return ngShows[keyI18nPlusIcon]();
        }
        else if (ngHides[keyI18nPlusIcon] && typeof ngHides[keyI18nPlusIcon] === 'function') {
            return !ngHides[keyI18nPlusIcon]();
        }
        //show by default
        return !inverse;
    }
}