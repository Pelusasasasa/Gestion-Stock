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

const modificarNro = async() => {

    if (!seleccionado) {

        await sweet.fire({
            title: "Elegir un numero de serie a modificar"
        });

        return;
    }

    const {nombre} = await verificarUsuarios();

    if (!nombre) {
        await sweet.fire({
            title: "No hay usuario logueado"
        });
        return;
    }

    const {isConfirmed} = await sweet.fire({
        title: 'Modificar',
        html: `
            <div class="flex flex-col">
                <label htmlFor="serie">Numero de Serie</label>
                <input type="text" name="serie" id="serie" />
            </div>
            <div class="flex flex-col mt-2">
                <label htmlFor="provedor">Provedor</label>
                <input type="text" name="provedor" id="provedor" />
            </div>
        `,
        confirmButtonText: "Modificar",
        showCancelButton: true
    });

    if (isConfirmed) {
            const serie = document.getElementById('serie').value;
            const provedor = document.getElementById('provedor').value;

            const res = (await axios.put(`${URL}nroSerie/id/${seleccionado.id}`, {nro_serie: serie, provedor})).data;
            seleccionado.children[3].innerText = serie;
            seleccionado.children[4].innerText = provedor.toUpperCase();

            agregarMovimientoVendedores(`Modifico el numero de serie ${res.nro_serie} a ${serie} y el provedor de ${res.provedor} a ${provedor.toUpperCase()} que pertenece al producto ${seleccionado.children[2].innerText} `, nombre);
    };
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
};

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
        const tdFactura = document.createElement('td');
        const tdVendedor = document.createElement('td');

        tdFecha.classList.add('border');
        tdCodigo.classList.add('border');
        tdProducto.classList.add('border');
        tdNroSerie.classList.add('border');
        tdProvedor.classList.add('border');
        tdFactura.classList.add('border');
        tdVendedor.classList.add('border');

        tdFecha.classList.add('border-black');
        tdCodigo.classList.add('border-black');
        tdProducto.classList.add('border-black');
        tdNroSerie.classList.add('border-black');
        tdProvedor.classList.add('border-black');
        tdFactura.classList.add('border-black');
        tdVendedor.classList.add('border-black');

        tdFecha.innerText = serie.fecha.slice(0, 10).split('-', 3).reverse().join('/');
        tdCodigo.innerText = serie.codigo;
        tdProducto.innerText = serie.producto;
        tdNroSerie.innerText = serie.nro_serie;
        tdProvedor.innerText = serie.provedor;
        tdFactura.innerText = serie.factura;
        tdVendedor.innerText = serie.vendedor;

        tr.appendChild(tdFecha);
        tr.appendChild(tdCodigo);
        tr.appendChild(tdProducto);
        tr.appendChild(tdNroSerie);
        tr.appendChild(tdProvedor);
        tr.appendChild(tdFactura);
        tr.appendChild(tdVendedor);

        tbody.appendChild(tr);
    };
};

const inicio = async () => {

    const series = (await axios.get(`${URL}nroSerie`)).data;
    listarSeries(series);

};

buscador.addEventListener('keyup', filtrar);

modificar.addEventListener('click', modificarNro);

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