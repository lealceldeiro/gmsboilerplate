/**
 * Created by Asiel on 12/17/2016.
 */

'use strict';


angular
    .module('gmsBoilerplate')
    .service('valueSrv', valueSrv);

function valueSrv() {
    var self = this;

    self.service = {
        nNnN: fnNNnN
    };

    return self.service;

    /**
     * Return whether a specific field is valid or not
     * @param val Field to be evaluated
     * @returns {boolean} True if <code>f</code> is not <code>null</code> and is not <code>undefined</code>
     */
    function fnNNnN (val){
        if (angular.isArray(val)) {
            return typeof val !== 'undefined' && val !== null && val.length > 0;
        }
        return typeof val !== 'undefined' && val !== null;
    }
}
