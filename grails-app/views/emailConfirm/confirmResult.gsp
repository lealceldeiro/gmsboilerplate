<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
    <meta name="layout" content="notLogged1">
    <title>${header}</title>
</head>

<body>
<h2 class="mt-3 mb-3">${header}</h2>
<hr>
<div class="mb-1">
    ${body}
</div>

<br />
<g:each in="${actions}" var="btn" >
    <a type="button" class="btn btn-success" href="${btn.link}">${btn.text}</a>
</g:each>
</body>
</html>