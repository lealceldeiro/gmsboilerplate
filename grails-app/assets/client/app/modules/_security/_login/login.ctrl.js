/**
 * Created by Asiel on 11/6/2016.
 */

(function() {

    'use strict';

    angular
        .module('gmsBoilerplate')
        .controller('loginCtrl', loginCtrl);

    /*@ngInject*/
    function loginCtrl(indexSrv, sessionSrv, navigationSrv, systemSrv, loginSrv, ROUTE, blockSrv, userSrv, $rootScope,
                       notificationSrv, configSrv, translatorSrv, $timeout) {

        var vm = this;
        var keyP = 'LOGIN__';

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
            if (angular.isDefined(configSrv.config.isUserRegistrationAllowed)) {
                vm.wizard.isUserRegistrationAllowed = configSrv.config.isUserRegistrationAllowed;
            } else { _loadConfig(); }
            indexSrv.setTitle('button.login');
        }

        function fnLogin(form) {
            if (form) {
                form.$setSubmitted();
                if (form.$valid) {
                    vm.wizard.loginFailedShake = false;
                    blockSrv.block();

                    //do login
                    notificationSrv.mutedNotifications = true;
                    notificationSrv.doNotDoUNAUTHORIZED_BACKWARD = true;
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

                                _visualizeIncorrectLogin(3500);

                                var aux = {};
                                translatorSrv.setText('LOGIN.username_or_password_incorrect', aux, 'text').then(
                                    function () {
                                        notificationSrv.showNotification(notificationSrv.type, aux['text'])
                                    }
                                );
                                blockSrv.unBlock();
                            }
                            notificationSrv.mutedNotifications = false;
                            notificationSrv.doNotDoUNAUTHORIZED_BACKWARD = false;
                        }
                    );
                }
            }
        }

        function _visualizeIncorrectLogin(init) {
            if (init) {
                vm.wizard.loginFailedForgotPass = false;
                vm.wizard.loginFailedShake = true;
                vm.wizard.loginFailedColor = true;
                for(var i = init; i < init + 1300; i+=500) {
                    (function (val) {
                        $timeout(function () { vm.wizard.loginFailedForgotPass = !vm.wizard.loginFailedForgotPass; }, val);
                    })(i);
                }
                $timeout(function () { vm.wizard.loginFailedForgotPass = false; }, i);
            }
        }

        function fnCheckKeyDown(event, form) {
            if (event.which === 13) {
                fnLogin(form);
            }
        }

        function _loadConfig() {
            configSrv.loadConfig().then(
                function (config) {
                    vm.wizard.isUserRegistrationAllowed = configSrv.config.isUserRegistrationAllowed;
                }
            );
        }
    }

}());