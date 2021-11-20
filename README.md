# Arctic Overlay

A fast overlay for Hypixel

Currently is able to grab stars, winstreak, FKDR, and WLR for Hypixel Bedwars.

## Installing

The executables will not be signed. This means a warning will pop up regarding the trustworthiness of the application. This is because it costs a lot of money to make that warning go away. The source code is all in this repository, and the executable can simply be manually built if it's trustworthiness is questioned.

## Development

The package `active-win` is used to see which window is active. One of its dependencies does not work nicely with Electron.js. Run the executable for `electron-rebuild` in `node_modules/.bin` for the appropriate platform if necessary. Also, builds are only known to work with Node.js version `16.13.0`.

## Building

Asar compressing has to be off for now so that node-key-sender can find its jar file.