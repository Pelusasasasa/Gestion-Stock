const {cerrarVentana,apretarEnter} = require('../helpers');
const sweet = require('sweetalert2');

const axios = require('axios');
require("dotenv").config();
const URL = process.env.URL;

const codigo = document.querySelector('#codigo');
const nombre = document.querySelector('#nombre');
const localidad = document.querySelector('#localidad');
const telefono = document.querySelector('#telefono');
const direccion = document.querySelector('#direccion');
const cuit = document.querySelector('#cuit');
const condicionIva = document.querySelector('#condicion');
const condicionFacturacion = document.querySelector('#condicionFacturacion');
const agregar = document.querySelector('.agregar');
const salir = document.querySelector('.salir');

window.addEventListener('load',async e=>{
    const id = (await axios.get(`${URL}clientes`)).data;
    codigo.value = id;
});

agregar.addEventListener('click',async e=>{
    const cliente = {};
    cliente._id = codigo.value;
    cliente.nombre = nombre.value;
    cliente.localidad = localidad.value;
    cliente.telefono = telefono.value;
    cliente.direccion = direccion.value;
    cliente.cuit = cuit.value;
    cliente.condicionIva = condicionIva.value;
    cliente.condicionFacturacion = condicionFacturacion.value;
    const {mensaje,estado} = (await axios.post(`${URL}clientes`,cliente)).data;
    await sweet.fire({
        title:mensaje
    });
    if (estado) {
        window.close();
    }
});


nombre.addEventListener('keypress',e=>{
    apretarEnter(e,condicionFacturacion);
});

condicionFacturacion.addEventListener('keypress',e=>{
    e.preventDefault();
    apretarEnter(e,localidad);
})

localidad.addEventListener('keypress',e=>{
    apretarEnter(e,telefono);
});

telefono.addEventListener('keypress',e=>{
    apretarEnter(e,direccion);
});

direccion.addEventListener('keypress',e=>{
    apretarEnter(e,cuit);
});

cuit.addEventListener('keypress',e=>{
    apretarEnter(e,condicion);
});

condicion.addEventListener('keypress',e=>{
    e.preventDefault();
    apretarEnter(e,agregar);
});

document.addEventListener('keydown',e=>{
    cerrarVentana(e)
});

salir.addEventListener('click',e=>{
    window.close();
});