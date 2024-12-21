const axios = require('axios');
const { ipcRenderer } = require("electron");
const fs = require('fs');
const path = require('path');
const sweet = require('sweetalert2');

require("dotenv").config();

const URL = process.env.GESTIONURL;

const archivo = require('./configuracion.json');
const filePath = path.join(__dirname, 'config.json');
let modulos = '';

const moduloCreate = {
  "ventas": true,
  "clientes": true,
  "productos": true,
  "caja": true,
  "movimientos": true,
  "recibos": true,
  "consultas": true,
  "remitos": true,
  "gastos": true
}

try {
    modulos = require('./config.json');
} catch (error) {
    fs.writeFileSync(filePath, JSON.stringify(moduloCreate), 'utf-8');
    location.reload();
}


ipcRenderer.send('poner-cierre');

const {abrirVentana, ponerNumero, cargarVendedor, verificarUsuarios} = require('./helpers');

const ventas = document.querySelector('.ventas');
const clientes = document.querySelector('.clientes');
const caja = document.querySelector('.caja');
const productos = document.querySelector('.productos');
const movimiento = document.querySelector('.movimiento');
const consulta = document.querySelector('.consulta');
const recibo = document.querySelector('.recibo');
const remitos = document.querySelector('.remitos');
const notaCredito = document.querySelector('.notaCredito');

const atajoVentas = document.getElementById('atajoVentas');
const atajoAgregarCliente = document.getElementById('atajoAgregarCliente');
const atajoAgregarProducto = document.getElementById('atajoAgregarProducto');
const atajoModificarProducto = document.getElementById('atajoModificarProducto');
const atajoNotaCredito = document.getElementById('atajoNotaCredito');

let verVendedores;

window.addEventListener('load',async e=>{

    await cargarPrimerCliente();

    const vendedores = (await axios.get(`${URL}vendedores`)).data;
    if (!vendedores.find(vendedor => vendedor.permiso === 0)) {
        sweet.fire({
            title:"Cargar un Vendedor con permiso en 0 inicial",
            html: await cargarVendedor(),
            confirmButtonText:"Aceptar",
            showCancelButton:true
        }).then(async({isConfirmed})=>{
            if (isConfirmed) {
                const nuevoVendedor = {};
                nuevoVendedor.codigo = document.getElementById('codigo').value;
                nuevoVendedor.nombre = document.getElementById('nombre').value.toUpperCase();
                nuevoVendedor.permiso = document.getElementById('permisos').value;
                try {
                    await axios.post(`${URL}vendedores`,nuevoVendedor);
                } catch (error) {
                    sweet.fire({
                        title:"no se pudo cargar el vendedor"
                    })
                }
            }else{
                location.reload();
            }
        })
    };

    if(modulos.ventas){
        ventas.classList.remove('hidden');
        atajoVentas.classList.remove('hidden');
        atajoNotaCredito.classList.remove('hidden');
    };
    if(modulos.clientes){
        clientes.classList.remove('hidden');
        atajoAgregarCliente.classList.remove('hidden');
    };
    if(modulos.productos){
        productos.classList.remove('hidden');
        atajoAgregarProducto.classList.remove('hidden');
        atajoCambioProducto.classList.remove('hidden');
    };
    if(modulos.caja){
        caja.classList.remove('hidden');
    };
    if(modulos.movimientos){
        movimiento.classList.remove('hidden');
    };
    if(modulos.consultas){
        consulta.classList.remove('hidden');
    };
    if(modulos.recibos){
        recibo.classList.remove('hidden');
    };
    if(modulos.remitos){
        remitos.classList.remove('hidden');
    };
});

//Al tocar el atajo de teclado, abrimos ventanas
document.addEventListener('keyup',async e=>{
    if (e.keyCode === 112) {
        ventas.click()
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
        const usuario = await verificarUsuarios();

        const opciones = {
            path:"gastos/gastos.html",
            ancho:500,
            altura:700,
            info: usuario.nombre
        };
        
        if (usuario.permiso === 2) {
            await sweet.fire({
                title: "No tienes permisos para acceder a gastos"
            })
        }else if(!usuario){
            await sweet.fire({
                title:"Contraseña incorrecta"
            });
        }else{
            ipcRenderer.send('abrir-ventana',opciones);
        }
    }else if(e.keyCode === 117){
        location.href = "./venta/index.html?tipoFactura=notaCredito";
        ipcRenderer.send('sacar-cierre');
    }
});


