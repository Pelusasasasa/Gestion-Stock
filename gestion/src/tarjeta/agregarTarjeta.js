const axios = require('axios');
const Swal = require('sweetalert2');
const { ipcRenderer } = require('electron');
require("dotenv").config();
const URL = process.env.GESTIONURL;

const fecha = document.getElementById('fecha');
const nombre = document.getElementById('nombre');
const tarjeta = document.getElementById('tarjeta');
const tipo = document.getElementById('tipo');
const importe = document.getElementById('importe');

const agregar = document.getElementById('agregar');
const cancelar = document.getElementById('cancelar');

let informacion = '';

const cargarPagina = async () => {

    const { data } = await axios.get(`${URL}tipoTarjeta`);

    data.tipos.map((elem) => {
        const option = document.createElement('option');
        option.value = elem._id;
        option.text = elem.nombre;

        tarjeta.appendChild(option)
    });

};

const guardar = async () => {

    if (!await validarDatos()) return;

    const tarj = {};

    tarj.fecha = fecha.value;
    tarj.nombre = nombre.value;
    tarj.importe = importe.value;
    tarj.tarjeta = tarjeta.value;
    tarj.tipo = tipo.value;

    try {
        const { data } = await axios.post(`${URL}tarjetas`, tarj);
        if (data.ok) {
            ipcRenderer.send('enviar-ventana-principal', informacion);
            window.close();
        };
    } catch (error) {
        console.log(error);
    };
};

const salir = () => {
    ipcRenderer.send('enviar-ventana-principal', informacion);
    window.close();
};

const validarDatos = async () => {
    if (fecha.value === "") {
        await Swal.fire('No se puede cargar la tarjeta', 'Falta la fecha', 'error');
        return false;
    };
    if (nombre.value === "") {
        await Swal.fire('No se puede cargar la tarjeta', 'Falta el nombre del cliente', 'error');
        return false;
    };
    if (tarjeta.value === "") {
        await Swal.fire('No se puede cargar la tarjeta', 'Falta la tarjeta', 'error');
        return false;
    };
    if (importe.value === "") {
        await Swal.fire('No se puede cargar la tarjeta', 'Falta el importe', 'error');
        return false;
    };

    return true
};

ipcRenderer.on('informacion', (e, args) => {
    informacion = args;
    const [venta, cliente] = JSON.parse(informacion.informacion);
    fecha.value = venta.fecha.slice(0, 10);
    nombre.value = cliente.nombre.slice(0, 40);
    importe.value = venta.precio.toFixed(2);
    tipo.value = venta.tipo_comp;
});

agregar.addEventListener('click', guardar);

cancelar.addEventListener('click', salir);

fecha.addEventListener('keypress', e => {
    if (e.keyCode === 13) {
        nombre.focus();
        nombre.select();
    }
});

fecha.addEventListener('keypress', e => {
    if (e.keyCode === 13) {
        nombre.focus();
        nombre.select();
    }
});

nombre.addEventListener('keypress', e => {
    if (e.keyCode === 13) {
        tarjeta.focus();
    }
});

tarjeta.addEventListener('keypress', e => {
    if (e.keyCode === 13) {
        e.preventDefault();
        tipo.focus();
        tipo.select();
    }
});

tipo.addEventListener('keypress', e => {
    if (e.keyCode === 13) {
        importe.focus();
        importe.select();
    }
});

importe.addEventListener('keypress', e => {
    if (e.keyCode === 13) {
        agregar.focus();
    }
});

window.addEventListener('load', cargarPagina);
