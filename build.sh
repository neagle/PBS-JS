#!/bin/bash

WORKDIR=`dirname $0`

SRCFILES="PBS.js Bridge.js Tabs.js"
LIBFILES="jquery.cookie.js"

NAME="pbsjs"

DEBUG="$WORKDIR/$NAME-debug.js"
MINIFIED="$WORKDIR/$NAME-min.js"

# Remove outputfile if it already exists
rm -f $DEBUG

# Grab all non-PBS plugins for build
for libfile in $LIBFILES
do
    cat $WORKDIR/lib/$libfile >> $DEBUG
done 

# Dump all source into the debug output
for srcfile in $SRCFILES
do
    cat $WORKDIR/src/$srcfile >> $DEBUG
done

# Create minified version
java -jar $WORKDIR/lib/yuicompressor-2.4.2.jar $DEBUG -o $MINIFIED
