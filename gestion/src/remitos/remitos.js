const axios = require('axios');
require('dotenv').config();

const URL = process.env.GESTIONURL;

const tbody = document.getElementById('tbody');

const cargarPagina = async() => {

    const remitos =(await axios.get(`${URL}remitos`)).data;
    listarRemitos(remitos)
};

const listarRemitos = (lista) => {
    for (let elem of lista){
        const tr = document.createElement('tr');
        tr.id = elem._id;

        const tdFecha = document.createElement('td');

        tdFecha.innerText = elem.fecha.slice(0,10).split('-', 3).reverse().join('/  ');

        tr.appendChild(tdFecha);

        tbody.appendChild(tr);
    };
}

window.addEventListener('load', cargarPagina);