require('dotenv').config();
const axios = require('axios');
const sweet = require('sweetalert2');
const { agregarMovimientoVendedores, verificarUsuarios } = require('../helpers');

const URL = process.env.GESTIONURL;

const buscador = document.querySelector('#buscador');
const tbody = document.querySelector('tbody');

const modificar = document.getElementById('modificar');
const eliminar = document.getElementById('eliminar');
const salir = document.getElementById('salir');

let seleccionado = '';
let subSeleccionado = '';

const clickEnTbody = (e) => {
    
    if(e.target.tagName === 'TD'){
        seleccionado && seleccionado.classList.remove('seleccionado');
        subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');

        seleccionado = e.target.parentNode;
        subSeleccionado = e.target;

        seleccionado.classList.add('seleccionado');
        subSeleccionado.classList.add('subSeleccionado');

    }
};

const eliminarNro = async () => {

    if(!seleccionado){
        await sweet.fire({
            title:"Elegir un numero de serie a eliminar"
        });
        return;
    };
            
    const {isConfirmed} = await sweet.fire({
        title: '¿Seguro que desea eliminar el nro de serie?',
        confirmButtonText: 'Eliminar',
        showCancelButton: true
    });

    if (isConfirmed) {

        const {nombre} = await verificarUsuarios();
        
        if (!nombre) return;

        await axios.delete(`${URL}nroSerie/id/${seleccionado.id}`);
        
        await agregarMovimientoVendedores(`Elimino el numero de serie ${seleccionado.children[3].innerText} que pertenece al producto ${seleccionado.children[2].innerText}`, nombre);
        tbody.removeChild(seleccionado);
        seleccionado = '';
    }
}

const filtrar = async () => {
    const series = (await axios.get(`${URL}nroSerie/search/${buscador.value === '' ? 'all' : buscador.value}`)).data;
    listarSeries(series);
};

const listarSeries = (series) => {
    tbody.innerHTML = '';
    for(let serie of series){
        const tr = document.createElement('tr');
        tr.classList.add('cursor-pointer');
        tr.id = serie._id;

        const tdFecha = document.createElement('td');
        const tdCodigo = document.createElement('td');
        const tdProducto = document.createElement('td');
        const tdNroSerie = document.createElement('td');
        const tdProvedor = document.createElement('td');
        const tdVendedor = document.createElement('td');

        tdFecha.innerText = serie.fecha.slice(0, 10).split('-', 3).reverse().join('/');
        tdCodigo.innerText = serie.codigo;
        tdProducto.innerText = serie.producto;
        tdNroSerie.innerText = serie.nro_serie;
        tdProvedor.innerText = serie.provedor;
        tdVendedor.innerText = serie.vendedor;

        tr.appendChild(tdFecha);
        tr.appendChild(tdCodigo);
        tr.appendChild(tdProducto);
        tr.appendChild(tdNroSerie);
        tr.appendChild(tdProvedor);
        tr.appendChild(tdVendedor);

        tbody.appendChild(tr);
    };
};

const inicio = async () => {

    const series = (await axios.get(`${URL}nroSerie`)).data;
    listarSeries(series);

};


buscador.addEventListener('keyup', filtrar);

eliminar.addEventListener('click', eliminarNro);

tbody.addEventListener('click', clickEnTbody);

window.addEventListener('load', inicio);

document.addEventListener('keyup', e => {
    if(e.keyCode === 27){
        location.href = '../menu.html';
    }
});

salir.addEventListener('click', e => {
    location.href = '../menu.html';
});