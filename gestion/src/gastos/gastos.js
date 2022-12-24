const axios = require('axios');
require("dotenv").config();
const URL = process.env.URL;

const sweet = require('sweetalert2');
const {cerrarVentana, verificarUsuarios} = require('../helpers');

const fecha = document.getElementById('fecha');
const descripcion = document.getElementById('descripcion');
const importe = document.getElementById('importe');
const inputVendedor = document.getElementById('vendedor');
const aceptar = document.querySelector('.aceptar');
const salir = document.querySelector('.salir');

const {caja,vendedores} = require('../configuracion.json');

let vendedor;

window.addEventListener('load',async e=>{
    console.log(vendedores)
    if (vendedores) {
        vendedor = await verificarUsuarios();

        if (vendedor) {
            inputVendedor.value = vendedor.nombre;
        }else{
            await sweet.fire({
                title:"Contraseña Incorrecta"
            });
            location.reload();
        }
    }

    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    month = month === 13 ? 1 : month;
    day = day < 10 ? `0${day}` : day;
    month = month < 10 ? `0${month}` : month;

    fecha.value =  `${year}-${month}-${day}`;
});


fecha.addEventListener('keyup',e=>{
    if (e.keyCode === 13) {
        descripcion.focus();
    }
});

descripcion.addEventListener('keyup',e=>{
    if (e.keyCode === 13) {
        importe.focus();
    }
});

importe.addEventListener('keyup',e=>{
    if (e.keyCode === 13) {
        aceptar.focus();
    }
});

aceptar.addEventListener('click',async e=>{
    const gasto = {};

    gasto.fecha = fecha.value;
    gasto.descripcion = descripcion.value.toUpperCase();
    gasto.importe = importe.value;
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
    }
});

salir.addEventListener('click',e=>{
    window.close();
});

document.addEventListener('keyup',e=>{
    cerrarVentana(e);
})