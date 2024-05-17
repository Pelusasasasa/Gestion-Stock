
const axios = require('axios');
const { ipcRenderer } = require('electron');
require('dotenv');
const URL = process.env.GESTIONURL;

const numero = document.getElementById('numero');
const fecha = document.getElementById('fecha');

const cliente = document.getElementById('cliente');
const domicilio = document.getElementById('domicilio');
const telefono = document.getElementById('telefono');

const descripcion = document.getElementById('descripcion');
const marca = document.getElementById('marca');
const modelo = document.getElementById('modelo');
const serie = document.getElementById('serie');

const cargarHeader = (num) => {

    numero.innerText = num.padStart(8,'0');
    fecha.innerText = (new Date().toISOString()).slice(0,10).split('-',3).reverse().join('/');

};

const cargarCliente = (id, nombre, direccion, tel) => {

    cliente.innerText = id + ' - ' +  nombre;
    domicilio.innerText = direccion ? direccion : 'S/N';
    telefono.innerText = tel ? tel : "000000"

};

const cargarProducto = (producto, mar, mode, ser) => {

    descripcion.innerText = producto;
    marca.innerText = mar ? mar : "S/M";
    modelo.innerText = mode ? mode : "S/M";
    serie.innerText = ser ? ser : "0";


};

ipcRenderer.on('recibir_servicio_impresion', async(e, args) => {
    const servicio = JSON.parse(args);

    console.log(servicio)
    await cargarHeader(servicio.numero);
    await cargarCliente(servicio.idCliente, servicio.cliente, servicio.direccion, servicio.telefono)
    await cargarProducto(servicio.producto, servicio.marca, servicio.modelo, servicio.serie);
    
    ipcRenderer.send('imprimir-ventana');
});