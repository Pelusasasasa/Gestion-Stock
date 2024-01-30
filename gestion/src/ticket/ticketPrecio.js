const { ipcRenderer } = require('electron');

const axios = require('axios');
require('dotenv').config;
const URL = process.env.GESTIONURL;

const descripcion = document.getElementById('descripcion');
const precio = document.getElementById('precio');
const porcentaje = document.getElementById('porcentaje');


ipcRenderer.on('imprimir',(e,producto)=>{
    const elem = JSON.parse(producto);
    console.log(elem)
    descripcion.innerText = elem.descripcion;
    precio.innerText = "$" + elem.precioTarjeta.toFixed(2);
    porcentaje.innerText = elem.precio.toFixed(2);
    ipcRenderer.send('imprimir-ventana');
});