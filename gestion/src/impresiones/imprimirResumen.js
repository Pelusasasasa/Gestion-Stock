const axios = require("axios");
require('dotenv').config();
const URL = process.env.GESTIONURL;

const { ipcRenderer } = require("electron");

const tbody = document.getElementById('tbody');
const nombre = document.getElementById('nombre');
const direccion = document.getElementById('direccion');
const telefono = document.getElementById('telefono');


ipcRenderer.on('imprimir-resumen',(e,info)=>{
    const {idCliente,historicas} = JSON.parse(info);
    datosCliente(idCliente);
    llenarTabla(historicas);
});

async function datosCliente(idCliente){
    const cliente = (await axios.get(`${URL}clientes/id/${idCliente}`)).data;
    
    nombre.innerText = cliente.nombre;
    direccion.innerText = cliente.direccion + " - " + cliente.localidad;
    telefono.innerText = cliente.telefono;
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
        tdNumero.innerText = historica.nro_venta;
        tdDebe.innerText = historica.debe;
        tdHaber.innerText = historica.haber;
        tdSaldo.innerText = historica.saldo;

        tr.appendChild(tdFecha);
        tr.appendChild(tdTipo);
        tr.appendChild(tdNumero);
        tr.appendChild(tdDebe);
        tr.appendChild(tdHaber);
        tr.appendChild(tdSaldo);

        tbody.appendChild(tr)

        console.log(historica)
    };


};