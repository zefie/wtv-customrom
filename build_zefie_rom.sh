#!/bin/bash
cd "$(realpath "$(dirname "${0}")")" || exit 1

ZWNIBUILD=7253
if [ -z "${ZVERSION}" ]; then
	ZVERSION="git-${USER}-v1"
fi
ZROMTYPE="US-LC2-disk-0MB-8MB-softmodem-CPU5230"

ZSRC="src"
ZWORK="workdir"
ZROM="htv-${ZVERSION}.o"
ZDEST="parts"

ZINFOJS="${ZWORK}/level0-romfs/ROM/JS/BuildInfo.js"
ZDATE=$(date +"%Y-%m-%d %H:%M:%S %Z")



# Copy SRC to WORK
if [ -d "${ZWORK}" ]; then
	rm -r "${ZWORK}"
fi

cp -R "${ZSRC}" "${ZWORK}"

# Patch Vars in Dynamic JS
sed -i "s|!TEMPLATE_DATE!|${ZDATE}|" "${ZINFOJS}"
sed -i "s|!TEMPLATE_VERS!|${ZVERSION}|" "${ZINFOJS}"
sed -i "s|!TEMPLATE_ROM!|${ZROMTYPE}|" "${ZINFOJS}"

if [ "${1}" == "viewer" ] || [ "${1}" == "vwr" ]; then
	# Build Viewer Test
	cp -r "${ZWORK}/level0-autodisk/Browser/DiskFlash/"* "${ZWORK}/level0-romfs/ROM/"
	rommy "${ZWORK}" /mnt/c/bin/webtv/WebTVIntel--2.5-HE/Flash69.vwr
else
	# Build ROM
	rommy --fixcs "${ZWORK}" "${ZROM}"
	./checksize.sh "${ZROM}" || exit 1
fi

# Convert to Parts
if [ "${1}" == "parts" ]; then
	if [ -d "${ZDEST}" ]; then
		rm -r "${ZDEST}"
	fi
	rommy --rom-blocks --rom-block-prefix "${ZROMTYPE}-" --rom-block-message "HackTV ${ZWNIBUILD}-${ZVERSION} Pt {index}" "${ZROM}" "${ZDEST}"
fi
