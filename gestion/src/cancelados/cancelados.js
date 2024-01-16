const axios  = require("axios");
require('dotenv').config();
const URL = process.env.GESTIONURL;

const { fechaHoy, cerrarVentana } = require("../helpers");

const desde = document.getElementById('desde');
const hasta = document.getElementById('hasta');
const tbody = document.querySelector('tbody');
const volver = document.getElementById('volver');

let cancelados = [];

window.addEventListener('load', async() => {
    const date = fechaHoy().slice(0,10);
    desde.value = date;
    hasta.value = date;

    cancelados = (await axios.get(`${URL}Cancelado/forDay/${desde.value}/${hasta.value}`)).data;
    listarCancelados(cancelados);
    
});

const listarCancelados = (cancelados) => {

    cancelados.sort( (a,b) => {
        if (a.fecha > b.fecha) return 1;
        if (a.fecha < b.fecha) return -1;
        return 0;
    });

    for (let elem of cancelados){
        const tr = document.createElement('tr');

        const tdFecha = document.createElement('td');
        const tdCliente = document.createElement('td');
        const tdPrecio = document.createElement('td');
        const tdVenedor = document.createElement('td');
        const tdCaja = document.createElement('td');
        const tdHora = document.createElement('td');
        const tdAcciones = document.createElement('td');

        tdPrecio.classList.add('text-rigth');
        tdPrecio.classList.add('text-rigth');

        tdFecha.innerHTML = elem.fecha.slice(0,10).split('-',3).reverse().join('/');
        tdCliente.innerText = elem.cliente;
        tdPrecio.innerText = elem.precio.toFixed(2);
        tdVenedor.innerText = elem.vendedor;
        tdCaja.innerText = elem.caja;
        tdHora.innerText = elem.fecha.slice(11,19);
        tdAcciones.innerHTML = `
        <div class=tool>
            <span class=material-icons>edit</span>
            <p class=tooltip>Hacer Venta</p>
        </div>
        `;

        tr.appendChild(tdFecha);
        tr.appendChild(tdCliente);
        tr.appendChild(tdPrecio);
        tr.appendChild(tdVenedor);
        tr.appendChild(tdCaja);
        tr.appendChild(tdHora);
        tr.appendChild(tdAcciones);

        tbody.appendChild(tr);

    }

};

volver.addEventListener('click', () => {
    location.href = '../menu.html';
});

document.addEventListener('keyup', e => {
    if (e.keyCode === 27) {
        location.href = '../menu.html';
    }
});