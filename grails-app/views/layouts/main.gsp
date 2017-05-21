<!DOCTYPE html>
<!--[if lt IE 7 ]> <html lang="en" class="ie6" data-ng-app="gmsBoilerplate" data-ng-controller="indexCtrl as idxCtrl"> <![endif]-->
<!--[if IE 7 ]>    <html lang="en" class="ie7" data-ng-app="gmsBoilerplate" data-ng-controller="indexCtrl as idxCtrl"> <![endif]-->
<!--[if IE 8 ]>    <html lang="en" class="ie8" data-ng-app="gmsBoilerplate" data-ng-controller="indexCtrl as idxCtrl"> <![endif]-->
<!--[if IE 9 ]>    <html lang="en" class="ie9" data-ng-app="gmsBoilerplate" data-ng-controller="indexCtrl as idxCtrl"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--> <html lang="en" data-ng-app="gmsBoilerplate" data-ng-controller="indexCtrl as idxCtrl"><!--<![endif]-->
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    %{--todo: set href="/" for production env--}%
    <base href="/gmsboilerplate/" id="appBaseUrl">

    <title data-ng-bind="idxCtrl.siteTitle() ? 'GMS - Boilerplate | ' + idxCtrl.siteTitle()
     : 'GMS - Boilerplate'"></title>

    <asset:stylesheet src="app.requires.css"/>
</head>
<body data-ng-model-options="{allowInvalid: true}">
<g:layoutBody/>
%{--load scripts--}%
<asset:javascript src="app.requires.js"/>
</body>
</html>
