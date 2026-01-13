const { cerrarVentana, apretarEnter, saltarEnter } = require('../helpers');
const sweet = require('sweetalert2');

const { default: validarCuit } = require('cuit-validator');
const { ipcRenderer } = require('electron');
const { getUltimoId, postCliente } = require('../services/clientesService');

const codigo = document.querySelector('#codigo');
const nombre = document.querySelector('#nombre');
const cuit = document.querySelector('#cuit');
const localidad = document.querySelector('#localidad');
const telefono = document.querySelector('#telefono');
const direccion = document.querySelector('#direccion');
const condicionIva = document.querySelector('#condicion');
const condicionFacturacion = document.querySelector('#condicionFacturacion');
const tipoCuenta = document.getElementById('tipoCuenta');
const observaciones = document.querySelector('#observaciones');

const agregar = document.querySelector('.agregar');
const salir = document.querySelector('.salir');

let vendedor;

window.addEventListener('load', async (e) => {
  const id = await getUltimoId();
  codigo.value = id;
});

ipcRenderer.on('informacion', (e, args) => {
  vendedor = args.vendedor;
});

agregar.addEventListener('click', async (e) => {
  if (tipoCuenta.value === '') return await sweet.fire('El campo tipo de cuenta es obligatorio', 'No se pudo cargar el cliente', 'error');
  if (nombre.value === '') return await sweet.fire('El campo nombre es obligatorio', 'No se pudo cargar el cliente', 'error');

  const cliente = {};
  cliente._id = codigo.value;
  cliente.nombre = nombre.value.trim().toUpperCase();
  cliente.cuit = cuit.value;
  cliente.localidad = localidad.value.trim().toUpperCase();
  cliente.telefono = telefono.value.trim();
  cliente.direccion = direccion.value.trim().toUpperCase();
  cliente.condicionIva = condicionIva.value;
  cliente.condicionFacturacion = condicionFacturacion.value;
  cliente.tipoCuenta = tipoCuenta.value;
  cliente.observaciones = observaciones.value.trim().toUpperCase();
  cliente.vendedor = vendedor;

  const { ok, cliente: newCliente } = await postCliente(cliente);

  if (ok) {
    await sweet.fire(`Cliente ${newCliente.nombre} Agregado`, 'Cliente agregado correctamente', 'success');
    await ipcRenderer.send('informacion-a-ventana-principal', cliente);
    window.close();
  }
});

nombre.addEventListener('keypress', (e) => {
  saltarEnter(e, cuit);
});

cuit.addEventListener('blur', async (e) => {
  if (cuit.value.length === 11) {
    if (!validarCuit(cuit.value)) {
      await sweet.fire({
        title: 'El cuit no es correcto',
      });
      cuit.value = '';
      cuit.focus();
    }
  }
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
  saltarEnter(e, agregar);
});

document.addEventListener('keydown', (e) => {
  cerrarVentana(e);
});

salir.addEventListener('click', (e) => {
  window.close();
});
