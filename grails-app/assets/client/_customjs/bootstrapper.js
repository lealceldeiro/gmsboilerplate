/**
 * Created by Asiel on 11/7/2016.
 */
(function(){
    var App = function () {

        var uiInit = function () {};

        return {
            init: function () {
                uiInit();
            }
        };

    }();

    //init app when page load
    $(document).ready(App.init);

})();