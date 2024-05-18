## WebTV Build 1235 (v1.4.2.1 Internal Non-debug)

This build supports **MOD/XM/S3M** and **Karaoke**. These features were *removed* in future builds of the WebTV Software.

This ROM is *patched* to automatically boot into our custom HTML and can be used offline. The patch hooks into Power Off Code **77437**, therefore replacing **client:gotoadvancedsetup**

For an unknown reason, this also breaks client:activatenetwork in this build, but workarounds have been implemented into the HackTV system to overcome this, and it does not effect the usage of online features.

**[rommy](https://github.com/wtvemac/rommy)** is required to build the ROM.
