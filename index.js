const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
const { write, read } = require('./src/settings.js');
const pathjs = require('path');
const { readFromFile } = require('./src/readPlayers.js');
const { paths } = require('./data.json');
try {
    require('electron-reloader')(module);
} catch {}

app.on('ready', () => {
    // init the window and set it to load from index.html
    const win = new BrowserWindow({
        width: 1000,
        height: 800,
        minWidth: 500,
        minHeight: 100,
        webPreferences: {
            nodeIntegration: true,
            preload: pathjs.join(__dirname, 'src/preload.js')
        }
    });

    win.loadFile('index.html');

    win.removeMenu();

    globalShortcut.register('f5', () => {
        win.reload();
    });

    win.webContents.openDevTools();

    const clientSelect = (client) => {
        write('path', `${app.getPath('home').replace(/\\/g, '\/') + paths[`${client}-${process.platform}`]  }/logs/latest.log`);
        write('client', client);
    };

    if(!read('client')) {
        clientSelect('lunar');
    }
    if(!read('autowho')) {
        write('autowho', true);
    }

    win.webContents.once('dom-ready', () => {
        win.webContents.send('initSettings', {
            path: read('path'),
            client: read('client'),
            autowho: read('autowho')
        });
        // start reading from the file immediately
        readFromFile(read('path'), win, read('key'));
    });

    // listen for settings changes

    ipcMain.on('clientSelect', (e, data) => {
        clientSelect(data);
    });

    ipcMain.on('autowhoToggle', (e, data) => {
        write('autowho', data);
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});