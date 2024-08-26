const axios = require('axios');
const sweet = require('sweetalert2');
const { ipcRenderer } = require('electron');
const { cerrarVentana } = require('../helpers');
require('dotenv').config();

const URL = process.env.GESTIONURL;

const nombre = document.querySelector('#nombre');
const cuit = document.querySelector('#cuit');
const domicilio = document.querySelector('#domicilio');
const localidad = document.querySelector('#localidad');
const codPostal = document.querySelector('#codPostal');
const provincia = document.querySelector('#provincia');
const telefono = document.querySelector('#telefono');
const mail = document.querySelector('#mail');

const guardar = document.querySelector('#guardar');
const modificar = document.querySelector('#modificar');
const salir = document.querySelector('#salir');

const agregarProvedor = async() => {

    if (nombre.value === '') return await sweet.fire({
        title: 'Falta Nombre',
        icon: 'error',
        timer: 2000
    });

    if (cuit.value === '') return await sweet.fire({
        title: 'Falta Cuit',
        icon: 'error',
        timer: 2000
    });

    const provedor = {};

    provedor.nombre = nombre.value.toUpperCase();
    provedor.cuit = cuit.value;
    provedor.domicilio = domicilio.value.toUpperCase();
    provedor.localidad = localidad.value.toUpperCase();
    provedor.provincia = provincia.value.toUpperCase();
    provedor.codPostal = codPostal.value;
    provedor.telefono = telefono.value;
    provedor.mail = mail.value;

    const res = (await axios.post(`${URL}provedor`, provedor)).data;

    if (res.ok){
        await sweet.fire({
            title: `Provedor ${provedor.nombre} Cargado Correctamente`,
            icon: 'success',
            timer: 2000
        })
    }else{
        await sweet.fire({
            title: `Error al Cargar Provedor ${provedor.nombre}`,
            icon: 'error',
            timer: 2000
        })
    };
    ipcRenderer.send('send-ventanaPrincipal', res._doc);
    
    window.close();
}

const infoTraido = (e,args) => {
    console.log(args)
};


ipcRenderer.on('informacion', infoTraido);

guardar.addEventListener('click', agregarProvedor);


nombre.addEventListener('keypress', e => {
    cuit.focus();
});

cuit.addEventListener('keypress', e => {
    domicilio.focus();
});

domicilio.addEventListener('keypress', e => {
    localidad.focus();
});

localidad.addEventListener('keypress', e => {
    codPostal.focus();
});

codPostal.addEventListener('keypress', e => {
    provincia.focus();
});

provincia.addEventListener('keypress', e => {
    telefono.focus();
});

telefono.addEventListener('keypress', e => {
    mail.focus();
});

mail.addEventListener('keypress', e => {
    if (e.keyCode === 13) {
        guardar.focus();
    }
});

salir.addEventListener('click', () => { window.close() });