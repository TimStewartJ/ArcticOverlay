const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('reading', {
    start: () => ipcRenderer.invoke('reading:start')
});

contextBridge.exposeInMainWorld('settings', {
    clientSelect: (data) => ipcRenderer.send('clientSelect', data),
});

contextBridge.exposeInMainWorld('players', {
    display: (event, func) => ipcRenderer.on('showPlayers', (event, data) => func(data)),
    add: (event, func) => ipcRenderer.on('addPlayer', (event, data) => func(data)),
    update: (event, func) => ipcRenderer.on('updatePlayer', (event, data) => func(data)),
    delete: (event, func) => ipcRenderer.on('deletePlayer', (event, data) => func(data))
});