#!/bin/bash
MAXSIZE=$((8 * 1024 * 1024))
SIZE=$(ls -l "${1}" | cut -d' ' -f5)
COMP=$((SIZE - MAXSIZE))

if [ $COMP -gt 0 ]; then
	echo "File is too large by ${COMP} bytes"
	exit 1
fi
