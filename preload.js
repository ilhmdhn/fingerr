const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    sendFinger: (imageBase64) => ipcRenderer.send('fingerprint-image', imageBase64),
    sendConnectionState: (state) => ipcRenderer.send('fingerprint-connection-state', state),
    sendQualityState: (quality) => ipcRenderer.send('fingerprint-capture-quality', quality),
});