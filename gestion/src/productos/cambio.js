const axios = require('axios');
require('dotenv').config()
const URL = process.env.GESTIONURL;
const sweet = require('sweetalert2');

const {apretarEnter, imprimirTicketPrecio, agregarProductoModificadoParaTicket, redondear} = require('../helpers');
const { ipcRenderer } = require('electron');
const {descuentoEfectivo,ImprecioTicketPrecio} = require('../configuracion.json');

const codigo = document.querySelector('#codigo');
const marca = document.querySelector('#marca');
const provedor = document.querySelector('#provedor');
const descripcion = document.querySelector('#descripcion');
const stockViejo = document.querySelector('#stockViejo');
const stock = document.querySelector('#stock');
const nuevoStock = document.querySelector('#nuevoStock');
const iva = document.querySelector('#iva');
const ganancia = document.querySelector('#ganancia');
const costo = document.querySelector('#costo');
const precio = document.querySelector('#precio');
const tarjetaPrecio = document.querySelector('#tarjetaPrecio');
const nuevoCosto = document.querySelector('#nuevoCosto');
const nuevoIva = document.querySelector('#nuevoIva')
const nuevaGanancia = document.querySelector('#nuevaGanancia')
const nuevoPrecio = document.querySelector('#nuevoPrecio');
const nuevoPrecioTarjeta = document.querySelector('#nuevoPrecioTarjeta');
const ticketPrecio = document.querySelector('#ticketPrecio');
const oferta = document.querySelector('#oferta');
const nuevaOferta = document.querySelector('#nuevaOferta');
const botonOferta = document.querySelector('#botonOferta');
const guardar = document.querySelector('.guardar');
const salir = document.querySelector('.salir');

let producto = {};

window.addEventListener('load', () => {
    ticketPrecio.checked = ImprecioTicketPrecio;
});

codigo.addEventListener('keypress',async e=>{
    if (e.key === "Enter") {
        producto = (await axios.get(`${URL}productos/${codigo.value}`)).data;
        if (producto !== "") {
            costo.value = producto.costo.toFixed(2);
            marca.value = producto.marca;
            provedor.value = producto.provedor;
            iva.value = producto.impuesto.toFixed(2);
            ganancia.value = producto.ganancia.toFixed(2);
            descripcion.value = producto.descripcion;
            stockViejo.value = producto.stock.toFixed(2);
            nuevoStock.value = producto.stock.toFixed(2);
            precio.value = producto.precio.toFixed(2);
            tarjetaPrecio.value = Math.round(producto.precio + producto.precio * descuentoEfectivo / 100).toFixed(2);
            oferta.value = producto.precioOferta?.toFixed(2);
            
            producto.oferta && botonOferta.click();
            provedor.focus();
        }else{
            await sweet.fire({
                title:"No Existe producto con ese codigo"
            });
            codigo.value = "";
        }
    }
});

provedor.addEventListener('keypress',e=>{
    apretarEnter(e,descripcion);
});

descripcion.addEventListener('keypress',e=>{
    apretarEnter(e,stock);
});

stock.addEventListener('keypress',e=>{
    if (e.key === "Enter" && stock.value !== "") {
        nuevoStock.value = (parseFloat(stockViejo.value) + parseFloat(stock.value)).toFixed(2);
    }else if(e.keyCode === 13 && stock.value === ""){
        nuevoSstock.value = (parseFloat(stockViejo.value) + parseFloat(stock.value)).toFixed(2);
    }
    apretarEnter(e,nuevoCosto);
});

nuevoCosto.addEventListener('keypress',e=>{
    if (e.key === "Enter" && nuevoCosto.value !== "") {
        nuevoCosto.value = parseFloat(nuevoCosto.value).toFixed(2)
    }else if(e.key === "Enter" && nuevoCosto.value === ""){
        nuevoCosto.value = parseFloat(costo.value).toFixed(2)
    };
    apretarEnter(e,nuevoIva)
});

nuevoIva.addEventListener('keypress',e=>{
        if(e.key === "Enter"){
            nuevoIva.value = nuevoIva.value === "" ? iva.value : nuevoIva.value;
        }
        apretarEnter(e,nuevaGanancia)
});

nuevaGanancia.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        nuevaGanancia.value = nuevaGanancia.value === "" ? ganancia.value : nuevaGanancia.value;
        const impuesto = parseFloat((parseFloat(nuevoCosto.value)*parseFloat(nuevoIva.value)/100).toFixed(2)) + parseFloat(nuevoCosto.value);
        nuevoPrecio.value = (parseFloat(( impuesto*parseFloat(nuevaGanancia.value)/100).toFixed(2)) + impuesto).toFixed(2);
        nuevoCosto.value = parseFloat(nuevoCosto.value).toFixed(2);
    }
    apretarEnter(e,nuevoPrecio);
});

nuevoPrecio.addEventListener('focus',e =>{
    nuevoPrecio.select();
});

nuevoPrecio.addEventListener('keypress',e=>{

    nuevoPrecioTarjeta.value = redondear(parseFloat(nuevoPrecio.value) + (parseFloat(nuevoPrecio.value) * descuentoEfectivo / 100),2);

    apretarEnter(e,nuevoPrecioTarjeta);
});

nuevoPrecioTarjeta.addEventListener('keypress',e=>{
    if (botonOferta.checked) {
        apretarEnter(e,nuevaOferta);
    }else{
        apretarEnter(e,guardar);
    }
});

nuevaOferta.addEventListener('keypress',e=>{
    apretarEnter(e,guardar);
});

guardar.addEventListener('click',async e=>{
    producto.provedor = provedor.value.trim().toUpperCase();
    producto.costo = nuevoCosto.value !== "" ? parseFloat(nuevoCosto.value) : producto.costo;
    producto.precio = nuevoPrecio.value !== "" ? parseFloat(nuevoPrecio.value) : producto.precio;
    producto.ganancia = parseFloat(nuevaGanancia.value);
    producto.impuesto = nuevoIva.value !== "" ? parseFloat(nuevoIva.value) : producto.impuesto;
    producto.stock = parseFloat(nuevoStock.value);
    producto.descripcion = descripcion.value !== "" ? descripcion.value.toUpperCase() : producto.descripcion;
    producto.oferta = botonOferta.checked ? true : false;
    producto.precioOferta = nuevaOferta.value !== "" ? parseFloat(nuevaOferta.value) : producto.precioOferta;

    const {mensaje,estado} = (await axios.put(`${URL}productos/${producto._id}`,producto)).data;

    await sweet.fire({
        title:mensaje
    });

    imprimirTicketPrecio(producto.descripcion,parseFloat(producto.precio),ticketPrecio.checked,);

    await agregarProductoModificadoParaTicket(producto);

    if (botonOferta.checked) {
        ipcRenderer.send('imprimir-oferta',producto);
    }

    if (estado) {
        window.close();
    }
});

botonOferta.addEventListener('click',e => {
    document.querySelector('.oferta').classList.toggle('none');
    document.querySelector('.nuevaOferta').classList.toggle('none');
    oferta.parentElement.parentElement.style.gridTemplateColumns = oferta.parentElement.classList.contains('none') ?  '1fr 1fr 1fr' :  '1fr 1fr 1fr 1fr';
});

salir.addEventListener('click',e=>{
    window.close();
});

document.addEventListener('keyup',e=>{
    if (e.keyCode === 27) {
        window.close();
    }else if(e.keyCode === 117){
        ticketPrecio.checked = !ticketPrecio.checked;
    }
});


nuevaOferta.addEventListener('focus',e=>{
    nuevaOferta.select();
});