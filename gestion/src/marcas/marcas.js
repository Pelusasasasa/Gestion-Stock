const { cerrarVentana } = require("../helpers");

require('dotenv').config();
const axios = require('axios');
const sweet = require('sweetalert2');
const URL = process.env.GESTIONURL;

let marcas = [];
let seleccionado = null;
let subSeleccionado = null;

const numero = document.getElementById('numero');
const nombre = document.getElementById('nombre');

const agregar = document.getElementById('agregar');

const tbody = document.getElementById('tbody');

const cargarPagina = async() => {
    const id = (await axios.get(`${URL}marca/last`)).data;
    numero.value = id + 1;

    marcas = (await axios.get(`${URL}marca`)).data;
    listarMarcas( marcas );
};

const agregarMarca = async() => {
    const marca = {
        codigo: numero.value,
        nombre: nombre.value
    };

    const res = (await axios.post(`${URL}marca`,marca)).data;

    marcas.push(res);

    listarMarcas(marcas);

    nombre.value = '';
    numero.value = parseInt(numero.value) + 1;

};

const clickTr = async(e) => {
    seleccionado?.classList.remove('seleccionado');
    subSeleccionado?.classList.remove('subSeleccionado');

    if (e.target.nodeName === 'SPAN'){
        seleccionado = e.target.parentNode.parentNode.parentNode;
        subSeleccionado = e.target.parentNode.parentNode;
    };

    if (e.target.nodeName === 'TD'){
        seleccionado = e.target.parentNode;
        subSeleccionado = e.target;
    };

    if (e.target.nodeName === 'TR'){
        seleccionado = e.target;
        subSeleccionado = e.target.children[0];
    };

    seleccionado.classList.add('seleccionado');
    subSeleccionado.classList.add('subSeleccionado');

    if (e.target.nodeName === 'SPAN' && e.target.innerText === 'delete'){

        const { isConfirmed } = await sweet.fire({
            title: `Seguro quiere eliminar ${seleccionado.children[1].innerText}`,
            showCancelButton: true,
            confirmButtonText: 'Eliminar'
        });

        if ( isConfirmed ){
            await axios.delete(`${URL}marca/forId/${seleccionado.id}`);
            marcas = marcas.filter(marca => marca._id !== seleccionado.id);
            tbody.removeChild(seleccionado);
            seleccionado = null;
        };
    };

    if (e.target.nodeName === 'SPAN' && e.target.innerText === 'edit'){

        const { isConfirmed, value } = await sweet.fire({
            title: `Modificar ${seleccionado.children[1].innerText}`,
            showCancelButton: true,
            input: 'text',
            confirmButtonText: 'Modificar'
        });

        if ( isConfirmed ){
            const aux = marcas.find( elem => elem._id === seleccionado.id);
            aux.nombre = value.toUpperCase().trim();

            await axios.put(`${URL}marca/forId/${seleccionado.id}`, aux);
            
            listarMarcas(marcas);
        };
    };
}

const listarMarcas = async(lista) => {
    
    tbody.innerHTML = ``;

    for await(let elem of lista){
        const tr = document.createElement('tr');

        tr.addEventListener('click', clickTr);

        tr.id = elem._id;

        tr.classList.add('cursor-pointer');

        const tdNumero = document.createElement('td');
        const tdNombre = document.createElement('td');
        const tdAcciones = document.createElement('td');

        tdNumero.classList.add('border');
        tdNombre.classList.add('border');
        tdAcciones.classList.add('border');
        tdAcciones.classList.add('acciones');

        tdNumero.innerText = elem.codigo;
        tdNombre.innerText = elem.nombre;
        tdAcciones.innerHTML = `
            <div class=tool>
                <span class=material-icons>edit</span>
                <p class=tooltip>Modificar</p>
            </div>
            <div class=tool>
                <span class=material-icons>delete</span>
                <p class=tooltip>Eliminar</p>
            </div>
        `;

        tr.appendChild(tdNumero);
        tr.appendChild(tdNombre);
        tr.appendChild(tdAcciones);

        tbody.appendChild(tr);
     
    }
    
};


document.addEventListener('keyup', cerrarVentana);

window.addEventListener('load', cargarPagina);

agregar.addEventListener('click', agregarMarca);


