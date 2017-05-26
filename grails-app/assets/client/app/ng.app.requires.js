/**
 * Created by asiel on 20/05/17.
 */

// --ngApp--
//= require ../client/app/app.module
//= require ../client/app/app.constants
//= require ../client/app/app.config.lan
//= require ../client/app/app.routing
//= require ../client/app/app.interceptors


// --modules--
//= require ../client/app/modules/_error/error.srv
//= require ../client/app/modules/_error/error.ctrl

//= require ../client/app/modules/_security/session.srv
//= require ../client/app/modules/_security/session.ctrl

//= require ../client/app/modules/index.srv
//= require ../client/app/modules/index.ctrl

//= require ../client/app/modules/_security/_login/login.srv
//= require ../client/app/modules/_security/_login/login.ctrl

//= require ../client/app/modules/_security/register/register.srv
//= require ../client/app/modules/_security/register/register.ctrl

//= require ../client/app/modules/admin/main/main.srv
//= require ../client/app/modules/admin/main/main.ctrl

//= require ../client/app/modules/admin/account/role/role.srv
//= require ../client/app/modules/admin/account/role/list/role.list.ctrl
//= require ../client/app/modules/admin/account/role/edit/role.edit.ctrl
//= require ../client/app/modules/admin/account/role/view/role.view.ctrl

//= require ../client/app/modules/admin/account/user/user.srv
//= require ../client/app/modules/admin/account/user/list/user.list.ctrl
//= require ../client/app/modules/admin/account/user/edit/user.edit.ctrl
//= require ../client/app/modules/admin/account/user/view/user.view.ctrl

//= require ../client/app/modules/admin/account/permission/permission.srv
//= require ../client/app/modules/admin/account/permission/list/permission.list.ctrl

//= require ../client/app/modules/admin/owned.entity/owned.entity.srv
//= require ../client/app/modules/admin/owned.entity/list/owned.entity.list.ctrl
//= require ../client/app/modules/admin/owned.entity/edit/owned.entity.edit.ctrl
//= require ../client/app/modules/admin/owned.entity/view/owned.entity.view.ctrl

//= require ../client/app/modules/admin/config/config.srv
//= require ../client/app/modules/admin/config/params.ctrl

//= require ../client/app/modules/home/home.ctrl


// --components--
//= require ../client/app/modules/_components/screenBlocker/blockS.srv
//= require ../client/app/modules/_components/screenBlocker/blockS.ctrl
//= require ../client/app/modules/_components/screenLoader/screen.loader.drtv

//= require ../client/app/modules/_components/fabSpeedDial/fabSpeedDial.ctrl

//= require ../client/app/modules/_components/chips/chip.ctrl

//= require ../client/app/modules/_components/dialog/dialog.srv
//= require ../client/app/modules/_components/dialog/dialog.ctrl

//= require ../client/app/modules/_components/toolbar/toolBar.srv
//= require ../client/app/modules/_components/toolbar/toolBar.ctrl

//= require ../client/app/modules/_components/toast/toast.srv
//= require ../client/app/modules/_components/toast/toast.ctrl

//= require ../client/app/modules/_components/navigation/navigation.srv
//= require ../client/app/modules/_components/navigation/pagination.srv
//= require ../client/app/modules/_components/navigation/pagination.ctrl


// --common--
//= require ../client/app/modules/_common/js/notification/notification.srv

//= require ../client/app/modules/_common/js/system/system.srv

//= require ../client/app/modules/_common/js/filter/humanReadable.filter
//= require ../client/app/modules/_common/js/filter/trimmer.filter
//= require ../client/app/modules/_common/js/filter/caser.filter

//= require ../client/app/modules/_common/js/util/string.srv
//= require ../client/app/modules/_common/js/util/value.srv
//= require ../client/app/modules/_common/js/util/base.srv

//= require ../client/app/modules/_common/js/collection/search.srv
//= require ../client/app/modules/_common/js/collection/data.srv

//= require ../client/app/modules/_common/js/translation/translator.srv

//= require_self