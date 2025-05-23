const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const { autoUpdater } = require('electron-builder');
const url = require('url');
const path = require('path');

const isDev = !app.isPackaged;

if (isDev) {
    require('electron-reload')(path.join(__dirname), {
        electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
        ignored: /node_modules|[\/\\]\./
    });
};

//Funcion para crear la ventana principal del proyecto
const createMainWindow = () => {

    const splashWindow = new BrowserWindow({
        width: 400,
        height: 300,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        resizable: false,
        skipTaskbar: true,
    })

    splashWindow.loadFile(path.join(__dirname, 'splash.html'));

    const mainWindow = new BrowserWindow({
        title: 'Caja',
        width: 1000,
        height: 600,
        show: false,
        backgroundColor: '#1e1e2f',
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    //Cargamos la url del domuneot html que se va acargar
    if (isDev) {
        mainWindow.webContents.openDevTools();
        mainWindow.loadURL("http://localhost:5173");
    } else {
        // mainWindow.setMenu(null); // ✅ Esto oculta completamente el menú
        mainWindow.loadURL(`file://${__dirname}/app/dist/index.html`);
    }

    ipcMain.handle('get-system-env', () => {
        return { VITE_API_GESTIONURL: process.env.GESTIONURL };
    });

    mainWindow.webContents.on('did-finish-load', () => {
        setTimeout(() => { // opcional: darle tiempo al CSS del renderer
            splashWindow.destroy();   // cerrar splash
            mainWindow.show();
            mainWindow.maximize();
            mainWindow.focus();
        }, 300);
    })
};


ipcMain.handle('save-file-dialog', async (_, content, defaultFileName) => {

    const { filePath } = await dialog.showSaveDialog({
        title: 'Guarda saldos',
        defaultPath: defaultFileName
    });

    if (filePath) {
        const XLSX = require('xlsx');
        let wb = XLSX.utils.book_new();

        wb.Props = {
            title: 'Saldos Provedores',
            subject: 'Saldos',
            Author: 'Gestion Caja'
        };

        let newWs = XLSX.utils.json_to_sheet(content);

        XLSX.utils.book_append_sheet(wb, newWs, "Saldos");

        XLSX.writeFile(wb, filePath);

        return { success: true, path: filePath };
    }
});


//Cuando al aplicacion este lista que luego cree la ventana
app.whenReady().then(() => {
    createMainWindow();


    //chequea updates
    autoUpdater.checkForUpdatesAndNotify();
});




//Cierra la aplicacion luego de cerrar las ventanas
app.on('window-all-closed', () => {
    app.quit();
});