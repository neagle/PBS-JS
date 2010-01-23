#!/bin/bash

SRCFILES="PBS.js Bridge.js"

NAME="pbsjs"
INPUTDIRECTORY="src"

DEBUG="$NAME-debug.js"
MINIFIED="$NAME-min.js"

# Remove outputfile if it already exists
rm -f $DEBUG

# Dump all source into the debug output
for srcfile in $SRCFILES
do
    cat $INPUTDIRECTORY/$srcfile >> $DEBUG
done

# Create minified version
java -jar lib/yuicompressor-2.4.2.jar $DEBUG -o $MINIFIED
