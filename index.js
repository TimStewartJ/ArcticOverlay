const { app, BrowserWindow, ipcMain } = require('electron');
const { write, read } = require('./src/settings.js');
const pathjs = require('path');
const { readFromFile } = require('./src/readPlayers.js');

app.on('ready', () => {
    // init the window and set it to load from index.html
    const win = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            preload: pathjs.join(__dirname, 'src/preload.js')
        }
    });

    win.loadFile('index.html');

    win.removeMenu();

    // manually setting the path for log reading to lunar client's for now...
    let path = app.getPath("home").replace(/\\/g, "\/") + "/.lunarclient/offline/1.8/logs/latest.log";
    write("path", path);

    // start reading from the file immediately
    readFromFile(read("path"), win, read("key"));

    // this is triggered when the read from file button is pressed on front end
    ipcMain.handle('reading:start', () => {
        //readFromFile(read("path"), win);
    });

    ipcMain.on('clientSelect', (e, data) => {
        
    });
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
});