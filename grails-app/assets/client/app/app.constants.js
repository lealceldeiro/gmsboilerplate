/**
 * Created by Asiel on 11/6/2016.
 */

(function() {

    'use strict';

    angular
        .module('gmsBoilerplate')
        .constant(
            'ROUTE', {
                ADMIN_CONFIG_ERROR: '/configuration-error',
                LOGIN: '/signin',
                REGISTER: '/signup',
                MAIN: '/main',
                CHANGE_ENTITY: '/owned-entities/select',

                ADMIN_ROLES: '/admin/roles',
                ADMIN_ROLE_EDIT: '/admin/roles/:id/edit', ADMIN_ROLE_EDIT_PL: ':id',
                ADMIN_ROLE_NEW: '/admin/roles/new',
                ADMIN_ROLE_VIEW: '/admin/roles/:id/view', ADMIN_ROLE_VIEW_PL: ':id',

                ADMIN_USERS: '/admin/users',
                ADMIN_USER_EDIT: '/admin/users/:id/edit', ADMIN_USER_EDIT_PL: ':id',
                ADMIN_USER_NEW: '/admin/users/new',
                ADMIN_USER_VIEW: '/admin/users/:id/view', ADMIN_USER_VIEW_PL: ':id',
                USER_PROFILE: '/profile',

                ADMIN_OWNED_ENTITY: '/admin/owned-entities',
                ADMIN_OWNED_ENTITY_EDIT: '/admin/owned-entities/:id/edit', ADMIN_OWNED_ENTITY_EDIT_PL: ':id',
                ADMIN_OWNED_ENTITY_NEW: '/admin/owned-entities/new',
                ADMIN_OWNED_ENTITY_VIEW: '/admin/owned-entities/:id/view', ADMIN_OWNED_ENTITY_VIEW_PL: ':id',

                ADMIN_PERMISSIONS: '/admin/permissions',

                ADMIN_CONFIG_PARAMS: '/admin/config/params',

                HOME: '/home',
                EMAIL_VERIFICATION: '/email/verification/:token', EMAIL_VERIFICATION_PL: ':token',
                EMAIL_REQUEST: '/email/request'
            }
        )
        .constant(
            'BROADCAST',
            {
                auth: {
                    REFRESH_TOKEN: 'REFRESH_TOKEN',
                    UNAUTHORIZED_BACKWARD: 'UNAUTHORIZED_BACKWARD'

                },
                navigation: {
                    GO_BACK: 'NAVIGATION_GO_BACK'
                },
                modal: {
                    SHOW_DIALOG_TAB: 'SHOW_DIALOG_TAB',
                    SHOW_DIALOG: 'SHOW_DIALOG'
                },
                pagination: {
                    RESET_PAGINATION: "RESET_PAGINATION"
                },
                component:{
                    toolbar: {
                        OPEN: 'toolbar.OPEN',
                        CLOSE: 'toolbar.CLOSE'
                    },
                    toast:{
                        OPEN: 'toast.OPEN',
                        CLOSE: 'toast.CLOSE'
                    }
                },
                sidenav: {
                    'close': 'SIDENAV.close'
                },
                navBav: {
                    'updateLeftButtons': 'navBar.updateLeftButtons'
                },
                language: {"CHANGED": "CHANGED"}
            }
        );

}());