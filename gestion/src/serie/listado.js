require('dotenv').config();
const axios = require('axios');

const URL = process.env.GESTIONURL;

const buscador = document.querySelector('#buscador');
const tbody = document.querySelector('tbody');

const listarSeries = (series) => {
    tbody.innerHTML = '';
    for(let serie of series){
        const tr = document.createElement('tr');
        tr.id = serie._id;

        const tdFecha = document.createElement('td');
        const tdCodigo = document.createElement('td');
        const tdProducto = document.createElement('td');
        const tdNroSerie = document.createElement('td');
        const tdProvedor = document.createElement('td');

        tdFecha.innerText = serie.fecha.slice(0, 10).split('-', 3).reverse().join('/');
        tdCodigo.innerText = serie.codigo;
        tdProducto.innerText = serie.producto;
        tdNroSerie.innerText = serie.nro_serie;
        tdProvedor.innerText = serie.provedor;

        tr.appendChild(tdFecha);
        tr.appendChild(tdCodigo);
        tr.appendChild(tdProducto);
        tr.appendChild(tdNroSerie);
        tr.appendChild(tdProvedor);

        tbody.appendChild(tr);
    };
};

const inicio = async () => {

    const series = (await axios.get(`${URL}nroSerie`)).data;
    listarSeries(series);

};

const filtrar = async () => {
    const series = (await axios.get(`${URL}nroSerie/search/${buscador.value === '' ? 'all' : buscador.value}`)).data;
    listarSeries(series);
};

window.addEventListener('load', inicio);

buscador.addEventListener('keyup', filtrar);

document.addEventListener('keyup', e => {
    console.log(e.keyCode)
    if(e.keyCode === 27){
        location.href = '../menu.html';
    }
})