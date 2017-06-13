/**
 * Created by asiel on 13/06/17.
 */

angular
    .module('gmsBoilerplate')
    .service('oeSelectorSrv', oeSelectorSrv);

/*@ngInject*/
function oeSelectorSrv(baseSrv, systemSrv, $http) {

    var self = this;
    var url = systemSrv.APIAbsoluteUrl + 'reauthenticate/';

    self.service = {
        selectNewSessionEntity: fnSelectNewSessionEntity
    };

    return self.service;

    //fn
    function fnSelectNewSessionEntity(id) {
        return baseSrv.resolveDeferred($http.post(url, {e: id}))
    }
}