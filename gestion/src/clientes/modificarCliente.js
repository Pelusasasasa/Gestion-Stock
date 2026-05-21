const sweet = require('sweetalert2');
const { ipcRenderer } = require('electron');
const { cerrarVentana, apretarEnter, saltarEnter } = require('../helpers');

const axios = require('axios');
const { getClienteById, putCliente } = require('../services/clientesService');
require('dotenv').config();
const url = process.env.GESTIONURL;

let vendedor;

ipcRenderer.on('informacion', (e, { informacion, vendedor: vende }) => {
  ponerInputs(informacion);
  vendedor = vende;
});

const codigo = document.querySelector('#codigo');
const nombre = document.querySelector('#nombre');
const cuit = document.querySelector('#cuit');
const localidad = document.querySelector('#localidad');
const telefono = document.querySelector('#telefono');
const direccion = document.querySelector('#direccion');
const condicionFacturacion = document.querySelector('#condicionFacturacion');
const condicionIva = document.querySelector('#condicion');
const tipoCuenta = document.querySelector('#tipoCuenta');
const observaciones = document.querySelector('#observaciones');

const modificar = document.querySelector('.modificar');
const salir = document.querySelector('.salir');

const ponerInputs = async (id) => {
  codigo.value = id;
  let cliente = {};

  cliente = await getClienteById(id);

  nombre.value = cliente.nombre;
  cuit.value = cliente.cuit ? cliente.cuit : '';
  localidad.value = cliente.localidad;
  direccion.value = cliente.direccion;
  telefono.value = cliente.telefono;
  condicionIva.value = cliente.condicionIva ? cliente.condicionIva : 'Consumidor Final';
  condicionFacturacion.value = cliente.condicionFacturacion;
  tipoCuenta.value = cliente.tipoCuenta;
  observaciones.value = cliente.observaciones;
};

modificar.addEventListener('click', async (e) => {
  if (tipoCuenta.value === '') return await sweet.fire('El campo tipo de cuenta es obligatorio', 'No se pudo cargar el cliente', 'error');
  if (nombre.value === '') return await sweet.fire('El campo nombre es obligatorio', 'No se pudo cargar el cliente', 'error');

  const cliente = {};
  cliente._id = codigo.value;
  cliente.nombre = nombre.value.toUpperCase();
  cliente.cuit = cuit.value;
  cliente.localidad = localidad.value.toUpperCase();
  cliente.telefono = telefono.value;
  cliente.direccion = direccion.value.toUpperCase();
  cliente.condicionFacturacion = condicionFacturacion.value;
  cliente.condicionIva = condicionIva.value;
  cliente.tipoCuenta = tipoCuenta.value;
  cliente.observaciones = observaciones.value.toUpperCase();
  cliente.vendedor = vendedor;

  const { cliente: clienteModificado } = await putCliente(cliente._id, cliente, vendedor);

  if (clienteModificado) {
    await sweet.fire('Cliente modificado', `Se modifico el cliente ${clienteModificado.nombre} correctamente`, 'success');
    ipcRenderer.send('enviar-ventana-principal', clienteModificado);
    window.close();
  }
});

nombre.addEventListener('keypress', (e) => {
  saltarEnter(e, cuit);
});

cuit.addEventListener('keypress', (e) => {
  saltarEnter(e, localidad);
});

localidad.addEventListener('keypress', (e) => {
  saltarEnter(e, telefono);
});

telefono.addEventListener('keypress', (e) => {
  saltarEnter(e, direccion);
});

direccion.addEventListener('keypress', (e) => {
  saltarEnter(e, condicionFacturacion);
});

condicionFacturacion.addEventListener('keypress', (e) => {
  e.preventDefault();
  saltarEnter(e, condicionIva);
});

condicionIva.addEventListener('keypress', (e) => {
  e.preventDefault();
  saltarEnter(e, tipoCuenta);
});

tipoCuenta.addEventListener('keypress', (e) => {
  e.preventDefault();
  saltarEnter(e, observaciones);
});

observaciones.addEventListener('keypress', (e) => {
  saltarEnter(e, modificar);
});

nombre.addEventListener('focus', (e) => {
  nombre.select();
});

localidad.addEventListener('focus', (e) => {
  localidad.select();
});

telefono.addEventListener('focus', (e) => {
  telefono.select();
});

direccion.addEventListener('focus', (e) => {
  direccion.select();
});

cuit.addEventListener('focus', (e) => {
  cuit.select();
});

observaciones.addEventListener('focus', (e) => {
  observaciones.select();
});

document.addEventListener('keydown', (e) => {
  cerrarVentana(e);
});

salir.addEventListener('click', (e) => {
  window.close();
});
