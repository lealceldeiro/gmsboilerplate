/**
 * Created by asiel on 8/05/17.
 */
(function() {
    'use strict';

    angular
        .module('gmsBoilerplate')
        .config(configTranslate);

    /*@ngInject*/
    function configTranslate($translateProvider, lan) {

        for (var k in lan) {
            if (lan.hasOwnProperty(k)) {
                $translateProvider
                    .translations(k, lan[k]);
                delete lan[k] //clear var so, wee lessen the client burden
            }
        }
        $translateProvider
            .useMessageFormatInterpolation()
            .determinePreferredLanguage()
            .fallbackLanguage(['en', 'es'])
            .useSanitizeValueStrategy('escapeParameters');

    }
}());