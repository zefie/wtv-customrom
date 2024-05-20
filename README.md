## WebTV Build 7253 (2.5.5 Internal Non-debug) DERBY

For `US-LC2-disk-0MB-8MB-softmodem-CPU5230` only.

It should boot on a non-Derby LC2 for offline use, but the modem will be unavailable on non-Derby boxes.

Do not attempt to flash to a BPS or LC2.5.

This ROM is *patched* to automatically boot into our custom HTML and can be used offline.
It is also patched to bypass TV Home (still accessible with view button), and to bypass the "Did you move?" dialog.
Finally, it is patched to be able to use Higher Quality Uncompressed1.1 Beatnik Patches without additional download.

This patch hooks into the Power Off Code **92753**, which is used for a SSID Info Page.
The page still exists at file://rom/HTMLs/SSIDInfo.html

**[rommy](https://github.com/wtvemac/rommy)** is required to build the ROM.
