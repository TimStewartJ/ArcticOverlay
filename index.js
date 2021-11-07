const electron = require('electron');
const { app, BrowserWindow } = require('electron')

app.whenReady().then(function () {
    const win = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            nodeIntegration: true
        }
    })

    win.loadFile('index.html')
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
});