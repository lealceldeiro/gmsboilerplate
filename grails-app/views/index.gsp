<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="main"/>
</head>
<body>

<div>
    <div
            data-ng-include="idxCtrl.logged ? 'assets/app/modules/_common/html/templates/logged/template1.html' :
                 'assets/app/modules/_common/html/templates/notLogged/template1.html'"
    >
    </div>
    <!--dialogs-->
    <span data-ng-controller="dialogCtrl as dialogCtrl"></span>

    <!--block screen-->
    <div data-ng-controller="blockCtrl as blockCtrl">
        <div data-ng-show="blockCtrl.blocked" class="gms-screen-loader" data-screen-type="0">
        </div>
    </div>

    <!--messages-->
    <div data-ng-controller="toastCtrl as tmc"></div>

    <!--instantiate login ctr so login service get called and this way listen for 401 and re-authenticate-->
    <span data-ng-controller="loginCtrl as loginCtrl"></span>
</div>

</body>
</html>
