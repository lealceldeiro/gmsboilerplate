<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
    <title></title>
</head>

<body>
<div style="text-align:center;">
    <span>
        ${bodyText}
    </span>
    <br />
    <a
        style="
    position: relative;
    display: inline-block;
    color: rgb(255, 255, 255);
    background-color: rgb(76,175,80);
    box-shadow: 0 2px 5px 0 rgba(0,0,0,.26);
    min-height: 36px;
    min-width: 88px;
    line-height: 36px;
    vertical-align: middle;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    text-align: center;
    border-radius: 2px;
    box-sizing: border-box;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    outline: none;
    border: 0;
    padding: 0 6px;
    margin: 6px 8px;
    white-space: nowrap;
    text-transform: uppercase;
    font-weight: 500;
    font-size: 14px;
    font-style: inherit;
    font-variant: inherit;
    font-family: inherit;
    text-decoration: none;
    overflow: hidden;
    transition: box-shadow .4s cubic-bezier(.25,.8,.25,1),background-color .4s cubic-bezier(.25,.8,.25,1);
    letter-spacing: .06em;"
        target="_blank"
        href="${confirmUrl}"
    >
        ${buttonText}
    </a>
</div>
</body>
</html>