const sweet = require('sweetalert2');
const { ipcRenderer } = require('electron');
const {cerrarVentana,apretarEnter,selecciona_value} = require('../helpers');

const axios = require('axios');
require("dotenv").config();
const URL = process.env.URL;

ipcRenderer.on('informacion',(e,{informacion})=>{
    ponerInputs(informacion)
})

const codigo = document.querySelector('#codigo');
const nombre = document.querySelector('#nombre');
const localidad = document.querySelector('#localidad');
const telefono = document.querySelector('#telefono');
const direccion = document.querySelector('#direccion');
const cuit = document.querySelector('#cuit');
const condicionIva = document.querySelector('#condicion');
const condicionFacturacion = document.querySelector('#condicionFacturacion');
const modificar = document.querySelector('.modificar');
const salir = document.querySelector('.salir');

const ponerInputs = async(id)=>{
    codigo.value = id;
    const cliente = (await axios.get(`${URL}clientes/id/${id}`)).data;
    nombre.value = cliente.nombre;
    localidad.value = cliente.localidad;
    direccion.value = cliente.direccion;
    telefono.value = cliente.telefono;
    cuit.value = cliente.cuit ? cliente.cuit : "";
    condicionIva.value = cliente.condicionIva ? cliente.condicionIva : "Consumidor Final";
    condicionFacturacion.value = cliente.condicionFacturacion;
}

nombre.addEventListener('keypress',e=>{
    apretarEnter(e,condicionFacturacion);
});

condicionFacturacion.addEventListener('keypress',e=>{
    e.preventDefault();
    apretarEnter(e,localidad);
});

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
    apretarEnter(e,condicionIva);
});

condicionIva.addEventListener('keypress',e=>{
    e.preventDefault();
    apretarEnter(e,modificar);
});

nombre.addEventListener('focus',e=>{
    selecciona_value(nombre.id);
});

localidad.addEventListener('focus',e=>{
    selecciona_value(localidad.id);
});

telefono.addEventListener('focus',e=>{
    selecciona_value(telefono.id);
});

direccion.addEventListener('focus',e=>{
    selecciona_value(direccion.id);
});


modificar.addEventListener('click',async e=>{
    const cliente = {};
    cliente._id = codigo.value;
    cliente.nombre = nombre.value;
    cliente.localidad = localidad.value;
    cliente.telefono = telefono.value;
    cliente.direccion = direccion.value.to;
    cliente.condicionFacturacion = condicionFacturacion.value;
    cliente.cuit = cuit.value;
    cliente.condicionIva = condicionIva.value;
    const mensaje = (await axios.put(`${URL}clientes/id/${cliente._id}`,cliente)).data;
    await sweet.fire({title:mensaje});
    ipcRenderer.send('enviar-ventana-principal',cliente);
    window.close();
})

document.addEventListener('keydown',e=>{
    cerrarVentana(e);
});

salir.addEventListener('click',e=>{
    window.close();
})