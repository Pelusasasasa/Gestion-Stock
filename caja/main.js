import { app, BrowserWindow, protocol } from 'electron';
import path from 'path';
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(__dirname);

function createMainWindow() {
    const mainWindow = new BrowserWindow({
        title: 'Electron',

        width: 1000,

        height: 600
    });

    console.log(__dirname);
    const startUrl = url.format({
        pathname: path.join(__dirname, 'index.html'),

        protocol: 'file'
    });

    mainWindow.loadURL(startUrl)
};


app.whenReady().then(createMainWindow);