/**
 * Created by Asiel on 11/6/2016.
 */

'use strict';

angular
    .module('gmsBoilerplate')
    .service('toolBarSrv', toolBarSrv);

/*@ngInject*/
function toolBarSrv($rootScope, BROADCAST) {

    var self = this;

    self.service = {
        buttonsArr: {},
        actions: {},
        toolbar: fnToolbar,
        doAction: fnDo
    };

    return self.service;

    //fn
    /**
     * Shows or hide a toolbar
     *
     * @param config: options for showing/hiding the toolbar. Available options are
     *         'hide' : hides the toolbar
     *         '<config>': an array of configuration objects i.e.:
     *         [
     *              {
             *                  aria: "Some button aria",
             *                  image: "social:ic_myIco24px",
             *                  action: function(){console.log('do something');}
             *                  showCondition:
             *              },
     *              ...
     *              {}
     *         ]
     */
    function fnToolbar(config) {
        if(angular.isDefined(config) && angular.isArray(config)) {
            self.service.buttonsArr = config;
            self.service.actions = [];
            angular.forEach(config, function (obj) {
                if (angular.isDefined(obj.action) && angular.isFunction(obj.action)) {
                    self.service.actions.push(obj.action);
                }
            });
            $rootScope.$broadcast(BROADCAST.component.toolbar.OPEN)
        }
        if (config === 'hide') {
            $rootScope.$broadcast(BROADCAST.component.toolbar.CLOSE)
        }
    }

    function fnDo(idx) {
        if (angular.isDefined(self.service.actions[idx]) && angular.isFunction(self.service.actions[idx])) {
            return self.service.actions[idx]();
        }
    }
}