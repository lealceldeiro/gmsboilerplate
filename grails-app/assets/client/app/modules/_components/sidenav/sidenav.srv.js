/**
 * Created by asiel on 6/06/17.
 */

'use strict';

angular
    .module('gmsBoilerplate')
    .service('GMSSideNavSrv', GMSSideNavSrv);

/*@ngInject*/
function GMSSideNavSrv($rootScope, BROADCAST) {
    var self = this;

    self.service = {
        closeSideNav: fnCloseSideNav
    };

    return self.service;

    function fnCloseSideNav(){
        $rootScope.$broadcast(BROADCAST.sidenav.close)
    }
}