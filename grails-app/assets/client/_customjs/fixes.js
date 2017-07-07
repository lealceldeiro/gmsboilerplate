/**
 * Created by asiel on 7/07/17.
 */

/*fixes ng-messages|angular-material|ng-animate issue (see: https://github.com/angular/material/issues/9543) */
function fix_HideNgMessageOnFormReset() {
    var messages = $('.md-resize-wrapper:has(textarea.ng-untouched)').nextAll('.md-input-messages-animation');

    messages.css({'height': '0', 'opacity': '0'}); //ng-message after a wrapper for a textarea
    //re-activate shown message
    $('.md-resize-wrapper').children('textarea').focusout(function () {
        messages.css({'height': '', 'opacity': ''});
    })
}