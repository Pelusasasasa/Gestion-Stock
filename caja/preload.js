const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    saveFile: (content, defaultFileName) => ipcRenderer.invoke('save-file-dialog', content, defaultFileName)
});