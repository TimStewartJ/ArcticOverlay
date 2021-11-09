const { contextBridge, ipcRenderer, ipcMain } = require('electron')

contextBridge.exposeInMainWorld('settings', {
    initSettings: (event, func) => ipcRenderer.once('initSettings', (event, data) => func(data)),
    invalidKey: (event, func) => ipcRenderer.on('invalidKey', (event, data) => func()),
    validKey: (event, func) => ipcRenderer.on('validKey', (event, data) => func()),
    autowhoToggle: (data) => ipcRenderer.send('autowhoToggle', data),
    clientSelect: (data) => ipcRenderer.send('clientSelect', data),
});

contextBridge.exposeInMainWorld('players', {
    display: (event, func) => ipcRenderer.on('showPlayers', (event, data) => func(data)),
    add: (event, func) => ipcRenderer.on('addPlayer', (event, data) => func(data)),
    update: (event, func) => ipcRenderer.on('updatePlayer', (event, data) => func(data)),
    delete: (event, func) => ipcRenderer.on('deletePlayer', (event, data) => func(data))
});