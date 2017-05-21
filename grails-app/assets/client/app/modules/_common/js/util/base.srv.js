/**
 * Created by Asiel on 01/05/2017.
 */

'use strict';

angular
    .module('gmsBoilerplate')
    .service('baseSrv', baseSrv);

function baseSrv(valueSrv) {
    var self = this;

    self.service = {
        resolveDeferred: fnResolveDeferred,

        getParams: fnGetParams
    };

    return self.service;

    function fnResolveDeferred (deferred){
        if (deferred.then) {
            return deferred.then(
                function (res) {
                    return res ? res.data : null;
                },
                function (resOnErr) {
                    return resOnErr ? resOnErr.data : null;
                }
            )
        }
    }

    function fnGetParams(offset, max, criteria) {
        var params = valueSrv.nNnN(offset) ? "?offset=" + offset : "";
        if (valueSrv.nNnN(max)) {
            params += params === ""? "?max=" + max : "&max=" + max;
        }
        if (valueSrv.nNnN(criteria)) {
            params += params === ""? "?q=" + criteria : "&q=" + criteria;
        }

        return params;
    }
}

baseSrv.$inject = ['valueSrv'];