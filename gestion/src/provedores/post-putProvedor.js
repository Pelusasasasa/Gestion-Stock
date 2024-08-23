const axios = require('axios');
const { ipcRenderer } = require('electron');
require('dotenv').config();

const URL = process.env.GESTIONURL;

const infoTraido = (e,args) => {
    console.log(args)
};


ipcRenderer.on('informacion', infoTraido);