/**
 * Created by Asiel on 11/10/2016.
 */

'use strict';

angular
    .module('gmsBoilerplate')
    .filter('humanReadable', humanReadable);

/*@ngInject*/
function humanReadable() {

    return function (data, prefix, postfix) {
        switch (data){
            case true:
                return (prefix ? prefix : '') + 'string.active' + (postfix ? postfix : '');
            case false:
                return (prefix ? prefix : '')  + 'string.inactive' + (postfix ? postfix : '');
        }
    }
}