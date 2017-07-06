/**
 * Created by Asiel on 11/7/2016.
 */
(function(){
    var App = function () {

        var uiInit = function () {

            //FIXES
            /*fixes ng-messages|angular-material|ng-animate issue (see: https://github.com/angular/material/issues/9543) */
            //todo: fix for ng-messages issue
            /*$(document.body).on('change', function () {
                setTimeout(function () {
                    $('.md-resize-wrapper:has(textarea.ng-untouched)')
                        .next('.md-input-messages-animation')
                        .css('height', 0).css('opacity', 0); //ng-message after a wrapper for a textarea
                }, 500);
            });*/
        };

        return {
            init: function () {
                uiInit();
            }
        };

    }();

    //init app when page load
    $(document).ready(App.init);

})();