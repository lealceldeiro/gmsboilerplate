/**
 * Created by Asiel on 11/6/2016.
 */

'use strict';

angular
    .module('gmsBoilerplate')
    .controller('loginCtrl', loginCtrl);

/*@ngInject*/
function loginCtrl(indexSrv, sessionSrv, navigationSrv, systemSrv, loginSrv, ROUTE, blockSrv, userSrv, $rootScope,
                   notificationSrv, translatorSrv) {

    var vm = this;
    const keyP = 'LOGIN__';

    vm.wizard = {

        emailOrUsername: null,
        password: null,

        init: fnInit,
        login: fnLogin,

        checkKeyDown: fnCheckKeyDown
    };

    vm.wizard.init();

    return vm.wizard;

    //fn
    function fnInit() {
        translatorSrv.setText('button.login', indexSrv, 'siteTitle');
    }

    function fnLogin(form) {
        if (form) {
            form.$setSubmitted();
            if (form.$valid) {
                blockSrv.block();

                //do login
                loginSrv.login(vm.wizard.emailOrUsername, vm.wizard.password).then(
                    function (data) {
                        var e = systemSrv.evalAuth(data, '_LOGIN_', false, false);
                        if (e) {
                            var key = "fnLogin-getByUsername" + keyP;

                            //get user data
                            userSrv.getByUsername(systemSrv.getAuthUser()).then(
                                function (data) {
                                    var e2 = systemSrv.eval(data, key);
                                    var user = systemSrv.getItem(key);
                                    if (e2 && user) {
                                        var key2 = "fnLogin-getLoginEntity" + keyP;

                                        //get last entity
                                        loginSrv.getLoginEntity(user.id).then(
                                            function (data) {
                                                var e3 = systemSrv.eval(data, key2, false, true);
                                                if (e3) {
                                                    var key3 = "fnLogin-entitiesByUser" + keyP;
                                                    userSrv.entitiesByUser(systemSrv.getItem(key)['id']).then(function (data) {

                                                        systemSrv.eval(data, key3, false, true);

                                                        var cu = sessionSrv.currentUser();
                                                        cu.entities = systemSrv.getItems(key3);
                                                        sessionSrv.setCurrentUser(cu);

                                                        //notify of login action
                                                        $rootScope.$broadcast('TRIGGER_ACTION_AUTH'); //$rootScope instead of $scope so the change is propagated to all scopes

                                                        navigationSrv.goTo(ROUTE.MAIN);

                                                        blockSrv.unBlock();
                                                    });

                                                    sessionSrv.setCurrentOwnedEntity(systemSrv.getItem(key2));
                                                }
                                                else {
                                                    blockSrv.unBlock();
                                                }
                                            }
                                        );
                                        sessionSrv.setCurrentUser(user);
                                    }
                                    else {
                                        sessionSrv.logOut();
                                        blockSrv.unBlock();
                                        notificationSrv.showNotification(notificationSrv.type.ERROR, notificationSrv.utilText.unauthorized);
                                    }
                                }
                            );

                            sessionSrv.setPermissions(systemSrv.gtAuthPermissions());
                            sessionSrv.setSecurityToken(systemSrv.getAuthToken());
                            sessionSrv.setSecurityRefreshToken(systemSrv.getAuthRefreshToken());
                        }
                        else {
                            blockSrv.unBlock();
                        }
                    }
                );
            }
        }
    }

    function fnCheckKeyDown(event, form) {
        if (event.which === 13) {
            fnLogin(form);
        }
    }
}