## WebTV Build 16115 (2.7 Internal Non-debug) LC2

For `US-LC2-disk-0MB-8MB` only.

Do not attempt to flash to a BPS or LC2.5.

This ROM is *patched* to automatically boot into our custom HTML and can be used offline.
It is also patched to bypass TV Home (still accessible with view button), and to bypass the "Did you move?" dialog.

This patch hooks into the Power Off Code **92753**, which is used for a SSID Info Page.
The page still exists at file://rom/HTMLs/SSIDInfo.html

**[rommy](https://github.com/wtvemac/rommy)** is required to build the ROM.
