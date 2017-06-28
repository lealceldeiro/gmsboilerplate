/**
 * Created by Asiel on 23/12/2016.
 */

'use strict';

angular
    .module('gmsBoilerplate')
    .controller('userEditCtrl', userEditCtrl);

/*@ngInject*/
function userEditCtrl(indexSrv, userSrv, navigationSrv, ROUTE, systemSrv, notificationSrv, roleSrv, blockSrv, sessionSrv,
                      $timeout, ownedEntitySrv, dialogSrv, searchSrv, configSrv, translatorSrv) {

    var vm = this;
    var keyP = 'ADMIN_USER_EDIT';

    vm.priv = {
        MAX_TRY: 3,
        tryLoadRoles: 0
    };

    vm.wizard = {
        rolesTouched: false,
        singleEntityMode: true,
        entity: {enabled: true, profilePicture: null},

        entityData: null,

        roles: {

            offset: 0,
            max: 8,
            maxLinks: 5,

            all: [],
            selected: null
        },

        rolesToSave: [],

        passwordMatch:{},

        init: fnInit,
        cancel: fnCancel,
        save: fnSave,

        checkPasswordMatch: fnCheckPasswordMatch,
        isPasswordRequired: fnIsPasswordRequired,

        toggleEMode: fnToggleEMode,
        selectedEntity: null,
        saveRolesAndSelectEntity: fnSaveRolesAndSelectEntity,
        seeValidUser: fnSeeValidUser,
        checkUsername: fnCheckUsername,
        checkEmail: fnCheckEmail,

        canUpdateRoles: fnCanUpdateRoles
    };

    vm.wizard.init();

    return vm.wizard;

    //fn
    function fnInit() {

        _loadRoles();
        if (navigationSrv.currentPath() === ROUTE.ADMIN_USER_NEW) {
            indexSrv.setTitle('USER.new');
        }
        else {
            vm.wizard.entity = null;
            var p = navigationSrv.currentParams();
            if (p && null !== p.id && typeof p.id !== 'undefined' && p.id !== 'undefined'&& p.id !== 'null') {
                vm.id = p.id;
                _loadData(p.id);
                indexSrv.setTitle('USER.edit');
            }
            else{
                notificationSrv.showNotification(notificationSrv.type.WARNING, notificationSrv.utilText.select_element_required);
                navigationSrv.goTo(ROUTE.ADMIN_USERS);
            }
        }
        _loadEntitiesInfo();
    }

    function _loadData(id) {
        blockSrv.setIsLoading(vm.wizard.entityData, true);
        var fnKey = keyP + "fnLoadData";
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
    }

    function _loadEntitiesInfo() {
        if (fnCanUpdateRoles()) {
            var fnKey2 = keyP + "fnLoadData-entitiesByUser";
            var def;
            if (has(systemSrv.grant.READ_ALL_OWNED_ENTITY)) {
                def = ownedEntitySrv.searchAll(0, 0);
            }
            else {
                def = userSrv.entitiesByUser(vm.id, 0, 0);
            }
            def.then(function (data) {
                vm.wizard.entities = [];
                var e = systemSrv.eval(data, fnKey2, false, true);
                if (e) {
                    vm.wizard.entities = systemSrv.getItems(fnKey2);

                    vm.wizard.canToogleSingleEntityMode = configSrv.config.multiEntity && vm.wizard.entities.length > 1;
                    //user is associated to only one entity
                    if (vm.wizard.entities.length === 1) {
                        if (angular.isDefined(vm.id)) {
                            _loadAssignedRoles(vm.id, vm.wizard.entities[0]['id']);
                        }
                        vm.priv.tempEntity = vm.wizard.entities[0];
                    }
                    else { //save data for the login entity
                        vm.priv.tempEntity = searchSrv.find(vm.wizard.entities, 'id', sessionSrv.loginEntity().id) || vm.wizard.entities[0];
                        fnSaveRolesAndSelectEntity(vm.priv.tempEntity);
                        if (vm.id != sessionSrv.currentUser().id) {
                            _loadEditingUserEntitiesInfo()
                        }
                        else {
                            vm.wizard.singleEntityMode = navigationSrv.currentPath() === ROUTE.ADMIN_USER_NEW;
                        }
                    }
                }
            });
        }
    }

    function _loadEditingUserEntitiesInfo() {
        var fnKey2 = keyP + "_loadEditingUserEntitiesInfo";
        userSrv.entitiesByUser(vm.id, 0, 0).then(function (data) {
            var e = systemSrv.eval(data, fnKey2, false, true);
            if (e) {
                vm.thisUserEntities = systemSrv.getItems(fnKey2);
                vm.wizard.singleEntityMode = navigationSrv.currentPath() === ROUTE.ADMIN_USER_NEW
                    || vm.thisUserEntities.length <= 1;
            }
        });
    }

    function fnSave(form) {
        if (vm.wizard.entities && vm.wizard.entities.length > 1) {
            fnSaveRolesAndSelectEntity(); //save data for last entity clicked
        }

        if (form) {
            form.$setSubmitted();
            if (form.$valid && !vm.wizard.passwordMatch.notMatch && !vm.wizard.userTaken && !vm.wizard.emailTaken) {
                if (typeof vm.id !== 'undefined' && vm.id !== null && !vm.wizard.entity.enabled) {
                    var u = sessionSrv.currentUser();
                    if (u) {
                        if (u.id == vm.id) {
                            var aux = {};
                            translatorSrv.setText('string.active', aux, 'thisProperty').then(
                                function () {
                                    translatorSrv.setText('button.continue', aux, 'saveButtonText');
                                    translatorSrv.setText('string.headline.confirmation', aux, 'headline');
                                    translatorSrv.setText('USER.save_deactivate', aux, 'messageText', {'property': aux['thisProperty']});
                                    $timeout(function () {
                                        var buttons = [{text: aux['saveButtonText'], function: _doSave, primary: true}];
                                        dialogSrv.showDialog(dialogSrv.type.WARNING, aux['headline'], aux['messageText'], buttons);
                                    });
                                }
                            );
                        }
                        else { _doSave(true); }
                    } else { _doSave(true); }
                }
                else { _doSave(true); }
            }
        }
    }

    function _doSave(doNotDoLogout) {
        var params = {
            username: vm.wizard.entity.username,
            name: vm.wizard.entity.name,
            email: vm.wizard.entity.email,
            password: vm.wizard.entity.password,
            enabled: vm.wizard.entity.enabled,
            roles: []
        };

        if (!vm.wizard.singleEntityMode) {
            params.roles = vm.wizard.rolesToSave;
        }
        else if(vm.wizard.roles.selected && vm.wizard.roles.selected.length > 0){
            params.roles = [{entity: vm.priv.tempEntity['id'], roles: []}];
            angular.forEach(vm.wizard.roles.selected, function (element) {
                params.roles[0].roles.push(element.id)
            });
            //delete roles for all other entities
            angular.forEach(vm.wizard.entities, function (e) {
                if (e.id !== vm.priv.tempEntity.id) {
                    params.roles.push({entity: e.id, roles:[]})
                }
            })
        }

        blockSrv.block();

        var fnKey = keyP + "fnSave";

        if (navigationSrv.prevRoute === ROUTE.USER_PROFILE) {
            var def = userSrv.saveProfile(params, vm.id);
        }
        else { def = userSrv.save(params, vm.id); }

        def.then(
            function (data) {
                blockSrv.unBlock();
                var e = systemSrv.eval(data, fnKey, false, true);
                if (e) {

                    //update profile picture
                    if (vm.wizard.entity.profilePicture) {
                        var fnKey2 = keyP + "updateProfilePicture";
                        userSrv.updateProfilePicture(sessionSrv.currentUser().id, vm.wizard.entity.profilePicture).then(
                            function (data) {
                                systemSrv.eval(data, fnKey2, false, true);
                            }
                        )
                    }


                    if (doNotDoLogout !== true) {
                        _doLogout();
                    } else {
                        if (sessionSrv.currentUser().id == vm.id && vm.wizard.rolesTouched) {
                            var aux = {};
                            translatorSrv.setText('button.close_session_now', aux, 'closeButtonText');
                            translatorSrv.setText('string.headline.information', aux, 'headline');
                            translatorSrv.setText('USER.close_session_now', aux, 'messageText');
                            $timeout(function () {
                                var buttons = [{text: aux['closeButtonText'], function: _doLogout, primary: true}];
                                dialogSrv.showDialog(dialogSrv.type.SUCCESS, aux['headline'], aux['messageText'], buttons);
                            });
                        }
                        else {fnCancel();}
                    }
                }
            }
        )
    }

    function _doLogout() {
        sessionSrv.logOut();
        navigationSrv.goTo(ROUTE.LOGIN);
    }

    function fnCancel() {
        navigationSrv.back({':id': vm.id});
    }

    function fnCheckPasswordMatch() {
        delete vm.wizard.passwordMatch.notMatch;
        if (vm.wizard.entity.password && vm.wizard.entity.password2 &&
            vm.wizard.entity.password != vm.wizard.entity.password2) {
            vm.wizard.passwordMatch.notMatch = true;
        }
    }

    function fnIsPasswordRequired() {
        return typeof vm.id === 'undefined' || vm.id === null;
    }

    function _loadRoles() {
        if (fnCanUpdateRoles()) {
            blockSrv.block();
            vm.wizard.roles.all = [];
            vm.wizard.roles.selected = [];

            var fnKey = keyP + "fnLoadRoles";

            roleSrv.searchAll(0, 0).then( //off: 0, max: 0
                function (data) {
                    var e = systemSrv.eval(data, fnKey, false, true);
                    if (e) {
                        vm.wizard.roles.all = systemSrv.getItems(fnKey);
                    }
                    blockSrv.unBlock();
                }
            )
        }
    }

    function _loadAssignedRoles(uid, eid) {
        //all roles are loaded
        if (vm.wizard.roles.all.length > 0) {
            vm.wizard.roles.selected = [];

            var fnKey = keyP + "fnLoadAssignedRoles";

            roleSrv.search(uid, eid, 0, 0).then(
                function (data) {
                    var e = systemSrv.eval(data, fnKey, false, true);
                    if (e) {
                        var rolesAux = systemSrv.getItems(fnKey),
                            rolesAuxIDs = [];
                        angular.forEach(rolesAux, function (r) {
                            rolesAuxIDs.push(r['id']);
                        });
                        vm.wizard.roles.selected = searchSrv.findCollection(vm.wizard.roles.all, 'id', rolesAuxIDs);
                    }
                    vm.priv.tryLoadRoles = 0;
                    return data;
                }
            )
        }
        else if(vm.priv.tryLoadRoles++ < vm.priv.MAX_TRY) {
            $timeout(function () {
                return _loadAssignedRoles(uid, eid);
            }, 500)
        }
    }

    function fnToggleEMode() {
        fnSaveRolesAndSelectEntity();
        if (vm.wizard.singleEntityMode) {
            vm.wizard.roles.selected = [];
            vm.wizard.selectedEntity = null;
            var prevEntity = searchSrv.find(vm.wizard.rolesToSave, 'entity', sessionSrv.loginEntity().id);
            if (prevEntity) {
                vm.wizard.roles.selected = searchSrv.findCollection(vm.wizard.roles.all, 'id', prevEntity.roles);
            }
            else {
                if (angular.isDefined(vm.id)) {
                    _loadAssignedRoles(vm.id, sessionSrv.loginEntity().id);
                }
            }
        }
        else if (vm.wizard.entities.length > 1){
            vm.wizard.selectedEntity = vm.priv.tempEntity;
            fnSaveRolesAndSelectEntity(vm.priv.tempEntity); //save data for last entity clicked
        }
    }

    function fnSeeValidUser() {
        dialogSrv.showDialogValidUser();
    }

    function fnCheckUsername() {
        vm.wizard.userTaken = false;
        if (typeof vm.id === 'undefined' || vm.id === null && typeof vm.wizard.entity.username !== 'undefined' && vm.wizard.entity.username !== null) {
            var fnKey = keyP + "fnCheckUsername";
            userSrv.getByUsername(vm.wizard.entity.username).then(
                function (data) {
                    var e = systemSrv.eval(data, fnKey);
                    if (e && systemSrv.getItem(fnKey)) {
                        vm.wizard.userTaken = true;
                    }
                }
            )
        }
    }

    function fnCheckEmail() {
        vm.wizard.emailTaken = false;
        if (typeof vm.id === 'undefined' || vm.id === null) {
            var fnKey = keyP + "fnCheckUsername";
            userSrv.getByEmail(vm.wizard.entity.email).then(
                function (data) {
                    var e = systemSrv.eval(data, fnKey);
                    if (e && systemSrv.getItem(fnKey)) {
                        vm.wizard.emailTaken = true;
                    }
                }
            )
        }
    }

    //region entities-handling
    function fnSaveRolesAndSelectEntity(eParam) {
        if (vm.wizard.selectedEntity) {
            //save previously selected or removed roles
            var prevEntity = searchSrv.find(vm.wizard.rolesToSave, 'entity', vm.wizard.selectedEntity.id);
            var tempRoles = [];
            angular.forEach(vm.wizard.roles.selected, function (r) {
                tempRoles.push(r.id)
            });
            if (prevEntity) {
                prevEntity.roles = tempRoles;
            }
            else {
                vm.wizard.rolesToSave.push({entity: vm.wizard.selectedEntity.id, roles: tempRoles})
            }
        }
        if (eParam) {
            vm.wizard.selectedEntity = Object.assign(eParam);
            var currentEntity = searchSrv.find(vm.wizard.rolesToSave, 'entity', eParam.id);
            if (currentEntity) {
                vm.wizard.roles.selected = searchSrv.findCollection(vm.wizard.roles.all, 'id', currentEntity.roles);
            } else {
                if (angular.isDefined(vm.id)) {
                    return _loadAssignedRoles(vm.id, vm.wizard.selectedEntity.id);
                }
                else {
                    vm.wizard.roles.selected = [];
                }
            }
        }
    }
    //endregion

    function fnCanUpdateRoles() {
        return has(systemSrv.grant.UPDATE_USER);
    }

    function has(permArgs, any) {
        return sessionSrv.has(permArgs, any);
    }
}

