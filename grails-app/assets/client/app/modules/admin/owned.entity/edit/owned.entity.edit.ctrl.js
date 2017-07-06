/**
 * Created by Asiel on 29/04/2017.
 */

'use strict';

angular
    .module('gmsBoilerplate')
    .controller('ownedEntityEditCtrl', ownedEntityEditCtrl);

/*@ngInject*/
function ownedEntityEditCtrl(indexSrv, ownedEntitySrv, navigationSrv, ROUTE, systemSrv, notificationSrv, blockSrv,
                             dialogSrv, formSrv) {

    var vm = this;
    var keyP = 'ADMIN_OWNED_ENTITY_EDIT';

    vm.wizard = {
        entity: {},

        entityData: null,

        init: fnInit,
        cancel: fnCancel,
        save: fnSave,
        checkUsername: fnCheckUsername,

        seeValidUser: fnSeeValidUser
    };

    vm.wizard.init();

    return vm.wizard;

    //fn
    function fnInit() {
        if (navigationSrv.currentPath() === ROUTE.ADMIN_OWNED_ENTITY_NEW) {
            indexSrv.setTitle('ENTITY.new');
            vm.NEW_MODE = true;
        }
        else {
            vm.wizard.entity = null;
            var p = navigationSrv.currentParams();
            if (p && null !== p.id && typeof p.id !== 'undefined' && p.id !== 'undefined'&& p.id !== 'null') {
                vm.id = p.id;
                fnLoadData(p.id);
                indexSrv.setTitle('ENTITY.edit');
            }
            else{
                notificationSrv.showNotification(notificationSrv.type.WARNING, notificationSrv.utilText.select_element_required);
                navigationSrv.goTo(ROUTE.ADMIN_OWNED_ENTITY);
            }
        }
    }

    function fnLoadData(id) {
        blockSrv.setIsLoading(vm.wizard.entityData, true);
        var fnKey = keyP + "fnLoadData";
        //get info
        ownedEntitySrv.show(id).then(
            function (data) {
                var e = systemSrv.eval(data, fnKey, false, true);
                if (e) {
                    vm.wizard.entity = systemSrv.getItem(fnKey);
                }
                blockSrv.setIsLoading(vm.wizard.entityData);
            }
        );
    }

    function fnSave(form) {
        if (formSrv.readyToSave(form)) {
            formSrv.setAllSubmitted(form, true, true);
            if (form.$valid && !vm.wizard.userTaken) {
                blockSrv.block();
                var params = {
                    username: vm.wizard.entity.username,
                    name: vm.wizard.entity.name,
                    description: vm.wizard.entity.description
                };
                var fnKey = keyP + "fnSave";
                ownedEntitySrv.save(params, vm.id).then(
                    function (data) {
                        blockSrv.unBlock();
                        var e = systemSrv.eval(data, fnKey, true, true);
                        if (e) {
                            if (vm.NEW_MODE) {
                                //success, clear fields
                                vm.wizard.entity = {};
                                formSrv.setAllPristine(form);
                            }
                        }
                    }
                )
            }
        }
    }

    function fnCancel() {
        navigationSrv.back({':id': vm.id});
    }

    function fnCheckUsername() {
        vm.wizard.userTaken = false;
        if (typeof vm.id === 'undefined' || vm.id === null && typeof vm.wizard.entity.username !== 'undefined' && vm.wizard.entity.username !== null) {
            var fnKey = keyP + "fnCheckUsername";
            ownedEntitySrv.getByUsername(vm.wizard.entity.username).then(
                function (data) {
                    var e = systemSrv.eval(data, fnKey);
                    if (e && systemSrv.getItem(fnKey)) {
                        vm.wizard.userTaken = true;
                    }
                }
            )
        }
    }


    function fnSeeValidUser() {
        dialogSrv.showDialogValidUser();
    }

}