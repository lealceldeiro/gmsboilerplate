/**
 * Created by Asiel on 23/12/2016.
 */

'use strict';

angular
    .module('gmsBoilerplate')
    .controller('userViewCtrl', userViewCtrl);

/*@ngInject*/
function userViewCtrl(ROUTE, indexSrv, userSrv, navigationSrv, notificationSrv, systemSrv, blockSrv, sessionSrv,
                      dialogSrv, searchSrv, roleSrv, translatorSrv, $timeout) {

    var vm = this;
    var keyP = 'ADMIN_USER_VIEW';

    vm.wizard = {
        entity: null,

        entityData: null,

        roles: {
            itemsPerPage: 5,
            total: 0,
            offset: 0,
            allData: []
        },

        rolesWithEntities: [],

        init: fnInit,
        cancel: fnCancel,
        edit: fnEdit,
        remove: fnRemove,

        selectedEntity: null,
        selectEntity: fnSelectEntity
    };

    vm.wizard.init();

    return vm.wizard;

    //fn
    function fnInit() {
        var p = navigationSrv.currentParams();
        if (p && null !== p.id && typeof p.id !== 'undefined' && p.id !== 'undefined'&& p.id !== 'null') {
            vm.id = p.id;
            fnLoadData(p.id);
            translatorSrv.setText('USER.view', indexSrv, 'siteTile');
        }
        else if(navigationSrv.currentPath() === ROUTE.USER_PROFILE) {
            vm.wizard.isProfile = true;
            vm.id = sessionSrv.currentUser().id;
            fnLoadData(vm.id);
            translatorSrv.setText('USER.profile', indexSrv, 'siteTile');
        }

        else {
            notificationSrv.showNotification(notificationSrv.type.WARNING, notificationSrv.utilText.select_element_required);
            navigationSrv.goTo(ROUTE.ADMIN_USERS);
        }
    }

    function fnLoadData(id) {
        blockSrv.setIsLoading(vm.wizard.entityData,true);
        var fnKey = keyP + "fnLoadData1";
        //get info
        userSrv.show(id).then(
            function (data) {
                var e = systemSrv.eval(data, fnKey, false, true);
                if (e) {
                    vm.wizard.entity = systemSrv.getItem(fnKey);
                }
                blockSrv.setIsLoading(vm.wizard.entityData);
            }
        );

        if (!vm.wizard.isProfile) {
            var fnKey2 = keyP + "fnLoadData-entitiesByUser";
            userSrv.entitiesByUser(id, 0, 0).then(function (data) {
                vm.wizard.entities = [];
                var e = systemSrv.eval(data, fnKey2, false, true);
                if (e) {
                    vm.wizard.entities = systemSrv.getItems(fnKey2);

                    //user is associated to only one entity
                    if (vm.wizard.entities.length === 1) {
                        _loadRoles(id, vm.wizard.entities[0]['id']);
                    }
                    else {
                        fnSelectEntity(searchSrv.find(vm.wizard.entities, 'id', sessionSrv.loginEntity().id) || vm.wizard.entities[0]);
                    }
                }
            });
        }
    }

    function fnRemove() {
        vm.toRemoveProfile = false;
        var u = sessionSrv.currentUser();
        var aux = {};
        var isThis = u && u.id == vm.id;

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
            vm.toRemoveProfile = true;
            translatorSrv.setText('USER.delete_account', aux, 'messageText');
            $timeout(function () {
                _showRequestForDeleting(dialogSrv.type.WARNING, aux['btnText'], aux['headline'], aux['messageText'])
            });
        }
    }

    function _showRequestForDeleting(qType, removeBtnText, headline, message){
        var buttons = [{text: removeBtnText, function: _doRemove, primary: true}];
        dialogSrv.showDialog(qType, headline, message, buttons);
    }

    function _doRemove() {
        var fnKey = keyP + "_doRemove";
        blockSrv.block();
        userSrv.remove(vm.id).then(
            function (data) {
                var e = systemSrv.eval(data, fnKey, true, true);
                if (e) {
                    if (vm.toRemoveProfile) {
                        sessionSrv.logOut();
                        navigationSrv.goTo(ROUTE.LOGIN);
                    }
                    else { navigationSrv.goTo(ROUTE.ADMIN_USERS); }
                }
                blockSrv.unBlock();
            }
        )
    }

    function fnCancel() {
        navigationSrv.back({':id': vm.id});
    }

    function fnEdit() {
        navigationSrv.goTo(ROUTE.ADMIN_USER_EDIT, ROUTE.ADMIN_USER_EDIT_PL, vm.id);
    }

    function _loadRoles(id, eid, doNotBlockUI) {
        if (!doNotBlockUI) { blockSrv.setIsLoading(vm.wizard.roles, true); }
        vm.wizard.roles.all = []; //all roles assigned to this user in this entity (eid)
        vm.wizard.roles.total = 0;
        var fnKey2 = keyP + "_loadRoles";

        roleSrv.search(id, eid, 0, 0).then(
            function (data) {
                var e = systemSrv.eval(data, fnKey2, false, true);
                if (e) {
                    vm.wizard.roles.all = systemSrv.getItems(fnKey2);
                    for (var x = vm.wizard.roles.all.length - 1; x >= 0; x--){
                        if(searchSrv.indexOf(vm.wizard.roles.allData, 'id', vm.wizard.roles.all[x]['id']) === -1) {
                            vm.wizard.roles.allData.push(vm.wizard.roles.all[x]);
                        }
                    }
                    vm.wizard.roles.total = systemSrv.getTotal(fnKey2);
                }
                if (!doNotBlockUI) { blockSrv.setIsLoading(vm.wizard.roles); }
            }
        )
    }

    //region entities-handling
    function fnSelectEntity(eParam) {
        if (vm.wizard.selectedEntity) {
            //save previously selected or removed roles
            var prevEntity = searchSrv.find(vm.wizard.rolesWithEntities, 'entity', vm.wizard.selectedEntity.id);
            var tempRoles = [];
            angular.forEach(vm.wizard.roles.all, function (r) {
                tempRoles.push(r.id)
            });
            if (prevEntity) {
                prevEntity.roles = tempRoles;
            }
            else {
                vm.wizard.rolesWithEntities.push({entity: vm.wizard.selectedEntity.id, roles: tempRoles})
            }
        }
        if (eParam) {
            vm.wizard.selectedEntity = Object.assign(eParam);
            var currentEntity = searchSrv.find(vm.wizard.rolesWithEntities, 'entity', eParam.id);
            if (currentEntity) {
                vm.wizard.roles.all = searchSrv.findCollection(vm.wizard.roles.allData, 'id', currentEntity.roles);
            } else {
                return _loadRoles(vm.id, vm.wizard.selectedEntity.id, false);
            }
        }
    }
    //endregion

}