ventas.addEventListener('click',async e=>{
    if (verVendedores) {
        const vendedor = await verificarUsuarios();
        console.log(vendedor)
        if (vendedor) {
            location.href = `./venta/index.html?vendedor=${vendedor.nombre}`;
            ipcRenderer.send('sacar-cierre');
        }else if(vendedor === ""){
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

clientes.addEventListener('click',async e=>{
    const vendedor = await verificarUsuarios();
    
    if (vendedor) {
        location.href = `./clientes/clientes.html?vendedor=${vendedor.nombre}&permiso=${vendedor.permiso}`;
        ipcRenderer.send('sacar-cierre');
    }else if(vendedor === ""){
        await sweet.fire({
            title:"Contraseña incorrecta"
        });
        clientes.click();
    };
    
    
});

productos.addEventListener('click',async e=>{
    if (verVendedores) {
        const vendedor = await verificarUsuarios();
        if (vendedor) {
            location.href = `./productos/productos.html?vendedor=${vendedor.nombre}&permiso=${vendedor.permiso}`;
            ipcRenderer.send('sacar-cierre');
        }else if(vendedor === ""){
            await sweet.fire({
                title:"Contraseña incorrecta"
            })
            productos.click()
        }
    }else{
        location.href = `./productos/productos.html`;
        ipcRenderer.send('sacar-cierre');
    }
});

caja.addEventListener('click',async e=>{
        const vendedor = await verificarUsuarios();

        if (vendedor) {

            if (vendedor.permiso !== 0) {
                await sweet.fire({
                    title:"No tiene Permisos para ingresar a Caja"
                });
            }else{
                location.href = `./caja/caja.html?vendedor=${vendedor.nombre}&permiso=${vendedor.permiso}`;    
            }
        }else if(vendedor === ""){

            await sweet.fire({
                title:"Contraseña incorrecta"
            });
            caja.click();

        };
});

movimiento.addEventListener('click',e=>{
    location.href = "./movimiento/movimiento.html";
});

consulta.addEventListener('click',e=>{
    location.href = "./consultarCuenta/consultarCuenta.html";
});

recibo.addEventListener('click',async e=>{
    if (verVendedores) {
        const vendedor = await verificarUsuarios();
        if (vendedor) {
            location.href = `./recibo/recibo.html?vendedor=${vendedor.nombre}`;
            ipcRenderer.send('sacar-cierre');
        }else if(vendedor === ""){
            await sweet.fire({
                title:"Contraseña incorrecta"
            })
            clientes.click()
        }
    }else{
        location.href = "./recibo/recibo.html";
        ipcRenderer.send('sacar-cierre');
    }
});

remitos.addEventListener('click', e => {
    location.href = './remitos/remitos.html';
});

// notaCredito.addEventListener('click',e=>{
//     location.href = "./venta/index.html?tipoFactura=notaCredito";
//     ipcRenderer.send('sacar-cierre');
// });

//ponemos un numero para la venta y luego mandamos a imprimirla
ipcRenderer.on('poner-numero',async (e,args)=>{
    ponerNumero();
});

ipcRenderer.on('libroIva',async (e,args)=>{
    location.href = "./libroIva/libroIva.html";
});

const cargarPrimerCliente = async()=>{
    const id = (await axios.get(`${URL}clientes`)).data;
    if (id === 1) {
        const cliente = {};
        cliente._id = 1;
        cliente.nombre = "Consumidor Final";
        cliente.telefono = "";
        cliente.direccion = "CHAJARI";
        cliente.localidad = "CHAJARI";
        cliente.cuit = "00000000";
        cliente.condicionFacturacion = 2;

        try {
            await axios.post(`${URL}clientes`,cliente);
        } catch (error) {
            console.log(error);
            await sweet.fire({
                title:"No se pudo cargar el primer cliene, cargarlo normal"
            })
        }
    }
};


ipcRenderer.on('verificarUsuario', async(e,args) => {
    let path = '';
    const {permiso,nombre} = await verificarUsuarios();
    
    if (args === 'numeros') {
        path = `numeros/numeros.html`
    }else if(args === 'infoVendedores'){
        path = 'vendedores/vendedores.html'
    }else if(args === 'movVendedores'){
        path = 'vendedores/movimientoVendedores.html';
    };

    if (permiso === 0) {
        ipcRenderer.send('abrir-ventana',{
            path: path,
            ancho:1000,
            altura:700,
            info: nombre
        });
    }else if(permiso === 1 && args === 'numeros'){

        ipcRenderer.send('abrir-ventana',{
            path: path,
            ancho:1000,
            altura:700,
            info: nombre
        });

    }else{
        await sweet.fire({
            title: "No tiene Permisos"
        })
    }
});