/**
 * Created by Asiel on 11/11/2016.
 */

'use strict';


angular
    .module('gmsBoilerplate')
    .controller('paginationCtrl', ['paginationSrv', '$scope', paginationCtrl]);

function paginationCtrl(paginationSrv, $scope) {
    var vm = this;

    vm.wizard = {
        itemsPerPage: {
            options: {
                all: [],
                selected: null
            }
        },

        currentPage: 1,

        init: fnInit,
        setItemsPerPage: fnSetItemsPerPage,

        getTotalItems: fnTotalItems,
        getTotalPages: fnTotalPages,
        getItemsPerPage: fnItemsPerPage,
        getMaxLinks: fnMaxLinks,

        showPagination: fnShowPagination
    };

    $scope.$on('RESET_PAGINATION', function () {
        vm.wizard.currentPage = 1;
    });

    vm.wizard.init();

    return vm.wizard;

    //fn
    function fnInit() {
        paginationSrv.resetPagination();

        vm.wizard.itemsPerPage.options.all = paginationSrv.getItemsPerPageSteps();
        vm.wizard.itemsPerPage.options.selected = vm.wizard.itemsPerPage.options.all[0].value;
    }

    function fnSetItemsPerPage() {
        paginationSrv.setItemsPerPage(vm.wizard.itemsPerPage.options.selected);
    }

    function fnTotalItems() {
        return paginationSrv.getTotalItems();
    }

    function fnTotalPages() {
        return paginationSrv.getItemsPerPage() ?
            Math.ceil(paginationSrv.getTotalItems() / paginationSrv.getItemsPerPage())
            : 0;
    }

    function fnMaxLinks() {
        return paginationSrv.getMaxLinks();
    }

    function fnItemsPerPage() {
        return paginationSrv.getItemsPerPage();
    }

    function fnShowPagination() {
        return fnTotalPages() > 1;
    }

}
