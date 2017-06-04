/**
 * Created by Asiel on 12/22/2016.
 */

'use strict';

angular
    .module('gmsBoilerplate')
    .controller('userListCtrl', userListCtrl);

/*@ngInject*/
function userListCtrl(indexSrv, systemSrv, userSrv, navigationSrv, paginationSrv, ROUTE, searchSrv, blockSrv, sessionSrv,
                      dialogSrv, translatorSrv, $timeout) {

    var vm = this;
    var keyP = 'USER_LIST';

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

        searchByPageChange: fnSearchByPageChange,

        activateDeactivate: fnActivateDeactivate
    };

    vm.wizard.init();

    return vm.wizard;

    //fn
    function fnInit() {
        translatorSrv.setText('USER.users', indexSrv, 'siteTitle');
        paginationSrv.resetPagination();
    }

    function fnSearch(changeFlag) {
        if (changeFlag) {
            userSrv.sessionData.allEntities = false;
            paginationSrv.resetPagination();
        }
        if(userSrv.sessionData.allEntities){
            fnSearchAll();
        }
        else {
            blockSrv.setIsLoading(vm.wizard.entities, true);

            vm.wizard.entities.all = [];
            var offset = paginationSrv.getOffset();
            var max = paginationSrv.getItemsPerPage();
            var fnKey = keyP + "fnSearch";
            var ent = sessionSrv.loginEntity();

            userSrv.search(ent ? ent.id : 0, offset, max).then(
                function (data) {
                    var e = systemSrv.eval(data, fnKey, false, true);
                    blockSrv.setIsLoading(vm.wizard.entities);
                    if (e) {
                        paginationSrv.setTotalItems(systemSrv.getTotal(fnKey));
                        vm.wizard.entities.all = systemSrv.getItems(fnKey);
                        vm.wizard.entities.allLoaded = false;
                    }
                }
            );
        }
    }

    function fnSearchAll(changeFlag) {
        if (changeFlag) {
            userSrv.sessionData.allEntities = true;
            paginationSrv.resetPagination();
        }
        if(!userSrv.sessionData.allEntities){
            fnSearch();
        }
        else {
            blockSrv.setIsLoading(vm.wizard.entities, true);

            vm.wizard.entities.all = [];
            var offset = paginationSrv.getOffset();
            var max = paginationSrv.getItemsPerPage();
            var fnKey = keyP + "fnSearchAll";

            var p = sessionSrv.getPermissions();
            var def;
            if (p.indexOf(systemSrv.grant.READ_ALL_USER) !== -1) {
                def = userSrv.searchAll(offset, max)
            }
            else if(p.indexOf(systemSrv.grant.READ_ASSOCIATED_USER) !== -1) {
                var eidS = [];
                var es = sessionSrv.currentUser().entities;
                angular.forEach(es, function (e) {
                    eidS.push(e['id']);
                });
                def = userSrv.searchAllFromEntities(eidS, offset, max);
            }
            else { blockSrv.setIsLoading(vm.wizard.entities); }

            if (def) {
                def.then(
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
    }

    function fnEdit(id) {
        navigationSrv.goTo(ROUTE.ADMIN_USER_EDIT, ROUTE.ADMIN_USER_EDIT_PL, id);
    }

    function fnActivateDeactivate(item) {
        if (item) {
            vm.itemToDeActivate = item;
            var us = sessionSrv.currentUser();
            if (us && us.id === item.id && !item.enabled) { //deactivate current user?
                var aux = {};
                translatorSrv.setText('button.deactivate', aux, 'btnText');
                translatorSrv.setText('string.headline.confirmation', aux, 'headline');
                translatorSrv.setText('USER.deactivate_current_user', aux, 'messageText');
                $timeout(function () {
                    var buttons = [{text: aux['btnText'], function: _doActivateDeactivate, primary: true}];
                    dialogSrv.showDialog(dialogSrv.type.WARNING, aux['headline'], aux['messageText'], buttons,
                        function(){
                            item.enabled = !item.enabled;
                        });
                });

            }
            else { _doActivateDeactivate(true); }

        } else { console.warn("There is no user for that index"); }
    }

    function _doActivateDeactivate(notCurrentUser) {
        blockSrv.block();

        var fnKey = keyP + "fnActivateDeactivate";

        userSrv.activate(vm.itemToDeActivate.id, vm.itemToDeActivate.enabled).then(
            function (data) {
                var e = systemSrv.eval(data, fnKey, false, true);
                blockSrv.unBlock();
                if (!e) { //if fail, return element to after submission position (md-switch changes model)
                    vm.itemToDeActivate.enabled = !vm.itemToDeActivate.enabled;
                }
                if (notCurrentUser !== true) {
                    sessionSrv.logOut();
                    navigationSrv.goTo(ROUTE.LOGIN);
                }
            }
        );
    }

    function fnView(id) {
        navigationSrv.goTo(ROUTE.ADMIN_USER_VIEW, ROUTE.ADMIN_USER_VIEW_PL, id);
    }

    function fnNew() {
        navigationSrv.goTo(ROUTE.ADMIN_USER_NEW);
    }

    function fnRemove(id) {
        if (typeof id !== 'undefined' && id !== null) {
            vm.idToRemove = id;

            var u = sessionSrv.currentUser();
            var aux = {};
            var isThis = u && u.id == id;

            translatorSrv.setText('button.delete', aux, 'btnText');
            translatorSrv.setText('string.headline.confirmation', aux, 'headline');
            if (!isThis) {
                translatorSrv.setText('string.user_lc', aux, 'thisEntity').then(
                    function () {
                        translatorSrv.setText('string.message.delete', aux, 'messageText',
                            {element: aux['thisEntity'], GENDER: 'male'});
                        $timeout(function () {
                            _showRequestForDeleting(dialogSrv.type.QUESTION, aux['btnText'], aux['headline'], aux['messageText'])
                        });
                    }
                );
            }
            else {
                translatorSrv.setText('USER.delete_account', aux, 'messageText');
                $timeout(function () {
                    _showRequestForDeleting(dialogSrv.type.WARNING, aux['btnText'], aux['headline'], aux['messageText'])
                });
            }
        }
    }

    function _showRequestForDeleting(qType, removeBtnText, headline, message){
        var buttons = [{text: removeBtnText, function: _doRemove, primary: true}];
        dialogSrv.showDialog(qType, headline, message, buttons);
    }

    function _doRemove() {
        blockSrv.block();
        var fnKey = keyP + "_doRemove";
        userSrv.remove(vm.idToRemove).then(
            function (data) {
                var e = systemSrv.eval(data, fnKey, true, true);
                if (e) {
                    var idx = searchSrv.indexOf(vm.wizard.entities.all, 'id', vm.idToRemove);
                    if (idx !== -1) {
                        var us = sessionSrv.currentUser();
                        if (us && us.id === vm.idToRemove) { //current user?
                            sessionSrv.logOut();
                            navigationSrv.goTo(ROUTE.LOGIN);
                        }
                        else {
                            fnChangePage();
                            delete vm.idToRemove;
                        }
                    }
                    else{
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
        vm.wizard.entities.allLoaded? fnSearchAll() : fnSearch();
    }

}
