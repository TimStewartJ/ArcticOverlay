const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('reading', {
    start: () => ipcRenderer.invoke('reading:start')
});

contextBridge.exposeInMainWorld('players', {
    display: (event, func) => ipcRenderer.on('showplayers', (event, data) => func(data))
});