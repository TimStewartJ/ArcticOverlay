const { app, BrowserWindow, ipcMain } = require('electron');
const { write, read } = require('./src/settings.js');
const pathjs = require('path');
const { readFromFile } = require('./src/readPlayers.js');

app.on('ready', () => {
    const win = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            preload: pathjs.join(__dirname, 'src/preload.js')
        }
    });

    win.loadFile('index.html');

    let path = app.getPath("home").replace(/\\/g, "\/") + "/.lunarclient/offline/1.8/logs/latest.log";
    write("path", path);

    readFromFile(read("path"), win);

    ipcMain.handle('reading:start', () => {
        //readFromFile(read("path"), win);
    });
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
});