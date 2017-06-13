/**
 * Created by asiel on 13/06/17.
 */

angular
.module('gmsBoilerplate')
.controller('oeSelectorCtrl', oeSelectorCtrl);

/*@ngInject*/
function oeSelectorCtrl(indexSrv, sessionSrv, userSrv, systemSrv, paginationSrv, blockSrv) {

    var vm = this;
    const keyP = 'oeSelectorCtrl__';

    vm.wizard = {
        entities: {
            all: []
        },
        init: fnInit,
        searchByPageChange: fnSearchByPageChange,
        select: fnSelect
    };

    fnInit();

    return vm.wizard;

    //fn
    function fnInit() {
        __search();
        indexSrv.setTitle('SESSION.select_entity');
        vm.wizard.currentEntityId = sessionSrv.loginEntity().id;
    }

    function fnSelect(id) {
        //todo: call Service
        vm.wizard.currentEntityId = id;
    }

    function __search() {
        blockSrv.setIsLoading(vm.wizard.entities, true);
        userSrv.entitiesByUser(sessionSrv.currentUser().id, 0, 0).then(function (data) {
            var fnKey = keyP + "fnInit-entitiesByUser";
            var e = systemSrv.eval(data, fnKey, false, true);
            if (e) {
                paginationSrv.setTotalItems(systemSrv.getTotal(fnKey));
                vm.wizard.entities.all = systemSrv.getItems(fnKey);
            }
            blockSrv.setIsLoading(vm.wizard.entities);
        });
    }

    function fnSearchByPageChange() {
        __search();
    }
}