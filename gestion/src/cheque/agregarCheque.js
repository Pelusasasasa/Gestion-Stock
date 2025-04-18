
const axios = require('axios');
const { ipcRenderer } = require('electron');
require("dotenv").config();
const URL = process.env.GESTIONURL;

const fecha = document.getElementById('fecha');
const numero = document.getElementById('numero');
const banco = document.getElementById('banco');
const importe = document.getElementById('importe');
const fecha_cheque = document.getElementById('fecha_cheque');
const entregado_por = document.getElementById('entregado_por');
const entregado_a = document.getElementById('entregado_a');
const domicilio = document.getElementById('domicilio');
const telefono = document.getElementById('telefono');
const observaciones = document.getElementById('observaciones');

const cancelar = document.getElementById('cancelar');
const agregar = document.getElementById('agregar');
let informacion = '';

ipcRenderer.on('informacion', (e, args) => {
    informacion = args;
});


const guardar = async() => {
    const cheque = {};
    cheque.f_recibido = fecha.value;
    cheque.numero = numero.value;
    cheque.banco = banco.value;
    cheque.importe = importe.value;
    cheque.f_cheque = fecha_cheque.value;
    cheque.ent_por = entregado_por.value;
    cheque.ent_a = entregado_a.value;
    cheque.domicilio = domicilio.value;
    cheque.telefono = telefono.value;
    cheque.observacion = observaciones.value;


    const { data } = await axios.post(`${URL}cheques`, cheque);

    if(data.ok){
        ipcRenderer.send('enviar-ventana-principal', informacion);
        window.close();
    };
};

agregar.addEventListener('click', guardar);

cancelar.addEventListener('click', e => {
    window.close();
});

fecha.addEventListener('keypress', e => {
    if (e.keyCode === 13) {
        numero.focus();
        numero.select();
    }
});

numero.addEventListener('keypress', e => {
    if (e.keyCode === 13) {
    banco.focus();
    banco.select();
    }
});

banco.addEventListener('keypress', e => {
    if (e.keyCode === 13) {
    importe.focus();
    importe.select();
    }
});

importe.addEventListener('keypress', e => {
    if (e.keyCode === 13) {
    fecha_cheque.focus();
    fecha_cheque.select();
    }
});

fecha_cheque.addEventListener('keypress', e => {
    if (e.keyCode === 13) {
    entregado_por.focus();
    entregado_por.select();
    }
});

entregado_por.addEventListener('keypress', e => {
    if (e.keyCode === 13) {
    entregado_a.focus();
    entregado_a.select();
    }
});

entregado_a.addEventListener('keypress', e => {
    if (e.keyCode === 13) {
    domicilio.focus();
    domicilio.select();
    }
});

domicilio.addEventListener('keypress', e => {
    if (e.keyCode === 13) {
    telefono.focus();
    telefono.select();
    }
});

telefono.addEventListener('keypress', e => {
    if (e.keyCode === 13) {
    observaciones.focus();
    observaciones.select();
    }
});

observaciones.addEventListener('keypress', e => {
    if (e.keyCode === 13) {
    agregar.focus();
    }

});
