const { ipcRenderer } = require('electron');
const axios = require('axios');
require('dotenv').config();

const { redondear } = require('../helpers');

const url = process.env.GESTIONURL;

const numero = document.getElementById('numero');
const date = document.getElementById('fecha');
const tipoPago = document.getElementById('tipoPago');
const vendedor = document.getElementById('vendedor');
const condicion = document.getElementById('condicion');
const subTotal = document.getElementById('subtotal');
const descuento = document.getElementById('descuento');
const total = document.getElementById('total');

const cliente = document.getElementById('cliente');
const idCliente = document.getElementById('idCliente');
const dolar = document.getElementById('dolar');
const cuit = document.getElementById('cuit');
const direccion = document.getElementById('direccion');
const localidad = document.getElementById('localidad');
const cond_iva = document.getElementById('cond_iva');

const tbody = document.querySelector('tbody');

window.addEventListener('load', (e) => {
  ipcRenderer.on('imprimir', async (e, args) => {
    let datosClientes = JSON.parse(args)[2];
    let datosVenta = JSON.parse(args)[1];
    let movimientos = JSON.parse(args)[3];
    let auxDolar = JSON.parse(args)[4];
    await ponerDatosVenta(datosVenta, auxDolar);
    await ponerDatosClientes(datosClientes);
    await ponerDatosArticulos(movimientos, auxDolar, datosVenta);

    ipcRenderer.send('imprimir-ventana', JSON.parse(args)[0]);
  });
});

const ponerDatosVenta = (datos, auxDolar) => {
  const fecha = new Date(datos.fecha);
  const fechaUTC3 = new Date(fecha.getTime() - 3 * 60 * 60 * 1000).toISOString();
  const fechaParseada = `${fechaUTC3.slice(0, 10).split('-', 3).reverse().join('/')} ${fechaUTC3.slice(11, 19)}`;

  if (datos.condicion === 'INSTALADOR') {
    dolar.innerText = datos?.dolar?.toFixed(2);
  } else {
    dolar.parentElement.style.display = 'none';
  }

  numero.innerText = datos.numero.toString().padStart(8, '0');
  date.innerText = fechaParseada;
  tipoPago.innerText = datos.tipoVenta ?? datos.tipo_venta;
  vendedor.innerText = datos?.vendedor?.nombre ?? '';
  condicion.innerText = datos.condicion === 'INSTALADOR' ? 'Preferencial' : '';

  if (datos.tipo_venta !== 'RT' && datos.tipoVenta !== 'RT') {
    subTotal.innerText = auxDolar ? ((datos.precio - datos.descuento) / parseFloat(datos.dolar)).toFixed(2) : (datos.precio - datos.descuento).toFixed(2);
    descuento.innerText = datos?.descuento?.toFixed(2);
    total.innerText = auxDolar ? (datos.precio / parseFloat(datos.dolar)).toFixed(2) : datos.precio.toFixed(2);
  }
};

const ponerDatosClientes = (datos) => {
  cliente.innerHTML = datos.nombre;
  idCliente.innerHTML = datos._id.toString().padStart(4, '0');
  cuit.innerHTML = datos.cuit;
  direccion.innerHTML = datos.direccion;
  localidad.innerHTML = datos.localidad;
  cond_iva.innerHTML = datos.condicionIva.toUpperCase();
};

const ponerDatosArticulos = (datos, auxDolar, venta) => {
  datos.forEach((movimiento) => {
    if (auxDolar) {
      movimiento.precio = movimiento.precio / parseFloat(venta.dolar);
    }

    const tr = document.createElement('tr');

    const tdCantidad = document.createElement('td');
    const tdCodigo = document.createElement('td');
    const tdDescripcion = document.createElement('td');
    const tdPrecio = document.createElement('td');
    const tdIva = document.createElement('td');
    const tdTotal = document.createElement('td');

    tdCantidad.innerText = movimiento.unidad === 'horas' ? '' : movimiento.cantidad.toFixed(2);
    tdCodigo.innerText = movimiento.codProd ? movimiento.codProd : '';
    tdDescripcion.innerText = movimiento.producto;
    tdPrecio.innerText = movimiento.tipo_venta !== 'RT' ? (movimiento.unidad === 'horas' ? '' : movimiento.precio.toFixed(2)) : '';
    tdIva.innerText = movimiento.tipo_venta === 'RT' ? '' : movimiento.iva.toFixed(2);
    tdTotal.innerText = movimiento.tipo_venta === 'RT' ? '' : redondear(movimiento.cantidad * movimiento.precio, 2);

    tr.appendChild(tdCantidad);
    tr.appendChild(tdCodigo);
    tr.appendChild(tdDescripcion);
    tr.appendChild(tdPrecio);
    tr.appendChild(tdIva);
    tr.appendChild(tdTotal);

    tbody.appendChild(tr);
  });
};
