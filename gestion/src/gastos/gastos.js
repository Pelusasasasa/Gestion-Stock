const axios = require('axios');
require("dotenv").config();
const URL = process.env.GESTIONURL;

const sweet = require('sweetalert2');
const {cerrarVentana, verificarUsuarios, agregarMovimientoVendedores, verNombrePc} = require('../helpers');

const fecha = document.getElementById('fecha');
const descripcion = document.getElementById('descripcion');
const cuenta = document.getElementById('cuenta');
const importe = document.getElementById('importe');
const inputVendedor = document.getElementById('vendedor');
const aceptar = document.querySelector('.aceptar');
const salir = document.querySelector('.salir');

const {caja,vendedores} = require('../configuracion.json');
const { ipcRenderer } = require('electron');


window.addEventListener('load',async e=>{

    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    month = month === 13 ? 1 : month;
    day = day < 10 ? `0${day}` : day;
    month = month < 10 ? `0${month}` : month;

    fecha.value =  `${year}-${month}-${day}`;

    const cuentas = (await axios.get(`${URL}cuenta`)).data;
    listarCuentas(cuentas);
});

ipcRenderer.on('informacion', (e,args) => {
  
    inputVendedor.value = args.info;
    
});


fecha.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        descripcion.focus();
    }
});

descripcion.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        cuenta.focus();
    }
});

cuenta.addEventListener('keypress', e => {
    e.preventDefault();
    if (e.keyCode === 13){
        importe.focus();
    };
});

importe.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        aceptar.focus();
    }
});

aceptar.addEventListener('click',async e=>{
    const gasto = {};

    if (descripcion.value === "") {
        await sweet.fire({ 
            title: "Poner Descripcion",
            returnFocus:false
        });
        descripcion.focus();
        return;
    };

    if (importe.value === "") {
        await sweet.fire({ 
            title: "Poner Importe",
            returnFocus:false
        });
        importe.focus();
        return;
    };

    gasto.fecha = fecha.value;
    gasto.descripcion = descripcion.value.toUpperCase();
    gasto.importe = importe.value;
    gasto.cuenta = (await axios.get(`${URL}cuenta/idCuenta/${cuenta.value}`)).data.cuenta;
    gasto.vendedor = inputVendedor.value;
    gasto.caja = caja;

    try {
        await axios.post(`${URL}gastos`,gasto);
        window.close();
    } catch (error) {
        console.log(error)
        await sweet.fire({
            title:"No se puedo cargar el Gasto General"
        })
    };
    
    const pc = await verNombrePc();
    agregarMovimientoVendedores(`${inputVendedor.value} agrego el gasto de ${gasto.descripcion} a la cuenta ${gasto.cuenta} desde la compu ${pc}`, gasto.vendedor)
});

salir.addEventListener('click',e=>{
    window.close();
});

document.addEventListener('keyup',e=>{
    cerrarVentana(e);
});


const listarCuentas = (lista) => {
    for(let elem of lista){
        const option = document.createElement('option');
        option.text = elem.cuenta;
        option.value = elem.idCuenta;

        cuenta.appendChild(option)

    };
}