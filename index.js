const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
const { write, read } = require('./src/settings.js');
const pathjs = require('path');
const { readFromFile, manualLookup, refreshPlayers } = require('./src/readPlayers.js');
const { paths } = require('./data.json');
const windowStateKeeper = require('electron-window-state');
const { autoUpdater } = require('electron-updater');
try {
    require('electron-reloader')(module);
} catch {}

app.on('ready', () => {

    autoUpdater.checkForUpdatesAndNotify();

    // Load the previous state with fallback to defaults
    const mainWindowState = windowStateKeeper({
        defaultWidth: 1000,
        defaultHeight: 700
    });

    // init the window and set it to load from index.html
    const win = new BrowserWindow({
        show: false,
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: mainWindowState.width,
        height: mainWindowState.height,
        minWidth: 700,
        minHeight: 400,
        frame: false,
        transparent: true,
        resizable: true,
        show: false,
        // backgroundColor: '#00ffffff',
        webPreferences: {
            nodeIntegration: true,
            preload: pathjs.join(__dirname, 'src/preload.js')
        }
    });

    // this will let electron window state manage the window for us
    mainWindowState.manage(win);

    win.loadFile('index.html');

    win.removeMenu();

    win.once('ready-to-show', () => {
        win.show();
    });

    // shortcuts - f5 to refresh page and ctrl+shift+i to show dev tools
    globalShortcut.register('f5', () => {
        win.reload();
    });

    globalShortcut.register('CommandOrControl+Shift+I', () => {
        win.webContents.openDevTools();
    });

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
    if(!read('mode')) {
        write('mode', 'overall');
    }
    if(!read('theme-darkmode')) {
        write('theme-darkmode', false);
    }

    win.webContents.once('dom-ready', () => {
        win.webContents.send('initSettings', {
            path: read('path'),
            client: read('client'),
            autowho: read('autowho'),
            mode: read('mode'),
            darkmode: read('theme-darkmode')
        });
        // start reading from the file immediately
        readFromFile(read('path'), win, read('key'));
    });

    // listen for settings changes

    ipcMain.on('updateSettings', (e, data) => {
        switch(data.type) {
        case 'client':
            clientSelect(data.client);
            win.webContents.send('noticeText', 'Please restart the overlay!');
            break;
        case 'autowho':
            write('autowho', data.autowho);
            break;
        case 'modeSelect':
            write('mode', data.modeSelect.mode);
            refreshPlayers(data.modeSelect.players, win, read('key'));
            break;
        case 'darkmode':
            write('theme-darkmode', data.darkmode);
            break;
        }
    });

    ipcMain.on('manualLookup', (e, data) => {
        manualLookup(data, win, read('key'));
    });

    ipcMain.on('exit', (e, data) => {
        win.close();
    });
});

app.on('window-all-closed', () => {
    app.quit();
});