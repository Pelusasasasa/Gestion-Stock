const axios = require("axios");
require('dotenv').config();
const URL = process.env.GESTIONURL;

const { ipcRenderer } = require("electron");

const tbody = document.getElementById('tbody');
const nombre = document.getElementById('nombre');
const direccion = document.getElementById('direccion');
const telefono = document.getElementById('telefono');
const saldo = document.getElementById('saldo');


ipcRenderer.on('imprimir-resumen',async (e,info)=>{
    const {idCliente,historicas} = JSON.parse(info);
    await datosCliente(idCliente);
    await llenarTabla(historicas);
    ipcRenderer.send('imprimir-ventana')
});

async function datosCliente(idCliente){
    const cliente = (await axios.get(`${URL}clientes/id/${idCliente}`)).data;
    
    nombre.innerText = cliente.nombre;
    direccion.innerText = cliente.direccion + " - " + cliente.localidad;
    telefono.innerText = cliente.telefono;
    saldo.innerText = cliente.saldo.toFixed(2);
};

async function llenarTabla(historicas){

    for(let historica of historicas){
        const tr = document.createElement('tr');

        const tdFecha = document.createElement('td');
        const tdTipo = document.createElement('td');
        const tdComprobante = document.createElement('td');
        const tdNumero = document.createElement('td');
        const tdDebe = document.createElement('td');
        const tdHaber = document.createElement('td');
        const tdSaldo = document.createElement('td');

        tdFecha.innerText = historica.fecha.slice(0,10).split('-',3).reverse().join('/')
        tdTipo.innerText = historica.tipo_comp;
        tdNumero.innerText = historica.nro_venta.toString().padStart(8,'0');
        tdDebe.innerText = historica.debe.toFixed(2);
        tdHaber.innerText = historica.haber.toFixed(2);
        tdSaldo.innerText = historica.saldo.toFixed(2);

        tr.appendChild(tdFecha);
        tr.appendChild(tdTipo);
        tr.appendChild(tdNumero);
        tr.appendChild(tdDebe);
        tr.appendChild(tdHaber);
        tr.appendChild(tdSaldo);

        tbody.appendChild(tr)
    };


};