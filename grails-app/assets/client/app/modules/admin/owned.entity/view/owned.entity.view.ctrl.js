/**
 * Created by Asiel on 29/01/2017.
 */

'use strict';

angular.module('gmsBoilerplate')
    .controller('ownedEntityViewCtrl', ownedEntityViewCtrl);

/*@ngInject*/
function ownedEntityViewCtrl(ROUTE, indexSrv, ownedEntitySrv, navigationSrv, notificationSrv, systemSrv, blockSrv,
                             dialogSrv, translatorSrv, $timeout) {

    var vm = this;
    var keyP = 'ADMIN_OWNED_ENTITY_VIEW';

    vm.wizard = {
        entity: null,

        entityData: null,

        init: fnInit,
        cancel: fnCancel,
        edit: fnEdit,
        remove: fnRemove

    };

    vm.wizard.init();

    return vm.wizard;

    //fn
    function fnInit() {
        var p = navigationSrv.currentParams();
        if (p && null !== p.id && typeof p.id !== 'undefined' && p.id !== 'undefined'&& p.id !== 'null') {
            vm.id = p.id;
            fnLoadData(p.id);
            indexSrv.setTitle('ENTITY.view');
        }
        else{
            notificationSrv.showNotification(notificationSrv.type.WARNING, notificationSrv.utilText.select_element_required);
            navigationSrv.goTo(ROUTE.ADMIN_OWNED_ENTITY);
        }
    }

    function fnLoadData(id) {
        blockSrv.setIsLoading(vm.wizard.entityData,true);
        var fnKey = keyP + "fnLoadData1";
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

    function fnRemove() {
        var aux = {};
        translatorSrv.setText('string.entity_lc', aux, 'thisEntity').then(function () {
            translatorSrv.setText('button.delete', aux, 'btnText');
            translatorSrv.setText('string.headline.confirmation', aux, 'headline');
            translatorSrv.setText('string.message.delete', aux, 'messageText',
                {GENDER: 'female', element: aux['thisEntity']});
            $timeout(function () {
                var buttons = [{text: aux['btnText'], function: _doRemove, primary: true}];
                dialogSrv.showDialog(dialogSrv.type.QUESTION, aux['headline'], aux['messageText'], buttons);
            })
        });
    }

    function _doRemove() {
        var fnKey = keyP + "_doRemove";
        blockSrv.block();
        ownedEntitySrv.remove(vm.id).then(
            function (data) {
                var e = systemSrv.eval(data, fnKey, true, true);
                if (e) {
                    navigationSrv.goTo(ROUTE.ADMIN_OWNED_ENTITY);
                }
                blockSrv.unBlock();
            }
        )
    }

    function fnCancel() {
        navigationSrv.back({':id': vm.id});
    }

    function fnEdit() {
        navigationSrv.goTo(ROUTE.ADMIN_OWNED_ENTITY_EDIT, ROUTE.ADMIN_OWNED_ENTITY_EDIT_PL, vm.id);
    }

}