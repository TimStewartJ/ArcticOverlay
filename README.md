# Arctic Overlay

A fast overlay for Hypixel.

Currently is able to grab stats for Hypixel Bedwars.

Available for Windows and Mac.

**DOWNLOAD: https://github.com/TimStewartJ/ArcticOverlay/releases**

## Installing

The executables will not be signed. This means a warning will pop up regarding the trustworthiness of the application. This is because it costs a lot of money to make that warning go away. The source code is all in this repository, and the executable can simply be manually built if it's trustworthiness is questioned.

### Mac OS Notes

The Mac version of the app will ask for permission in accessibility settings. This is for the autowho functionality. The permissions are necessary to detect if the current focused app is Minecraft. If it is not Minecraft, then autowho will not be triggered.

## Updating

The Windows release will detect if theres an update and update automatically on launch.

Unfortunately, auto update is not available for Mac. Mac users will have to reinstall the overlay every time they wish to update.

## Development

The package `active-win` is used to see which window is active. One of its dependencies does not work nicely with Electron.js. Run the executable for `electron-rebuild` in `node_modules/.bin` for the appropriate platform if necessary. Also, builds are only known to work with Node.js version `16.13.0`.

## Building

Asar compressing has to be off for now so that node-key-sender can find its jar file.