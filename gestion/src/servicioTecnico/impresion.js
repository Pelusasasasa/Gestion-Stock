
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

const infoProductos = document.getElementById('infoProductos');

const cargarHeader = () => {
    fecha.innerText = (new Date().toISOString()).slice(0,10).split('-',3).reverse().join('/');

};

const cargarCliente = (id, nombre, direccion, tel) => {

    cliente.innerText = id + ' - ' +  nombre;
    domicilio.innerText = direccion ? direccion : 'S/N';
    telefono.innerText = tel ? tel : "000000"

};

const cargarProductos = (lista) => {

    for( let elem of lista){
        infoProductos.innerHTML += `
        <main class="producto">
            <div>
                <p>PRODUCTO: </p>
                <span id="descripcion">${elem.producto}</span>
            </div>
            
            <div>
                <p>MARCA: </p>
                <span id="marca">${elem.marca ? elem.marca : 'S/M'}</span>
            </div>
            
            <div>
                <p>MODELO</p>
                <span id="modelo">${elem.modelo ? elem.modelo : 'S/M'}</span>
            </div>

        </main>

        <main>
            <p class="inconvenientes">Inconvenientes: <span id="problemas">${elem.problemas}</span></p>
        </main>
        `

    };

};

ipcRenderer.on('recibir_servicio_impresion', async(e, args) => {
    const [servicio,lista] = JSON.parse(args);

    await cargarHeader();
    await cargarCliente(servicio.idCliente, servicio.cliente, servicio.direccion, servicio.telefono)
    await cargarProductos(lista);
    // ipcRenderer.send('imprimir-ventana');
});