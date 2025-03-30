const { ipcRenderer } = require('electron');
const { cerrarVentana } = require('../helpers')
const axios = require('axios');

require('dotenv').config()

const URL = process.env.GESTIONURL;

const fecha = document.querySelector('.fecha');
const tbody = document.querySelector('.tbody');
const saldo = document.querySelector('#saldoinput');
const excel = document.getElementById('excel');

let total = 0;
let clientes = [];

const exportarExcel = async () => {
    let clientesAux = [];

    clientes.forEach(elem => {
        let clienteAux = {};

        clienteAux.CODIGO = elem._id;
        clienteAux.NOMBRE = elem.nombre;
        clienteAux.CONDICION_IVA = elem.condicionIva;
        clienteAux.CUIT = elem.cuit;
        clienteAux.DIRECCION = elem.direccion;
        clienteAux.SALDO = elem.saldo;

        clientesAux.push(clienteAux);
    })

    let XLSX = require('xlsx');

    let path = await ipcRenderer.invoke('saveDialog');
    let wb = XLSX.utils.book_new();

    let extencion = 'xlsx';

    wb.Props = {
        Title: 'Saldos',
        Subject: 'Saldos Clientes',
        Author: 'Gestor'
    };



    let newWs = XLSX.utils.json_to_sheet(clientesAux);

    XLSX.utils.book_append_sheet(wb, newWs, "Movimientos");

    XLSX.writeFile(wb, path + "." + extencion);
};

const listar = async () => {
    clientes = (await axios.get(`${URL}clientes/clientesConSaldo`)).data;

    for await (let cliente of clientes) {
        const { nombre, _id, direccion, saldo, cuit, condicionIva } = cliente;
        total += saldo;
        tbody.innerHTML += `
            <tr>
                <td>${_id}</td>
                <td>${nombre.slice(0, 50)}</td>
                <td class="negrita izquierda">${saldo.toFixed(2)}</td>
                <td>${cuit}</td>
                <td>${condicionIva}</td>
                <td>${direccion}</td>
            </tr>
        `
    }
    saldo.value = total.toFixed(2);
}

listar();
const date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();

month = month === 13 ? 1 : month;
day = day < 10 ? `0${day}` : day;
month = month < 10 ? `0${month}` : month;

fecha.innerHTML = `${day}/${month}/${year}`;

excel.addEventListener('click', exportarExcel);

document.addEventListener('keyup', e => {
    cerrarVentana(e)
});