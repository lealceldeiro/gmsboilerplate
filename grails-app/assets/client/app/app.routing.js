/**
 * Created by Asiel on 11/6/2016.
 */

'use strict';

angular
    .module('gmsBoilerplate')
    .config(['$routeProvider', 'ROUTE', '$locationProvider', '__env', routing]);

function routing($routeProvider, ROUTE, $locationProvider, __env) {

    if (window.history && history.pushState) { $locationProvider.html5Mode(true); }
    else { __env.supportHtml5 = false; }

    $routeProvider

        //region error
        .when(ROUTE.ADMIN_CONFIG_ERROR,{
                templateUrl: 'assets/app/modules/_error/envConfigError.html',
                controller: 'errorCtrl',
                controllerAs: 'vm'
            }
        )
        //endregion

        //region login
        .when(ROUTE.LOGIN,{
                templateUrl: 'assets/app/modules/_security/_login/login.html',
                controller: 'loginCtrl',
                controllerAs: 'vm'
            }
        )
        .when(ROUTE.MAIN,{
                templateUrl: 'assets/app/modules/admin/main/main.html',
                controller: 'mainCtrl',
                controllerAs: 'vm',
                secured: {
                }
            }
        )
        //endregion

        //region roles
        .when(ROUTE.ADMIN_ROLES,{
                templateUrl: 'assets/app/modules/admin/account/role/list/role.list.html',
                controller: 'roleListCtrl',
                controllerAs: 'vm',
                secured: {
                    requiresAll: [__env.grant.READ_ROLE]
                }
            }
        )
        .when(ROUTE.ADMIN_ROLE_EDIT,{
                templateUrl: 'assets/app/modules/admin/account/role/edit/role.edit.html',
                controller: 'roleEditCtrl',
                controllerAs: 'vm',
                secured: {
                    requiresAll: [__env.grant.UPDATE_ROLE]
                }
            }
        )
        .when(ROUTE.ADMIN_ROLE_NEW,{
                templateUrl: 'assets/app/modules/admin/account/role/edit/role.edit.html',
                controller: 'roleEditCtrl',
                controllerAs: 'vm',
                secured: {
                    requiresAll: [__env.grant.CREATE_ROLE]
                }
            }
        )
        .when(ROUTE.ADMIN_ROLE_VIEW,{
                templateUrl: 'assets/app/modules/admin/account/role/view/role.view.html',
                controller: 'roleViewCtrl',
                controllerAs: 'vm',
                secured: {
                    requiresAll: [__env.grant.READ_ROLE]
                }
            }
        )
        //endregion

        //region users
        .when(ROUTE.ADMIN_USERS,{
                templateUrl: 'assets/app/modules/admin/account/user/list/user.list.html',
                controller: 'userListCtrl',
                controllerAs: 'vm',
                secured: {
                    requiresAny: [__env.grant.READ_USER, __env.grant.READ_ALL_USER]
                }
            }
        )
        .when(ROUTE.ADMIN_USER_EDIT,{
                templateUrl: 'assets/app/modules/admin/account/user/edit/user.edit.html',
                controller: 'userEditCtrl',
                controllerAs: 'vm',
                secured: {
                    requiresAll: [__env.grant.UPDATE_USER]
                }
            }
        )
        .when(ROUTE.ADMIN_USER_NEW,{
                templateUrl: 'assets/app/modules/admin/account/user/edit/user.edit.html',
                controller: 'userEditCtrl',
                controllerAs: 'vm',
                secured: {
                    requiresAll: [__env.grant.CREATE_USER]
                }
            }
        )
        .when(ROUTE.ADMIN_USER_VIEW,{
                templateUrl: 'assets/app/modules/admin/account/user/view/user.view.html',
                controller: 'userViewCtrl',
                controllerAs: 'vm',
                secured: {
                    requiresAll: [__env.grant.READ_USER]
                }
            }
        )
        .when(ROUTE.USER_PROFILE,{
                templateUrl: 'assets/app/modules/admin/account/user/view/user.view.html',
                controller: 'userViewCtrl',
                controllerAs: 'vm',
                secured: {
                    requiresAll: [__env.grant.READ_PROFILE]
                }
            }
        )
        //endregion

        //region owned-entity
        .when(ROUTE.ADMIN_OWNED_ENTITY,{
                templateUrl: 'assets/app/modules/admin/owned.entity/list/owned.entity.list.html',
                controller: 'ownedEntityListCtrl',
                controllerAs: 'vm',
                secured: {
                    requiresAll: [],
                    requiresAny: [__env.grant.READ_OWNED_ENTITY, __env.grant.READ_ALL_OWNED_ENTITY]
                }
            }
        )
        .when(ROUTE.ADMIN_OWNED_ENTITY_EDIT,{
                templateUrl: 'assets/app/modules/admin/owned.entity/edit/owned.entity.edit.html',
                controller: 'ownedEntityEditCtrl',
                controllerAs: 'vm',
                secured: {
                    requiresAll: [__env.grant.UPDATE_OWNED_ENTITY]
                }
            }
        )
        .when(ROUTE.ADMIN_OWNED_ENTITY_NEW,{
                templateUrl: 'assets/app/modules/admin/owned.entity/edit/owned.entity.edit.html',
                controller: 'ownedEntityEditCtrl',
                controllerAs: 'vm',
                secured: {
                    requiresAll: [__env.grant.CREATE_OWNED_ENTITY]
                }
            }
        )
        .when(ROUTE.ADMIN_OWNED_ENTITY_VIEW,{
                templateUrl: 'assets/app/modules/admin/owned.entity/view/owned.entity.view.html',
                controller: 'ownedEntityViewCtrl',
                controllerAs: 'vm',
                secured: {
                    requiresAll: [__env.grant.READ_OWNED_ENTITY]
                }
            }
        )
        //endregion

        //region permissions
        .when(ROUTE.ADMIN_PERMISSIONS,{
                templateUrl: 'assets/app/modules/admin/account/permission/list/permission.list.html',
                controller: 'permissionCtrl',
                controllerAs: 'vm',
                secured: {
                    requiresAll: [__env.grant.READ_PERMISSION]
                }
            }
        )
        //endregion

        //region config
        .when(ROUTE.ADMIN_CONFIG_PARAMS,{
            templateUrl: 'assets/app/modules/admin/config/params.html',
            controller: 'configParamsCtrl',
            controllerAs: 'vm',
            secured: {
                requiresAll: [__env.grant.MANAGE_CONFIGURATION]
            }
        })
        //endregion

        //default path
        .when(ROUTE.HOME, {
            templateUrl: 'assets/app/modules/home/home.html',
            controller: 'homeCtrl',
            controllerAs: 'vm'
        })

        //otherwise
        .otherwise(
            {
                redirectTo: ROUTE.HOME
            }
        )
}
