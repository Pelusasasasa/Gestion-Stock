

const axios = require('axios');
require('dotenv').config();
const URL = process.env.URL;

const fecha = document.getElementById('fecha');
const select = document.getElementById('vendedores');

const tbody = document.querySelector('tbody');

let vendedores

window.addEventListener('load',async e=>{

    const date = new Date()
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();

    month = month === 13 ? 1 : month

    day = day < 10 ? `0${day}` : day;
    month = month < 10 ? `0${month}` : month;

    fecha.value = `${year}-${month}-${day}`;

    vendedores = (await axios.get(`${URL}vendedores`)).data;
    const movimientos = (await axios.get(`${URL}movVendedores`)).data;
    listarVendedores(vendedores);
    listarMovimientos(movimientos)
});

const listarVendedores = (lista)=>{
    lista.forEach(vendedor => {
        const option = document.createElement('option');
        option.value = vendedor._id;
        option.text = vendedor.nombre;
        select.appendChild(option)
    });
};

const listarMovimientos = (lista)=>{
    lista.forEach(elem =>{
        const tr = document.createElement('tr');

        const fecha = elem.fecha.slice(0,10).split('-',3);
        const hora = elem.fecha.slice(11,19).split(':',3);
        const tdFecha = document.createElement('td');
        const tdDescripcion = document.createElement('td');
        const tdHora = document.createElement('td');
        
        tdFecha.innerHTML = `${fecha[2]}/${fecha[1]}/${fecha[0]}`;
        tdDescripcion.innerHTML = elem.descripcion;
        tdHora.innerHTML = `${hora[0]}:${hora[1]}:${hora[2]}`

        tr.appendChild(tdFecha);
        tr.appendChild(tdDescripcion);
        tr.appendChild(tdHora);

        tbody.appendChild(tr)
    });
}