const axios = require('axios');
const { ipcRenderer } = require('electron');
const sweet = require('sweetalert2');
require('dotenv').config();

const URL = process.env.GESTIONURL;

let buscador = document.getElementById('buscador');
let tbody = document.getElementById('tbody');

//botones
let agregar = document.getElementById('agregar');
let modificar = document.getElementById('modificar');
let eliminar = document.getElementById('eliminar');
let salir = document.getElementById('salir');

let provedores = [];
let seleccionado = '';
let subSeleccionado = '';
let vendedor = '';

const agregarProvedor = async() => {
    const opciones = {
        path:"./provedores/post-putProvedor.html",
        altura:500,
        ancho:1200,
        vendedor:vendedor,
        info: '',
        tipo: 'agregar'
    };

    ipcRenderer.send('abrir-ventana', opciones);
};

const cargarPagina = async () => {
    provedores = (await axios.get(`${URL}provedor`)).data;

    listarProvedores(provedores);

};

const clickBody = (e) => {
    seleccionado && seleccionado.classList.remove('seleccionado');
    subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');

    if( e.target.nodeName === 'TD'){
        seleccionado = e.target.parentNode;
        subSeleccionado = e.target;
    };

    seleccionado.classList.add('seleccionado');
    subSeleccionado.classList.add('subSeleccionado');

};

const eliminarProvedor = async(e) => {

    if (!seleccionado) return await sweet.fire('Venta no Seleccionada');

    const {isConfirmed} = await sweet.fire({
        title: 'Desea eliminar el provedor?',
        confirmButtonText: 'Aceptar',
        showCancelButton: true,
    });

    if (isConfirmed){
        await axios.delete(`${URL}provedor/forId/${seleccionado.id}`);
    };

    tbody.removeChild( seleccionado );
    seleccionado = '';
    
    provedores = provedores.filter( provedor => provedor._id !== seleccionado.id);

};

const filtrarProvedores = async(e) => {
    const provedores = (await axios.get(`${URL}provedor/forText/${buscador.value === '' ? 'NADA' : buscador.value}`)).data;
    listarProvedores(provedores);
};

const listarProvedores = async(lista) => {

    tbody.innerHTML = '';

    for(let provedor of lista){
        let tr = document.createElement('tr');
        tr.id = provedor._id;
        tr.classList.add('cursor-pointer');

        let tdRazon = document.createElement('td');
        let tdCuit = document.createElement('td');
        let tdDireccion = document.createElement('td');
        let tdLocalidad = document.createElement('td');
        let tdSaldo = document.createElement('td');

        tdRazon.innerText = provedor.nombre;
        tdCuit.innerText = provedor.cuit;
        tdDireccion.innerText = provedor.domicilio;
        tdLocalidad.innerText = provedor.localidad;
        tdSaldo.innerText = provedor.saldo.toFixed(2);

        tdRazon.classList.add('border');
        tdCuit.classList.add('border');
        tdDireccion.classList.add('border');
        tdLocalidad.classList.add('border');
        tdSaldo.classList.add('border');

        tdRazon.classList.add('border-black');
        tdCuit.classList.add('border-black');
        tdDireccion.classList.add('border-black');
        tdLocalidad.classList.add('border-black');
        tdSaldo.classList.add('border-black');

        tr.appendChild(tdRazon);
        tr.appendChild(tdCuit);
        tr.appendChild(tdDireccion);
        tr.appendChild(tdLocalidad);
        tr.appendChild(tdSaldo);

        tbody.appendChild(tr);
    }

};

const modificarProvedor = async() => {
    if (!seleccionado) return await sweet.fire('Seleccionar Provedor');

    const opciones = {
        path:"./provedores/post-putProvedor.html",
        altura:500,
        ancho:1200,
        vendedor:vendedor,
        info: seleccionado.id,
        tipo: 'modificar'
    };

    ipcRenderer.send('abrir-ventana', opciones);
};

agregar.addEventListener('click', agregarProvedor);
buscador.addEventListener('keyup', filtrarProvedores);
eliminar.addEventListener('click', eliminarProvedor);
modificar.addEventListener('click', modificarProvedor);

tbody.addEventListener('click', clickBody);
window.addEventListener('load', cargarPagina);

salir.addEventListener('click', () => {
    location.href = '../menu.html';
});

ipcRenderer.on('informacion', (e, provedor) => {
    provedores.push(provedor);
    
    listarProvedores(provedores);
});