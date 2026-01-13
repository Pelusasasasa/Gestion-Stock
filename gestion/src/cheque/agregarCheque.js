const Swal = require('sweetalert2');
const { ipcRenderer } = require('electron');
const { postCheque } = require('../services/chequeService');
const { saltarEnter } = require('../helpers');

const fecha = document.getElementById('fecha');
const numero = document.getElementById('numero');
const banco = document.getElementById('banco');
const importe = document.getElementById('importe');
const fecha_cheque = document.getElementById('fecha_cheque');
const entregado_por = document.getElementById('entregado_por');
const entregado_a = document.getElementById('entregado_a');
const domicilio = document.getElementById('domicilio');
const telefono = document.getElementById('telefono');
const observaciones = document.getElementById('observaciones');

const cancelar = document.getElementById('cancelar');
const agregar = document.getElementById('agregar');
let informacion = '';
let id;

ipcRenderer.on('informacion', (e, args) => {
  informacion = args;
  const [venta, cliente] = JSON.parse(informacion.informacion);

  fecha.value = venta.fecha.slice(0, 10);
  importe.value = venta.precio.toFixed(2);
  entregado_por.value = cliente.nombre;
  id = venta._id;
});

const guardar = async () => {
  if (!(await validarDatos())) return;

  const cheque = {};
  cheque.f_recibido = fecha.value;
  cheque.numero = numero.value;
  cheque.banco = banco.value;
  cheque.importe = importe.value;
  cheque.f_cheque = fecha_cheque.value;
  cheque.ent_por = entregado_por.value;
  cheque.ent_a = entregado_a.value;
  cheque.domicilio = domicilio.value;
  cheque.telefono = telefono.value;
  cheque.observacion = observaciones.value;
  cheque.comprobanteId = id;

  const data = await postCheque(cheque);

  const { isConfirmed } = await Swal.fire({
    title: 'Agregar otro cheque',
    showCancelButton: true,
    confirmButtonText: 'Aceptar',
  });

  if (isConfirmed) {
    location.reload();
  } else {
    if (data.ok) {
      ipcRenderer.send('enviar-ventana-principal', informacion);
      window.close();
    }
  }
};

const validarDatos = async () => {
  if (fecha.value === '') {
    await Swal.fire('No se puede cargar el cheque', 'Falta la fecha en que se recibio', 'error');
    return false;
  }
  if (numero.value === '') {
    await Swal.fire('No se puede cargar el cheque', 'Falta el numero del cheque', 'error');
    return false;
  }
  if (banco.value === '') {
    await Swal.fire('No se puede cargar el cheque', 'Falta el banco perteneciente al cheque', 'error');
    return false;
  }
  if (importe.value === '') {
    await Swal.fire('No se puede cargar el cheque', 'Falta el importe del cheque', 'error');
    return false;
  }

  if (fecha_cheque.value === '') {
    await Swal.fire('No se puede cargar el cheque', 'Falta la fecha del cheque', 'error');
    return false;
  }

  if (entregado_por.value === '') {
    await Swal.fire('No se puede cargar el cheque', 'Falta el nombre del cliente que entrego el cheque', 'error');
    return false;
  }

  return true;
};

agregar.addEventListener('click', guardar);

cancelar.addEventListener('click', (e) => {
  ipcRenderer.send('enviar-ventana-principal', informacion);
  window.close();
});

fecha.addEventListener('keypress', (e) => {
  saltarEnter(e, numero);
});

numero.addEventListener('keypress', (e) => {
  saltarEnter(e, banco);
});

banco.addEventListener('keypress', (e) => {
  saltarEnter(e, importe);
});

importe.addEventListener('keypress', (e) => {
  saltarEnter(e, fecha_cheque);
});

fecha_cheque.addEventListener('keypress', (e) => {
  saltarEnter(e, entregado_por);
});

entregado_por.addEventListener('keypress', (e) => {
  saltarEnter(e, entregado_a);
});

entregado_a.addEventListener('keypress', (e) => {
  saltarEnter(e, domicilio);
});

domicilio.addEventListener('keypress', (e) => {
  saltarEnter(e, telefono);
});

telefono.addEventListener('keypress', (e) => {
  saltarEnter(e, observaciones);
});

observaciones.addEventListener('keypress', (e) => {
  saltarEnter(e, agregar);
});
