/**
 * Created by Asiel on 01/20/2017.
 */

'use strict';

angular
    .module('gmsBoilerplate')
    .controller('permissionCtrl', permissionCtrl);

function permissionCtrl(indexSrv, systemSrv, permissionSrv, paginationSrv, blockSrv) {
    var vm = this;
    var keyP = 'PERMISSIONS_LIST';

    vm.wizard = {
        entities: {
            all: []
        },
        init: fnInit,

        changePage: fnChangePage,
        search: fnSearch,

        searchByPageChange: fnSearchByPageChange
    };

    vm.wizard.init();

    return vm.wizard;

    //fn
    function fnInit() {
        indexSrv.setTitle('PERMISSIONS.permissions');
        paginationSrv.resetPagination();
    }

    function fnSearch() {
        vm.wizard.entities.all = [];
        var offset = paginationSrv.getOffset();
        var max = paginationSrv.getItemsPerPage();

        var fnKey = keyP + "fnSearch";
        blockSrv.setIsLoading(vm.wizard.entities, true);
        permissionSrv.search(offset, max).then(
            function (data) {
                var e = systemSrv.eval(data, fnKey, false, true);
                blockSrv.setIsLoading(vm.wizard.entities);
                if (e) {
                    paginationSrv.setTotalItems(systemSrv.getTotal(fnKey));
                    vm.wizard.entities.all = systemSrv.getItems(fnKey);
                }
            }
        )

    }

    function fnChangePage(newPageNumber) {
        paginationSrv.moveTo(newPageNumber);
        vm.wizard.search();
    }

    function fnSearchByPageChange() {
        fnSearch();
    }

}
