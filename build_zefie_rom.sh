#!/bin/bash
cd "$(realpath "$(dirname "${0}")")" || exit 1

ZWNIBUILD=1235
if [ -z "${ZVERSION}" ]; then
	ZVERSION="git-${USER}-v1"
fi
ZROMTYPE="bf0app"

ZSRC="src"
ZWORK="workdir"
ZROM="htv-${ZVERSION}.o"
ZDEST="parts"

ZINFOJS="${ZWORK}/tmp-romfs/ROM/JS/BuildInfo.js"
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

# Build ROM
rommy --fixcs "${ZWORK}" "${ZROM}"
# --disable-lzss-compression

# Convert to Parts
if [ "${1}" == "parts" ]; then
	if [ -d "${ZDEST}" ]; then
		rm -r "${ZDEST}"
	fi
	rommy --rom-blocks --rom-block-prefix "${ZROMTYPE}-" --rom-block-message "HTV ${ZWNIBUILD}-${ZVERSION} Pt {index}" "${ZROM}" "${ZDEST}"
fi
