const axios = require('axios');
const sweet = require('sweetalert2');
const { ipcRenderer } = require('electron');
const { cerrarVentana, agregarMovimientoVendedores } = require('../helpers');
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

let vendedor = '';
let provedor;

const agregarProvedor = async () => {

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

    const res = (await axios.post(`${URL}provedores`, provedor)).data;

    if (res.ok) {

        agregarMovimientoVendedores(`Agregro el provedor ${provedor.nombre}`, vendedor.nombre);

        await sweet.fire({
            title: `Provedor ${provedor.nombre} Cargado Correctamente`,
            icon: 'success',
            timer: 2000
        })
    } else {
        await sweet.fire({
            title: `Error al Cargar Provedor ${provedor.nombre}`,
            icon: 'error',
            timer: 2000
        })
    };
    ipcRenderer.send('send-ventanaPrincipal', res._doc);

    window.close();
};

const cargarDatos = async (id) => {

    modificar.classList.remove('none');
    guardar.classList.add('none');

    provedor = (await axios.get(`${URL}provedores/forId/${id}`)).data;

    nombre.value = provedor.nombre;
    cuit.value = provedor.cuit;
    domicilio.value = provedor.domicilio;
    localidad.value = provedor.localidad;
    codPostal.value = provedor.codPostal;
    provincia.value = provedor.provincia;
    telefono.value = provedor.telefono;
    mail.value = provedor.mail;
};

const infoTraido = (e, args) => {
    vendedor = args.vendedor;
    provedor = args.info;

    if (provedor) {
        cargarDatos(provedor);
    }
};

const modificarProvedor = async () => {

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

    provedor.nombre = nombre.value.toUpperCase();
    provedor.cuit = cuit.value;
    provedor.domicilio = domicilio.value.toUpperCase();
    provedor.localidad = localidad.value.toUpperCase();
    provedor.codPostal = codPostal.value;
    provedor.provincia = provincia.value.toUpperCase();
    provedor.telefono = telefono.value;
    provedor.mail = mail.value;

    const res = (await axios.put(`${URL}provedores/forId/${provedor._id}`, provedor)).data;

    if (res.ok) {
        await sweet.fire({
            title: `Provedor ${provedor.nombre} Modificado Correctamente`,
            icon: 'success',
            timer: 2000
        });

        agregarMovimientoVendedores(`Modifico el provedor ${provedor.nombre}`, vendedor);
    } else {

        await sweet.fire({
            title: `Error al Modificar Provedor ${provedor.nombre}`,
            icon: 'error',
            timer: 2000
        })

    };

    ipcRenderer.send('send-ventanaPrincipal', provedor);

    window.close();

};

ipcRenderer.on('informacion', infoTraido);

guardar.addEventListener('click', agregarProvedor);
modificar.addEventListener('click', modificarProvedor);


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