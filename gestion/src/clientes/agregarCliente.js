const {cerrarVentana,apretarEnter, agregarMovimientoVendedores} = require('../helpers');
const sweet = require('sweetalert2');

const axios = require('axios');
const {default:validarCuit} = require('cuit-validator')
const { ipcRenderer } = require('electron');
require("dotenv").config();
const URL = process.env.GESTIONURL;

const codigo = document.querySelector('#codigo');
const nombre = document.querySelector('#nombre');
const cuit = document.querySelector('#cuit');
const localidad = document.querySelector('#localidad');
const telefono = document.querySelector('#telefono');
const direccion = document.querySelector('#direccion');
const condicionIva = document.querySelector('#condicion');
const condicionFacturacion = document.querySelector('#condicionFacturacion');
const tipoCuenta = document.getElementById('tipoCuenta');
const observaciones = document.querySelector('#observaciones');

const agregar = document.querySelector('.agregar');
const salir = document.querySelector('.salir');

let vendedor;

window.addEventListener('load',async e=>{
    const id = (await axios.get(`${URL}clientes`)).data;
    codigo.value = id;
});

ipcRenderer.on('informacion',(e,args)=>{
    vendedor = args.vendedor;
});

agregar.addEventListener('click',async e=>{
    if(tipoCuenta.value === '') return await sweet.fire('El campo tipo de cuenta es obligatorio', 'No se pudo cargar el cliente', 'error');
        if(nombre.value === '') return await sweet.fire('El campo nombre es obligatorio', 'No se pudo cargar el cliente', 'error');

    const cliente = {};
    cliente._id = codigo.value;
    cliente.nombre = nombre.value.trim().toUpperCase();
    cliente.cuit = cuit.value;
    cliente.localidad = localidad.value.trim().toUpperCase();
    cliente.telefono = telefono.value.trim();
    cliente.direccion = direccion.value.trim().toUpperCase();
    cliente.condicionIva = condicionIva.value;
    cliente.condicionFacturacion = condicionFacturacion.value;
    cliente.tipoCuenta = tipoCuenta.value;
    cliente.observaciones = observaciones.value.trim().toUpperCase();

    try {
        const {data} = (await axios.post(`${URL}clientes`,cliente));

        if(data.ok){
            vendedor && await agregarMovimientoVendedores(`Agrego el  liente ${cliente.nombre} con direccion ${cliente.direccion}`,vendedor);
            await sweet.fire(`Cliente ${data.cliente.nombre} Agregado`, 'Cliente agregado correctamente', 'success');
            await ipcRenderer.send('informacion-a-ventana-principal',cliente);
            window.close();
        }else{
            await sweet.fire('No se pudo cargar el cliente', data?.msg, 'error');
        };
    } catch (error) {
        console.log(error);
        await sweet.fire('No se pudo cargar el cliente', error.response?.data?.msg, 'error');
    }
});

nombre.addEventListener('keypress',e=>{
    apretarEnter(e,cuit);
});

cuit.addEventListener('blur',async e=>{
    if (cuit.value.length === 11) {
        if (!validarCuit(cuit.value)) {
            await sweet.fire({
                title:"El cuit no es correcto"
            });
            cuit.value = "";
            cuit.focus();
        }
    }
});

cuit.addEventListener('keypress',e=>{
    apretarEnter(e,localidad);
});

localidad.addEventListener('keypress',e=>{
    apretarEnter(e,telefono);
});

telefono.addEventListener('keypress',e=>{
    apretarEnter(e,direccion);
});

direccion.addEventListener('keypress',e=>{
    apretarEnter(e,condicionFacturacion);
});

condicionFacturacion.addEventListener('keypress',e=>{
    e.preventDefault();
    apretarEnter(e,condicionIva);
});

condicionIva.addEventListener('keypress',e=>{
    e.preventDefault();
    apretarEnter(e,tipoCuenta);
});

tipoCuenta.addEventListener('keypress',e=>{
    e.preventDefault();
    apretarEnter(e,observaciones);
});

observaciones.addEventListener('keypress',e=>{
    apretarEnter(e,agregar);
});

document.addEventListener('keydown',e=>{
    cerrarVentana(e)
});

salir.addEventListener('click',e=>{
    window.close();
});