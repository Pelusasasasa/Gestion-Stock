const { ipcRenderer } = require('electron');

const axios = require('axios');
require('dotenv').config;
const URL = process.env.GESTIONURL;

const descripcion = document.getElementById('descripcion');
const precio = document.getElementById('precio');

ipcRenderer.on('imprimir',(e,producto)=>{
    const elem = JSON.parse(producto);
    descripcion.innerText = elem.descripcion;
    precio.innerText = "$" + elem.precio.toFixed(2);

    ipcRenderer.send('imprimir-ventana');
});