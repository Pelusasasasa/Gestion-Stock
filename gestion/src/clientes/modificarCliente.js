const sweet = require('sweetalert2');
const { ipcRenderer } = require('electron');
const { cerrarVentana, apretarEnter } = require('../helpers');

const axios = require('axios');
require('dotenv').config();
const URL = process.env.GESTIONURL;

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
  try {
    const { data } = await axios.get(`${URL}clientes/id/${id}`);
    if (data.ok) {
      cliente = data.cliente;
    } else {
      await sweet.fire('Error al obtener el cliente', data?.msg, 'error');
    }
  } catch (error) {
    console.log(error);
    await sweet.fire('Error al obtener el cliente', error?.response?.data?.msg, 'error');
  }

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
  try {
    const { data } = await axios.put(`${URL}clientes/id/${cliente._id}`, cliente);

    if (data.ok) {
      await sweet.fire('Cliente modificado', `Se modifico el cliente ${data.cliente.nombre} correctamente`, 'success');
      ipcRenderer.send('enviar-ventana-principal', cliente);
      window.close();
    } else {
      await sweet.fire('No se pudo modificar el cliente', data?.msg, 'error');
    }
  } catch (error) {
    console.log(error);
    await sweet.fire('No se pudo modificar el cliente', error.response?.data?.msg, 'error');
  }
});

nombre.addEventListener('keypress', (e) => {
  apretarEnter(e, cuit);
});

cuit.addEventListener('keypress', (e) => {
  apretarEnter(e, localidad);
});

localidad.addEventListener('keypress', (e) => {
  apretarEnter(e, telefono);
});

telefono.addEventListener('keypress', (e) => {
  apretarEnter(e, direccion);
});

direccion.addEventListener('keypress', (e) => {
  apretarEnter(e, condicionFacturacion);
});

condicionFacturacion.addEventListener('keypress', (e) => {
  e.preventDefault();
  apretarEnter(e, condicionIva);
});

condicionIva.addEventListener('keypress', (e) => {
  e.preventDefault();
  apretarEnter(e, tipoCuenta);
});

tipoCuenta.addEventListener('keypress', (e) => {
  e.preventDefault();
  apretarEnter(e, observaciones);
});

observaciones.addEventListener('keypress', (e) => {
  apretarEnter(e, modificar);
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
