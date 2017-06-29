/**
 * Created by Asiel on 01/05/2017.
 */

'use strict';

angular
    .module('gmsBoilerplate')
    .service('baseSrv', baseSrv);

/*@ngInject*/
function baseSrv(valueSrv, systemSrv) {

    var self = this;

    var STATUS_OK = 200;

    self.service = {
        resolveDeferred: fnResolveDeferred,
        resolveFileRequestDeferred: fnResolveFileRequestDeferred,

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

    function fnResolveFileRequestDeferred (deferred){
        if (deferred.then) {
            var r = {};
            return deferred.then(
                function (res) {
                    //since this is a file sent in the response, we have to build the standard response here
                    if (res && res.status === STATUS_OK) {
                        r[systemSrv.success_resp] = true;
                        r[systemSrv.item_resp] = res.data;
                        r[systemSrv.itemUlr_resp] = res.config.url;
                        return r;
                    }
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