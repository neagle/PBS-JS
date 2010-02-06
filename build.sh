#!/bin/bash

WORKDIR=`dirname $0`

SRCFILES="PBS.js Bridge.js"

NAME="pbsjs"
INPUTDIRECTORY="$WORKDIR/src"

DEBUG="$WORKDIR/$NAME-debug.js"
MINIFIED="$WORKDIR/$NAME-min.js"

# Remove outputfile if it already exists
rm -f $DEBUG

# Dump all source into the debug output
for srcfile in $SRCFILES
do
    cat $INPUTDIRECTORY/$srcfile >> $DEBUG
done

# Create minified version
java -jar $WORKDIR/lib/yuicompressor-2.4.2.jar $DEBUG -o $MINIFIED
