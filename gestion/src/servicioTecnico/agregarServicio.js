const axios = require('axios');
require("dotenv").config();
const URL = process.env.URL;

const {caja} = require('../configuracion.json');

const { ipcRenderer } = require('electron');
const sweet = require('sweetalert2');

const idCliente = document.getElementById('idCliente');
const cliente = document.getElementById('cliente');
const email = document.getElementById('email');
const direccion = document.getElementById('direccion');
const telefono = document.getElementById('telefono');

const producto = document.getElementById('producto');
const modelo = document.getElementById('modelo');
const marca = document.getElementById('marca');
const serie = document.getElementById('serie');
const detalles = document.getElementById('detalles');

const egreso = document.querySelector('.egreso');
const inputEgreso = document.getElementById('fechaEgreso');

const mostrador = document.getElementById('mostrador');
const vendedor = document.getElementById('vendedor');
const codigoRMA = document.getElementById('codigoRMA')


const agregar = document.getElementById('agregar');
const modificar = document.getElementById('modificar');
const salir = document.getElementById('salir');

ipcRenderer.on('informacion',async (e,args)=>{
    vendedor.value = args.vendedor;
    mostrador.checked = true
    if (args.informacion) {
        let servicio = (await axios.get(`${URL}servicios/id/${args.informacion}`)).data;
        listarServicio(servicio);

        egreso.classList.remove('none');

        const fechaEgreso = new Date();
        let day = fechaEgreso.getDate();
        let month = fechaEgreso.getMonth() + 1;
        let year = fechaEgreso.getFullYear();

        month = month === 13 ? 1 : month;
        day = day < 10 ? `0${day}` : day;
        month = month < 10 ? `0${month}` : month;
        inputEgreso.value = `${year}-${month}-${day}`;

        modificar.classList.remove('none');
        modificar.id = args.informacion;
        agregar.classList.add('none');
    }
});

const listarServicio = (servicio)=>{
    console.log(servicio)
    cliente.value = servicio.cliente;
    direccion.value = servicio.direccion;
    telefono.value = servicio.telefono;
    idCliente.value = servicio.idCliente;

    producto.value = servicio.producto;
    modelo.value = servicio.modelo;
    marca.value = servicio.marca;
    serie.value = servicio.numeroSerie;
    detalles.value = servicio.detalles;

    codigoRMA.value = servicio.codigoRMA;
}

idCliente.addEventListener('keypress',async e=>{
    if (e.keyCode === 13 && idCliente.value !== "") {
        const cliente = (await axios.get(`${URL}clientes/id/${idCliente.value}`)).data;
        if (cliente) {
            listarCliente(cliente);
            producto.focus();
        }else{
            await sweet.fire({
                title:"Cliente no encontrado"
            });
            idCliente.value = "";
        }
    }else if(e.keyCode === 13 && idCliente.value === ""){
        idCliente.value = "0000";
        cliente.focus();
    };
});

cliente.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        direccion.focus();
    }
});

direccion.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        telefono.focus();
    }
});

telefono.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        producto.focus();
    }
});

producto.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        modelo.focus();
    }
});

modelo.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        marca.focus();
    }
});

marca.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        serie.focus();
    }
});

serie.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        detalles.focus();
    }
});

codigoRMA.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        agregar.focus();
    }
});
const listarCliente = (elem)=>{
    cliente.value = elem.nombre;
    direccion.value = elem.direccion;
    telefono.value = elem.telefono;
}

agregar.addEventListener('click',async e=>{
    const servicio = {};
    servicio.idCliente = idCliente.value;
    servicio.cliente = cliente.value.toUpperCase();
    servicio.direccion = direccion.value.toUpperCase();
    servicio.telefono = telefono.value;

    servicio.producto = producto.value.toUpperCase();
    servicio.modelo = modelo.value.toUpperCase();
    servicio.marca = marca.value.toUpperCase();
    servicio.numeroSerie = serie.value;
    
    servicio.detalles = detalles.value.toUpperCase();
    
    if (mostrador.checked) {
        servicio.retiro = "MOSTRADOR";
    }else{
        servicio.retiro = "RESIDENCIA";
    }
    servicio.caja = caja.toUpperCase();
    servicio.codigoRMA = codigoRMA.value;
    servicio.vendedor = vendedor.value;



    try {
        await axios.post(`${URL}servicios`,servicio);
        window.close();
    } catch (error) {
        await sweet.fire({
            title:"No se pudo cargar el servicio"
        })
    }
});

modificar.addEventListener('click',async e=>{
    const servicio = {};
    servicio.idCliente = idCliente.value;
    servicio.cliente = cliente.value.toUpperCase();
    servicio.direccion = direccion.value.toUpperCase();
    servicio.telefono = telefono.value;

    servicio.producto = producto.value.toUpperCase();
    servicio.modelo = modelo.value.toUpperCase();
    servicio.marca = marca.value.toUpperCase();
    servicio.serie = serie.value;

    servicio.detalles = detalles.value.toUpperCase();

    servicio.fechaEgreso = inputEgreso.value;
    servicio.total = total.value;


    if (mostrador.checked) {
        servicio.retiro = "MOSTRADOR";
    }else{
        servicio.retiro = "RESIDENCIA";
    }
    servicio.caja = caja;
    servicio.codigoRMA = codigoRMA.value;
    servicio.vendedor = vendedor.value;

    try {
        await axios.put(`${URL}servicios/id/${modificar.id}`,servicio);
        window.close();
    } catch (error) {
        sweet.fire({
            title:"No se pudo modificar el servicio"
        })
    }
});

salir.addEventListener('click',e=>{
    window.close();
});

document.addEventListener('keyup',e=>{
    if (e.keyCode === 27) {
        window.close();
    }
});