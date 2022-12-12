const { ipcRenderer } = require("electron");
const sweet = require('sweetalert2');

const axios = require('axios');
require("dotenv").config();
const URL = process.env.URL;

const archivo = require('./configuracion.json');

ipcRenderer.send('poner-cierre');

const {abrirVentana, ponerNumero} = require('./helpers');

let verVendedores;

window.addEventListener('load',e=>{
    verVendedores = archivo.vendedores; 
});
//Al tocar el atajo de teclado, abrimos ventanas
document.addEventListener('keyup',async e=>{
    if (e.keyCode === 112) {
        if (verVendedores) {
            const vendedor = await verificarUsuarios();
            if (vendedor) {
                location.href = `./venta/index.html?vendedor=${vendedor.nombre}`;
                ipcRenderer.send('sacar-cierre');
            }else{
                await sweet.fire({
                    title:"Contraseña incorrecta"
                })
                ventas.click()
            }
        }else{
            location.href = "./venta/index.html";
            ipcRenderer.send('sacar-cierre');
        }
    }else if(e.keyCode === 113){
        const opciones = {
            path:"clientes/agregarCliente.html",
            ancho:1200,
            altura:500
        }
        ipcRenderer.send('abrir-ventana',opciones);
    }else if(e.keyCode === 114){
        const opciones = {
            path:"productos/agregarProducto.html",
            ancho:1200,
            altura:550
        };
        ipcRenderer.send('abrir-ventana',opciones);
    }else if(e.keyCode === 115){
        const opciones = {
            path: "productos/cambio.html",
            ancho: 1000,
            altura:550
        }
        ipcRenderer.send('abrir-ventana',opciones)
    }else if(e.keyCode === 116){
        const opciones = {
            path:"gastos/gastos.html",
            ancho:500,
            altura:400
        }
        ipcRenderer.send('abrir-ventana',opciones);
    }
});

const verificarUsuarios = async()=>{
    let retorno
    await sweet.fire({
        title: "Contraseña",
        input:"text",
        confirmButtonText:"Aceptar",
        showCancelButton:true
    }).then(async({isConfirmed,value})=>{
        if (isConfirmed) {
            retorno = ((await axios.get(`${URL}vendedores/id/${value}`)).data);
        }
    });
    return retorno
}

const ventas = document.querySelector('.ventas');
ventas.addEventListener('click',async e=>{
    if (verVendedores) {
        const vendedor = await verificarUsuarios();
        if (vendedor) {
            location.href = `./venta/index.html?vendedor=${vendedor.nombre}`;
            ipcRenderer.send('sacar-cierre');
        }else if(vendedor === null){
            await sweet.fire({
                title:"Contraseña incorrecta"
            })
            ventas.click()
        }
    }else{
        location.href = "./venta/index.html";
        ipcRenderer.send('sacar-cierre');
    }
});

const productos = document.querySelector('.productos');
productos.addEventListener('click',e=>{
    location.href = "./productos/productos.html";
    ipcRenderer.send('sacar-cierre');
});

const clientes = document.querySelector('.clientes');
clientes.addEventListener('click',e=>{
    location.href = "./clientes/clientes.html";
    ipcRenderer.send('sacar-cierre');
});

const caja = document.querySelector('.caja');
caja.addEventListener('click',e=>{
    location.href = "./caja/caja.html";
});

const movimiento = document.querySelector('.movimiento');
movimiento.addEventListener('click',e=>{
    location.href = "./movimiento/movimiento.html";
});

const consulta = document.querySelector('.consulta');
consulta.addEventListener('click',e=>{
    location.href = "./consultarCuenta/consultarCuenta.html";
});

const recibo = document.querySelector('.recibo');
recibo.addEventListener('click',async e=>{
    if (verVendedores) {
        const vendedor = await verificarUsuarios();
        if (vendedor) {
            location.href = `./recibo/recibo.html?vendedor=${vendedor.nombre}`;
            ipcRenderer.send('sacar-cierre');
        }else{
            await sweet.fire({
                title:"Contraseña incorrecta"
            })
            recibo.click();
        }
    }else{
        location.href = "./recibo/recibo.html";
        ipcRenderer.send('sacar-cierre');
    }
});

const notaCredito = document.querySelector('.notaCredito');
notaCredito.addEventListener('click',e=>{
    location.href = "./venta/index.html?tipoFactura=notaCredito";
    ipcRenderer.send('sacar-cierre');
});

//ponemos un numero para la venta y luego mandamos a imprimirla
ipcRenderer.on('poner-numero',async (e,args)=>{
    ponerNumero();
})