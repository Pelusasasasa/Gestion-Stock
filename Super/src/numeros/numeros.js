const axios = require('axios');
require("dotenv").config();
const URL = process.env.URL;

const {cerrarVentana, ultimaC} = require('../helpers');

const dolar = document.querySelector('#dolar');
const contado = document.querySelector('#contado');
const cuentaCorriente = document.querySelector('#cuentaCorriente');
const recibo = document.querySelector('#recibo');
const remito = document.querySelector('#remito');
const facturaC = document.querySelector('#facturaC');
const notaC = document.querySelector('#notaC');

const modificar = document.querySelector('.modificar');
const guardar = document.querySelector('.guardar');
const cargar = document.querySelector('.cargar');
const salir = document.querySelector('.salir');

let id;

window.addEventListener('load',async e=>{
    const numeros =(await axios.get(`${URL}numero`)).data;

    try {
        let facturas = await ultimaC();
        console.log(facturas)
        facturaC.value = facturas.facturaC;
        notaC.value = facturas.notaC;
    } catch (error) {
        console.log(error)
    }

    (numeros.Contado === 0 || numeros["Cuenta Corriente"] === 0 || numeros.Recibo === 0 || numeros !== "") && cargar.classList.add('none');
    if (numeros !== "") {
        id = numeros._id;
        dolar.value = numeros.Dolar.toFixed(2)
        contado.value = numeros.Contado.toString().padStart(8,'0');
        recibo.value = numeros.Recibo.toString().padStart(8,'0');
        cuentaCorriente.value = numeros["Cuenta Corriente"].toString().padStart(8,'0');
        remito.value = numeros["Remito"].toString().padStart(8,'0');
    }
});

//aca lo que hacemos es poner un boton para que si los numeros no estan cargados se carguen por primera vez
cargar.addEventListener('click',async e=>{
    const numero = {
        "Cuenta Corriente": 0,
        "Contado": 0,
        "Recibo": 0,
        "Remito": 0,
        "Dolar":0
    }
    await axios.post(`${URL}numero`,numero);
    location.reload();
});

//cuando apretamos habilitamos para que se modifiquen los numeros
modificar.addEventListener('click',e=>{
    modificar.classList.add('none');
    guardar.classList.remove('none');
    contado.removeAttribute('disabled');
    cuentaCorriente.removeAttribute('disabled');
    recibo.removeAttribute('disabled');
});

//Aca cuando modificamos los numeros despues los guardamos
guardar.addEventListener('click',async e=>{
    const numero = {};
    numero._id = id;
    numero.Contado = parseInt(contado.value);
    numero.Recibo = parseInt(recibo.value);
    numero["Cuenta Corriente"] = parseInt(cuentaCorriente.value);
    await axios.put(`${URL}numero`,numero);
    window.close();
});

salir.addEventListener('click',e=>{
    window.close();
});

document.addEventListener('keyup',e=>{
    cerrarVentana(e)
});