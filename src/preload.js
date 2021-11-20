const { contextBridge, ipcRenderer, ipcMain } = require('electron');

contextBridge.exposeInMainWorld('settings', {
    initSettings: (event, func) => ipcRenderer.once('initSettings', (event, data) => func(data)),
    noticeText: (event, func) => ipcRenderer.on('noticeText', (event, data) => func(data)),
    updateSettings: (data) => ipcRenderer.send('updateSettings', data),
});

contextBridge.exposeInMainWorld('players', {
    display: (event, func) => ipcRenderer.on('showPlayers', (event, data) => func(data)),
    add: (event, func) => ipcRenderer.on('addPlayer', (event, data) => func(data)),
    update: (event, func) => ipcRenderer.on('updatePlayer', (event, data) => func(data)),
    delete: (event, func) => ipcRenderer.on('deletePlayer', (event, data) => func(data))
});

contextBridge.exposeInMainWorld('misc', {
    manualLookup: (data) => ipcRenderer.send('manualLookup', data),
    exit: () => ipcRenderer.send('exit'),
});