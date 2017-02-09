@echo off

:loop
    echo Executing command...

   	call grails war

	if exist "path-to-war" (
	    echo Success!
	) else (
	    echo Failed!
	    echo Retrying!
	    goto loop
	)

echo Done!