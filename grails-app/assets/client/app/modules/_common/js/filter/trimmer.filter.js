/**
 * Created by Asiel on 12/26/2016.
 */

'use strict';

angular
    .module('gmsBoilerplate')
    .filter('trimmer', trimmer);

/*@ngInject*/
function trimmer() {

    return function (data, length, append) {
        if (data) {
            data = data.toString();
            length = length ? length : data.length;
            return data.length <= length ? data : data.substring(0, length) + (append ? append : "")
        }
    }
}