/**
 * Created by asiel on 8/05/17.
 */

'use strict';

angular
    .module('gmsBoilerplate')
    .config(['$translateProvider', 'lan', configTranslate]);

function configTranslate($translateProvider, lan) {

    for(var k in lan) {
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