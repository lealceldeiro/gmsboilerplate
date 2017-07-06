/**
 * Created by Asiel on 11/9/2016.
 */

'use strict';

angular
    .module('gmsBoilerplate')
    .controller('roleEditCtrl', roleEditCtrl);

/*@ngInject*/
function roleEditCtrl(indexSrv, roleSrv, navigationSrv, ROUTE, systemSrv, notificationSrv, blockSrv,
                      permissionSrv, dialogSrv, $filter, translatorSrv, $timeout, searchSrv, $scope, formSrv) {

    var vm = this;
    var keyP = 'ADMIN_ROLE_EDIT';
    var permissionsTabContents = null;

    vm.wizard = {
        role: {enabled: true},

        roleData: null,

        permissions: {

            offset: 0,
            max: 8,
            maxLinks: 5,

            all: [],
            selected: []
        },

        init: fnInit,
        cancel: fnCancel,
        save: fnSave,
        loadPermissionsList: fnLoadPermissionsList
    };

    vm.wizard.init();

    return vm.wizard;

    //fn
    function fnInit() {
        if (navigationSrv.currentPath() === ROUTE.ADMIN_ROLE_NEW) {
            fnLoadPermissionsList();
            indexSrv.setTitle('ROLE.new');
            vm.NEW_MODE = true;
        }
        else {
            vm.wizard.role = null;
            var p = navigationSrv.currentParams();
            if (p && null !== p.id && typeof p.id !== 'undefined' && p.id !== 'undefined'&& p.id !== 'null') {
                vm.id = p.id;
                fnLoadPermissionsList(false, true);
                fnLoadData(p.id);
                indexSrv.setTitle('ROLE.edit');
            }
            else{
                notificationSrv.showNotification(notificationSrv.type.WARNING, notificationSrv.utilText.select_element_required);
                navigationSrv.goTo(ROUTE.ADMIN_ROLES);
            }
        }
    }

    function fnLoadData(id) {
        blockSrv.setIsLoading(vm.wizard.roleData,true);
        var fnKey = keyP + "fnLoadData";
        //get info
        roleSrv.show(id).then(
            function (data) {
                var e = systemSrv.eval(data, fnKey,  false, true);
                if (e) {
                    vm.wizard.role = systemSrv.getItem(fnKey);
                }
                blockSrv.setIsLoading(vm.wizard.roleData);
            }
        );
    }

    function fnSave(form) {
        if (formSrv.readyToSave(form)) {
            formSrv.setAllSubmitted(form, true, true);
            if (form.$valid) {
                blockSrv.block();
                var params = {
                    label: vm.wizard.role.label,
                    description: vm.wizard.role.description,
                    enabled: vm.wizard.role.enabled,
                    permissions: []
                };
                angular.forEach(vm.wizard.permissions.selected, function (element) {
                    params.permissions.push(element.id)
                });

                var fnKey = keyP + "fnSave";
                roleSrv.save(params, vm.id).then(
                    function (data) {
                        blockSrv.unBlock();
                        var e = systemSrv.eval(data, fnKey, true, true);
                        if (e) {
                            if (vm.NEW_MODE) {
                                //success, clear fields
                                vm.wizard.role = {enabled: true};
                                vm.wizard.permissions.selected = [];
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

    function _loadUserPermissions(criteria) {
        var fnKey = keyP + "_loadPermissionsInitial";

        roleSrv.permissionsByUser(vm.id, 0).then(
            function (data) {
                var fnKey2 = fnKey + "2";
                var e = systemSrv.eval(data, fnKey2, false, true);
                if (e) {
                    var userP = systemSrv.getItems(fnKey2),
                        idx,
                        auxP = [];
                    for(var vp = userP.length - 1; vp >= 0; vp--){
                        idx = searchSrv.indexOf(vm.wizard.permissions.all, 'id', userP[vp]['id']);
                        if (idx !== -1) {
                            auxP.push(vm.wizard.permissions.all[idx]);
                        }
                        else {
                            auxP.push(userP[vp])
                        }
                    }
                }
                vm.wizard.permissions.selected = auxP;
                $timeout(function () { $scope.$apply(); })
            }
        );
    }


    function fnLoadPermissionsList(show, loadAssignedToUsers) {
        if (!vm.wizard.permissionsCaterories) {
            var fnKey = keyP + "_loadPermissions-fnShowRoleListDialog";
            vm.wizard.permissions.all = [];
            permissionSrv.search(0, 0).then(
                function (data) {
                    var e = systemSrv.eval(data, fnKey, false, true);
                    if (e) {
                        vm.wizard.permissionsCaterories = [];
                        permissionsTabContents = [];
                        var allPermissions = systemSrv.getItems(fnKey);
                        var name, idx, label, iPermission;

                        for(var i = 0, l = allPermissions.length; i < l; i++){
                            iPermission = allPermissions[i];
                            name = iPermission.name.substring(iPermission.name.indexOf("__") + 2, iPermission.name.length);
                            if (name.length > 1) {
                                idx = vm.wizard.permissionsCaterories.indexOf(name);
                                label = $filter('caser')(iPermission.label);
                                if (idx === -1) {
                                    vm.wizard.permissionsCaterories.push(name);
                                    permissionsTabContents[vm.wizard.permissionsCaterories.length - 1] = label;
                                }
                                else{
                                    permissionsTabContents[idx] += "<br/>" + "<br/>" + label;
                                }
                            }
                            iPermission['category'] = name;
                            vm.wizard.permissions.all.push(iPermission);
                        }
                        if(show) __show();
                    }
                    if (loadAssignedToUsers) {
                        _loadUserPermissions()
                    }
                }
            )
        } else if(show){ __show(); }
    }

    function __show() {
        var aux = {};
        translatorSrv.setText('PERMISSIONS.permissions', aux, 'permissionsText');
        $timeout(function () {
            dialogSrv.showTabDialog(dialogSrv.type.INFO, aux['permissionsText'] + " (" + vm.wizard.permissions.all.length + ")",
                vm.wizard.permissionsCaterories, permissionsTabContents);
        });
    }

}