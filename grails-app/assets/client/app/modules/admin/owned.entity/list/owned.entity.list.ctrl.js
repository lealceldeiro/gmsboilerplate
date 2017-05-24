/**
 * Created by Asiel on 01/24/2016.
 */

'use strict';

angular
    .module('gmsBoilerplate')
    .controller('ownedEntityListCtrl', ownedEntityListCtrl);

/*@ngInject*/
function ownedEntityListCtrl(indexSrv, systemSrv, ownedEntitySrv, navigationSrv, paginationSrv, ROUTE, searchSrv, blockSrv,
                             sessionSrv, dialogSrv, translatorSrv, $timeout) {

    var vm = this;
    var keyP = 'OWNED_ENTITY_LIST';

    vm.wizard = {
        entities: {
            all: []
        },
        init: fnInit,

        changePage: fnChangePage,
        search: fnSearch,
        searchAll: fnSearchAll,
        view: fnView,
        remove: fnRemove,
        new: fnNew,
        edit: fnEdit,

        searchByPageChange: fnSearchByPageChange
    };

    vm.wizard.init();

    return vm.wizard;

    //fn
    function fnInit() {
        translatorSrv.setText('ENTITY.entities', indexSrv, 'siteTitle');
        paginationSrv.resetPagination();
    }

    function fnSearch(changeFlag) {
        if (changeFlag) {
            ownedEntitySrv.sessionData.allEntities = false;
            paginationSrv.resetPagination();
        }
        if(ownedEntitySrv.sessionData.allEntities){
            fnSearchAll();
        }
        else {
            blockSrv.setIsLoading(vm.wizard.entities, true);
            vm.wizard.entities.all = [];
            var offset = paginationSrv.getOffset();
            var max = paginationSrv.getItemsPerPage();

            var fnKey = keyP + "fnSearch";
            var u = sessionSrv.currentUser();

            ownedEntitySrv.search(u ? u.id : 0, offset, max).then(
                function (data) {
                    var e = systemSrv.eval(data, fnKey, false, true);
                    blockSrv.setIsLoading(vm.wizard.entities);
                    if (e) {
                        paginationSrv.setTotalItems(systemSrv.getTotal(fnKey));
                        var it = systemSrv.getItems(fnKey);
                        if (it) {
                            vm.wizard.entities.all = it;
                            vm.wizard.entities.allLoaded = false;
                        }
                    }
                }
            )
        }
    }

    function fnSearchAll(changeFlag) {
        if (changeFlag) {
            ownedEntitySrv.sessionData.allEntities = true;
            paginationSrv.resetPagination();
        }
        if(!ownedEntitySrv.sessionData.allEntities){
            fnSearch();
        }
        else {
            blockSrv.setIsLoading(vm.wizard.entities, true);

            vm.wizard.entities.all = [];
            var offset = paginationSrv.getOffset();
            var max = paginationSrv.getItemsPerPage();
            var fnKey = keyP + "fnSearchAll";

            ownedEntitySrv.searchAll(offset, max).then(
                function (data) {
                    var r = systemSrv.eval(data, fnKey, false, true);
                    if (r) {
                        paginationSrv.setTotalItems(systemSrv.getTotal(fnKey));
                        vm.wizard.entities.all = systemSrv.getItems(fnKey);
                        vm.wizard.entities.allLoaded = true;
                    }
                    blockSrv.setIsLoading(vm.wizard.entities);
                }
            );

        }
    }

    function fnEdit(id) {
        navigationSrv.goTo(ROUTE.ADMIN_OWNED_ENTITY_EDIT, ROUTE.ADMIN_OWNED_ENTITY_EDIT_PL, id);
    }

    function fnView(id) {
        navigationSrv.goTo(ROUTE.ADMIN_OWNED_ENTITY_VIEW, ROUTE.ADMIN_OWNED_ENTITY_VIEW_PL, id);
    }

    function fnNew() {
        navigationSrv.goTo(ROUTE.ADMIN_OWNED_ENTITY_NEW);
    }

    function fnRemove(id) {
        if (typeof id !== 'undefined' && id !== null) {
            vm.idToRemove = id;

            var aux = {};
            translatorSrv.setText('string.entity_lc', aux, 'thisEntity').then(
                function () {
                    translatorSrv.setText('button.delete', aux, 'btnText');
                    translatorSrv.setText('string.headline.confirmation', aux, 'headline');
                    translatorSrv.setText('string.message.delete', aux, 'textMessage',
                        {'element': aux['thisEntity'], 'GENDER': 'female'});

                    $timeout(function () {
                        var buttons = [{text:aux['btnText'], function: _doRemove, primary: true}];
                        dialogSrv.showDialog(dialogSrv.type.QUESTION, aux['headline'], aux['textMessage'], buttons);
                    })
                }
            );
        }
    }

    function _doRemove() {
        blockSrv.block();
        var fnKey = keyP + "_doRemove";
        ownedEntitySrv.remove(vm.idToRemove).then(
            function (data) {
                var e = systemSrv.eval(data, fnKey, true, true);
                if (e) {
                    var idx = searchSrv.indexOf(vm.wizard.entities.all, 'id', vm.idToRemove);
                    if (idx !== -1) {
                        fnChangePage();
                        delete vm.idToRemove;
                    }
                }
                blockSrv.unBlock();
            }
        )
    }

    function fnUndoRemove() {

    }

    function fnChangePage(newPageNumber) {
        paginationSrv.moveTo(newPageNumber);
        vm.wizard.search();
    }

    function fnSearchByPageChange() {
        vm.wizard.entities.allLoaded? fnSearchAll() : fnSearch();
    }

}