/**
 * Created by asiel on 13/06/17.
 */

angular
    .module('gmsBoilerplate')
    .controller('oeSelectorCtrl', oeSelectorCtrl);

/*@ngInject*/
function oeSelectorCtrl(indexSrv, sessionSrv, userSrv, systemSrv, paginationSrv, blockSrv, oeSelectorSrv, $window,
                        $timeout, translatorSrv) {

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

    function fnSelect(item) {
        vm.wizard.currentIdInProgress = item.id;
        var aux = {};
        translatorSrv.setText("SESSION.reloading_config", aux, 'text');

        oeSelectorSrv.selectNewSessionEntity(item.id).then(function (data) {
            var fnKey = keyP + "fnSelect";
            var e = systemSrv.eval(data, fnKey, aux['text'], true);
            if (e) {
                sessionSrv.setCurrentOwnedEntity(item);
                sessionSrv.setPermissions(systemSrv.getItems(fnKey));
                $timeout(function () {
                    $window.location.reload();
                });
            }
        })
    }

    function __search() {
        blockSrv.setIsLoading(vm.wizard.entities, true);
        userSrv.entitiesByUser(sessionSrv.currentUser().id, paginationSrv.getOffset(), paginationSrv.getItemsPerPage()).then(
            function (data) {
                var fnKey = keyP + "fnInit-entitiesByUser";
                var e = systemSrv.eval(data, fnKey, false, true);
                if (e) {
                    paginationSrv.setTotalItems(systemSrv.getTotal(fnKey));
                    vm.wizard.entities.all = systemSrv.getItems(fnKey);
                }
                blockSrv.setIsLoading(vm.wizard.entities);
            }
        );
    }

    function fnSearchByPageChange() {
        __search();
    }
}