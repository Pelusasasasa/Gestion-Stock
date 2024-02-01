const { ipcRenderer } = require('electron');
const{descuentoEfectivo} = require('../configuracion.json');

const axios = require('axios');
require('dotenv').config;
const URL = process.env.GESTIONURL;

const descripcion = document.getElementById('descripcion');
const precio = document.getElementById('precio');
const porcentaje = document.getElementById('porcentaje');
const descuento = document.getElementById('descuento');


ipcRenderer.on('imprimir',(e,producto)=>{
    const elem = JSON.parse(producto);
    console.log(elem)
    descripcion.innerText = elem.descripcion;
    precio.innerText = "$" + Math.round(elem.precio + elem.precio * descuentoEfectivo / 100).toFixed(2);
    porcentaje.innerText = elem.precio.toFixed(2);
    descuento.innerText = descuentoEfectivo.toFixed(2);
    ipcRenderer.send('imprimir-ventana');
});