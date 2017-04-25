#!/bin/sh
echo "Executing command..."
a=0
file="path-to-war"

until (( $a <= 0 ))
do
   eval grails war
if [ -f "$file" ]
then
	echo "Success!"
	a=expr $a + 1
else
	echo "Retrying"
fi

done
