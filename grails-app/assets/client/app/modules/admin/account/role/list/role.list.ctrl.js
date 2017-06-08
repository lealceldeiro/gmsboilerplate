/**
 * Created by Asiel on 11/9/2016.
 */

'use strict';

angular
    .module('gmsBoilerplate')
    .controller('roleListCtrl', roleListCtrl);

/*@ngInject*/
function roleListCtrl(indexSrv, systemSrv, roleSrv, navigationSrv, paginationSrv, ROUTE, searchSrv, blockSrv,
                      sessionSrv, dialogSrv, translatorSrv, $timeout, navBarSrv) {

    var vm = this;
    var keyP = 'ROLE_LIST';

    vm.wizard = {
        roles: {
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
        activateDeactivate: fnActivateDeactivate,

        searchByPageChange: fnSearchByPageChange
    };

    vm.wizard.init();

    return vm.wizard;

    //fn
    function fnInit() {
        translatorSrv.setText('ROLE.roles', indexSrv, 'siteTitle');
        paginationSrv.resetPagination();

        _generateNavBarButtons();
    }

    function fnSearch(changeFlag) {
        if (changeFlag) {
            roleSrv.sessionData.allRoles = false;
            paginationSrv.resetPagination();
        }
        if(roleSrv.sessionData.allRoles){
            fnSearchAll();
        }
        else {
            blockSrv.setIsLoading(vm.wizard.roles, true);
            vm.wizard.roles.all = [];
            var offset = paginationSrv.getOffset();
            var max = paginationSrv.getItemsPerPage();
            var ent = sessionSrv.loginEntity();
            var u = sessionSrv.currentUser();

            var fnKey = keyP + "fnSearch";
            roleSrv.search(u ? u.id : 0, ent ? ent.id : 0, offset, max).then(
                function (data) {
                    var e = systemSrv.eval(data, fnKey, false, true);
                    blockSrv.setIsLoading(vm.wizard.roles);
                    if (e) {
                        paginationSrv.setTotalItems(systemSrv.getTotal(fnKey));
                        vm.wizard.roles.all = systemSrv.getItems(fnKey);
                        vm.wizard.roles.allLoaded = false;
                    }
                }
            )
        }

    }

    function fnSearchAll(changeFlag) {
        if (changeFlag) {
            roleSrv.sessionData.allRoles = true;
            paginationSrv.resetPagination();
        }
        if(!roleSrv.sessionData.allRoles){
            fnSearch();
        }
        else {
            blockSrv.setIsLoading(vm.wizard.roles, true);

            vm.wizard.roles.all = [];
            var offset = paginationSrv.getOffset();
            var max = paginationSrv.getItemsPerPage();
            var fnKey = keyP + "fnSearchAll";

            roleSrv.searchAll(offset, max).then(
                function (data) {
                    var e = systemSrv.eval(data, fnKey, false, true);
                    blockSrv.setIsLoading(vm.wizard.roles);
                    if (e) {
                        paginationSrv.setTotalItems(systemSrv.getTotal(fnKey));
                        vm.wizard.roles.all = systemSrv.getItems(fnKey);
                        vm.wizard.roles.allLoaded = true;
                    }
                }
            );
        }
    }

    function fnEdit(id) {
        navigationSrv.goTo(ROUTE.ADMIN_ROLE_EDIT, ROUTE.ADMIN_ROLE_EDIT_PL, id);
    }

    function fnActivateDeactivate(item) {
        if (item) {
            blockSrv.block();
            var fnKey = keyP + "fnActivate";

            roleSrv.activate(item.id, item.enabled).then(
                function (data) {
                    var e = systemSrv.eval(data, fnKey, false, true);
                    blockSrv.unBlock();
                    if (!e) { //if fail, return element to after submission position (md-switch changes model)
                        item.enabled = !item.enabled;
                    }
                }
            );
        }
        else {
            console.warn("There is no role for that index");
        }
    }

    function fnView(id) {
        navigationSrv.goTo(ROUTE.ADMIN_ROLE_VIEW, ROUTE.ADMIN_ROLE_VIEW_PL, id);
    }

    function fnNew() {
        navigationSrv.goTo(ROUTE.ADMIN_ROLE_NEW);
    }

    function fnRemove(id) {
        if (typeof id !== 'undefined' && id !== null) {
            vm.idToRemove = id;

            var aux = {};
            translatorSrv.setText('string.role_lc', aux, 'thisEntity').then(
                function () {
                    translatorSrv.setText('button.delete', aux, 'deleteButtonText');
                    translatorSrv.setText('string.headline.confirmation', aux, 'headline');
                    translatorSrv.setText('string.message.delete', aux, 'deleteTextMessage',
                        {'element': aux['thisEntity'], 'GENDER': 'male'});

                    $timeout(function () {
                        var buttons = [{text:aux['deleteButtonText'], function: _doRemove, primary: true}];
                        dialogSrv.showDialog(dialogSrv.type.QUESTION, aux['headline'], aux['deleteTextMessage'], buttons);
                    })
                }
            );
        }
    }

    function _doRemove() {
        var fnKey = keyP + "_doRemove";
        blockSrv.block();
        roleSrv.remove(vm.idToRemove).then(
            function (data) {
                var e = systemSrv.eval(data, fnKey, true, true);
                if (e) {
                    var idx = searchSrv.indexOf(vm.wizard.roles.all, 'id', vm.idToRemove);
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
        fnSearchByPageChange();
    }


    function fnSearchByPageChange() {
        vm.wizard.roles.allLoaded? fnSearchAll() : fnSearch();
    }

    function _generateNavBarButtons() {
        var sNgShow = function(){ return sessionSrv.can.readRole() && vm.wizard.roles.allLoaded; };
        var search = navBarSrv.icoButton('ROLE.view_my_roles_on_entity', function(){fnSearch(true)}, 'action:ic_flip_to_back_24px', sNgShow);

        var sANgHide = function(){ return (!sessionSrv.can.readAllRole() || vm.wizard.roles.allLoaded); };
        var searchA = navBarSrv.icoButton('ROLE.view_all', function(){fnSearchAll(true)}, 'action:ic_flip_to_front_24px', null, sANgHide);

        var addNgShow = function(){ return sessionSrv.can.createRole(); };
        var add = navBarSrv.icoButton('ROLE.new', fnNew, 'content:ic_add_24px', addNgShow);

        navBarSrv.setLeftButtons([search, searchA, add]);

    }

}