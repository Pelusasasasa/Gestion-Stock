const { ipcRenderer } = require("electron");
const sweet = require('sweetalert2');

const axios = require('axios');
require("dotenv").config();
const URL = process.env.URL;

const archivo = require('./configuracion.json');

ipcRenderer.send('poner-cierre')

const cajaTexto = document.querySelector('.cajaTexto');

window.addEventListener('load',e=>{
    cajaTexto.innerHTML = archivo.caja;  
});
//Al tocar el atajo de teclado, abrimos ventanas
document.addEventListener('keyup',e=>{
    if (e.keyCode === 112) {
        location.href = "./venta/index.html"
    }else if(e.keyCode === 113){
        const opciones = {
            path:"clientes/agregarCliente.html",
            ancho:1200,
            altura:900
        }
        ipcRenderer.send('abrir-ventana',opciones);
    }else if(e.keyCode === 114){
        const opciones = {
            path:"productos/cambio.html",
            ancho:500,
            altura:500
        };
        ipcRenderer.send('abrir-ventana',opciones);
    }else if(e.keyCode === 116){
        const opciones = {
            path:"gastos/gastos.html",
            ancho:500,
            altura:400
        }
        ipcRenderer.send('abrir-ventana',opciones);
    }
})

const ventas = document.querySelector('.ventas');
ventas.addEventListener('click',e=>{
    location.href = "./venta/index.html";
    ipcRenderer.send('sacar-cierre');
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
recibo.addEventListener('click',e=>{
    location.href = "./recibo/recibo.html";
});

const notaCredito = document.querySelector('.notaCredito');
notaCredito.addEventListener('click',e=>{
    location.href = "./venta/index.html?tipoFactura=notaCredito";
    ipcRenderer.send('sacar-cierre');
});

//ponemos un numero para la venta y luego mandamos a imprimirla
ipcRenderer.on('poner-numero',async (e,args)=>{
    await sweet.fire({
        html:`
            <section id=imprimirVenta>
                <main>
                    <label htmlFor="tipo">Tipo</label>
                    <select name="tipo" id="tipo">
                        <option value="CD">Contado - ${(await axios.get(`${URL}numero`)).data.Contado}</option>
                        <option value="CC">Cuenta Corriente - ${(await axios.get(`${URL}numero`)).data["Cuenta Corriente"]}</option>
                    </select>
                </main>
                <main>
                    <label htmlFor="numero">Numero de Venta</label>
                    <input type="text" name="numero" id="numero" />
                </main>

            </section>
        `,
        showCancelButton:true,
        confirmButtonText:"Aceptar"
    }).then(async ({isConfirmed})=>{
        const tipo = document.getElementById('tipo');
        const numero = document.getElementById('numero');
        if (isConfirmed) {
            const venta = (await axios.get(`${URL}ventas/id/${numero.value}/${tipo.value}`)).data;
            const cliente = (await axios.get(`${URL}clientes/id/${venta.idCliente}`)).data;
            const movimientos = (await axios.get(`${URL}movimiento/${numero.value}/${tipo.value}`)).data;
            ipcRenderer.send('imprimir',[venta,cliente,movimientos])
        }
    })
})