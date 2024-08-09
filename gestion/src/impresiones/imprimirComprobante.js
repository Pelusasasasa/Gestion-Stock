const { ipcRenderer } = require('electron');
const axios = require('axios');
require('dotenv').config();

const { redondear } = require('../helpers');

const URL = process.env.GESTIONURL;

const numero = document.getElementById('numero');
const date = document.getElementById('fecha');
const tipoPago = document.getElementById('tipoPago');
const vendedor = document.getElementById('vendedor');
const subTotal = document.getElementById('subtotal');
const descuento = document.getElementById('descuento');
const total = document.getElementById('total');

const cliente = document.getElementById('cliente');
const idCliente = document.getElementById('idCliente');
const cuit = document.getElementById('cuit');
const direccion = document.getElementById('direccion');
const localidad = document.getElementById('localidad');
const cond_iva = document.getElementById('cond_iva');

const tbody = document.querySelector('tbody');

let dolar;

window.addEventListener('load',e=>{
    ipcRenderer.on('imprimir',async(e,args)=>{
        let datosClientes = JSON.parse(args)[2];
        let datosVenta = JSON.parse(args)[1];
        let movimientos = JSON.parse(args)[3];
        let auxDolar = JSON.parse(args)[4];
        
        if ((auxDolar)) {
            dolar = (await axios.get(`${URL}numero/Dolar`)).data;
        };
        
        await ponerDatosVenta(datosVenta);
        await ponerDatosClientes(datosClientes);
        await ponerDatosArticulos(movimientos);

        ipcRenderer.send('imprimir-ventana',JSON.parse(args)[0]);
    });
});

const ponerDatosVenta = (datos)=>{
    const now = new Date(datos.fecha);
    const aux = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();
    const fecha = aux.slice(0,10).split('-',3);
    const hora = aux.slice(11,19).split(':',3);
    numero.innerText = datos.numero.toString().padStart(8,'0');
    date.innerText = `${fecha[2]}/${fecha[1]}/${fecha[0]} - ${hora[0]}:${hora[1]}:${hora[2]}`;
    tipoPago.innerText = datos.tipo_venta;
    vendedor.innerText = datos.vendedor;

    subTotal.innerText = dolar ? ((datos.precio + datos.descuento) / dolar).toFixed(2) : (datos.precio + datos.descuento).toFixed(2);
    descuento.innerText = datos.descuento.toFixed(2);
    total.innerText = dolar ? (datos.precio / dolar).toFixed(2) : datos.precio.toFixed(2);
};

const ponerDatosClientes = (datos)=>{
    cliente.innerHTML = datos.nombre
    idCliente.innerHTML = datos._id.toString().padStart(4,'0');
    cuit.innerHTML = datos.cuit;
    direccion.innerHTML = datos.direccion;
    localidad.innerHTML = datos.localidad;
    cond_iva.innerHTML = datos.condicionIva.toUpperCase();
};

const ponerDatosArticulos = (datos)=>{
    datos.forEach(movimiento => {

        if (dolar) {
            movimiento.precio = movimiento.precio / dolar;
        }

        const tr = document.createElement('tr');

        const tdCantidad = document.createElement('td');
        const tdCodigo = document.createElement('td');
        const tdDescripcion = document.createElement('td');
        const tdPrecio = document.createElement('td');
        const tdIva = document.createElement('td');
        const tdTotal = document.createElement('td');

        tdCantidad.innerText = movimiento.unidad === "horas" ? "" : movimiento.cantidad.toFixed(2);
        tdCodigo.innerText = movimiento.codProd ?  movimiento.codProd : "" ;
        tdDescripcion.innerText = movimiento.producto;
        tdIva.innerText = movimiento.iva.toFixed(2);
        tdPrecio.innerText = movimiento.unidad === "horas" ? "" : movimiento.precio.toFixed(2);
        tdTotal.innerText = redondear(movimiento.cantidad * movimiento.precio,2);

        tr.appendChild(tdCantidad);
        tr.appendChild(tdCodigo);
        tr.appendChild(tdDescripcion);
        tr.appendChild(tdPrecio);
        tr.appendChild(tdIva);
        tr.appendChild(tdTotal);

        tbody.appendChild(tr);
    });
};