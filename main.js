const { app, Tray, Menu, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { verify } = require('./src/tools/axios');
const udp = require('./src/tools/udp');
const outlet = require('./src/data/outlet');
const outlets = require('./src/data/outlets');
let mainWin, scanWin, tray;
let isLoading = false;
const db = require('./src/tools/db');
const sql = require('mssql');

function createMainWindow() {
    mainWin = new BrowserWindow({
        resizable: false,
        minWidth: 1020,
        minHeight: 690,
        show: true,
        icon: path.join(__dirname, 'icon.png'),
        title: "POS Finger",
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            zoomFactor: 1,
            scrollBounce: false,
        },
        enableRemoteModule: true
    });

    mainWin.loadFile(path.join(__dirname, './src/interface/index.html'));
    mainWin.focus();
    mainWin.center();
    // mainWin.webContents.openDevTools();

    ipcMain.on('fingerprint-connection-state', (event, data) => {
        mainWin.webContents.send('set-state', data);
    });

    ipcMain.on('fingerprint-capture-quality', (event, data) => {
        mainWin.webContents.send('set-response', data);
    });

    ipcMain.on('fingerprint-image', (event, imageBase64) => {
        if (isLoading) {
            return;
        }
        isLoading = true;
        scanning(imageBase64);
        try {
            mainWin.webContents.send('set-image', imageBase64);
        } catch (error) {
            console.error('Gagal menampilkan sidik jari')
        }
    });
}

const scanning = async (image) => {
    try {
        mainWin.webContents.send('show-loading');
        const response = await verify(image);
        mainWin.webContents.send('scan-result', JSON.stringify(response));
        showNotification('User', response.user);
        udp(response.user)
        mainWin.webContents.send('hide-loading');
    } catch (err) {
        mainWin.webContents.send('scan-result', err);
        mainWin.webContents.send('hide-loading');
    } finally {
        isLoading = false;
    }
}

const showNotification = (title, message) => {
    tray.displayBalloon({
        icon: path.join(__dirname, 'icon.png'),
        title: title,
        content: message
    });
    setTimeout(() => {
        tray.removeBalloon();
    }, 1500);
}

function createScanWindow() {
    scanWin = new BrowserWindow({
        resizable: false,
        frame: false,
        alwaysOnTop: true,
        show: true,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: false,
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            backgroundThrottling: false,
            zoomFactor: 1,
            scrollBounce: false,
        },
        skipTaskbar: true
    });

    scanWin.loadFile(path.join(__dirname, './src/page/index.html'));
    scanWin.setBounds({ x: -1000, y: -1000, width: 0, height: 0 });

    // scanWin.webContents.openDevTools();
    // scanWin.setBounds({ x: 0, y: 0, width: 720, height: 720 });

}

function setupTray() {
    const iconTray = path.join(__dirname, 'icon.png');
    tray = new Tray(iconTray);

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Quit',
            click: () => app.quit()
        }
    ]);
    tray.on('click', () => {
        if (mainWin.isVisible()) {
            mainWin.hide();
        } else {
            mainWin.show();
        }
    });
    tray.setToolTip('POS Finger');
    tray.setContextMenu(contextMenu);
}

const validateOutlet = async () => {
    try {
        const outletCode = await outlet();
        const outletList = outlets;
        const validOutlet = outletList.some((value) => value === outletCode);
        return validOutlet;
    } catch (err) {
        return false;
    }
}

const validateDb = async () => {
    try {
        const dbConfig = db();
        await sql.connect(dbConfig);
        return true
    } catch (err) {
        return false
    }
}
app.setName('Fingerprint Service');
app.whenReady().then(() => {
    if (!app.requestSingleInstanceLock()) {
        app.quit();
        return;
    }

    createMainWindow();
    createScanWindow();
    setupTray();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
    }
});