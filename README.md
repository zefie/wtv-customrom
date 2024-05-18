## WebTV Build 16467 (v2.9 Internal Non-debug)

This build is quite buggy and never reached production, but it is useful to test modern WebTV Plus features such as `position: absolute` CSS support. It does not support many features and runs out of RAM when surfing fairly quickly. This build is not recommended unless you are testing.

This ROM is *patched* to automatically boot into our custom HTML and can be used offline. The patch hooks into Power Off Code **77437**, therefore replacing **client:gotoadvancedsetup**, which has been renamed to **client:gotohacktv**

**[rommy](https://github.com/wtvemac/rommy)** is required to build the ROM.
