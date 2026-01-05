function getParameterByName(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
    results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

//parte de la configuracion
let vendedor = getParameterByName('vendedor');
const archivo = require('../configuracion.json');

const axios = require('axios');
require('dotenv').config();
const URL = process.env.GESTIONURL;

const { ipcRenderer } = require('electron');
const { apretarEnter, cargarFactura, redondear, cargarMovCaja } = require('../helpers');
const sweet = require('sweetalert2');
const { default: Swal } = require('sweetalert2');

const codigo = document.querySelector('#codigo');
const borrarCliente = document.querySelector('#borrarCliente');
const nombre = document.querySelector('#nombre');
const saldo = document.querySelector('#saldo');
const localidad = document.querySelector('#localidad');
const direccion = document.querySelector('#direccion');

const fecha = document.querySelector('#fecha');
const observaciones = document.getElementById('observaciones');

const tbody = document.querySelector('tbody');
const total = document.querySelector('#total');
const imprimir = document.querySelector('.imprimir');
const entregado = document.querySelector('#entregado');
const cheque = document.querySelector('#cheque');
const retencion = document.querySelector('#retencion');
const cancelar = document.querySelector('.cancelar');

const tarjeta = document.querySelector('#tarjeta');

let cuentaAFavor;
let nroCheque = '';
let retencionValor;
let retencionBrutos;

const hoy = new Date();
let d = hoy.getDate();
let m = hoy.getMonth() + 1;
let a = hoy.getFullYear();

d = d < 10 ? `0${d}` : d;
m = m < 10 ? `0${m}` : m;
m = m === 13 ? 1 : m;

fecha.value = `${a}-${m}-${d}`;

ipcRenderer.on('recibir-ventana-secundaria', async (e, args) => {
  const [res, cliente, lista] = JSON.parse(JSON.parse(args).informacion);
  const { data } = await axios.get(`${URL}recibo/id/${res.numero}`);
  if (res) {
    ipcRenderer.send('imprimir-recibo', [data, cliente, lista, false]);
  }

  location.href = '../menu.html';
});

//Todas las compensadas que se modificaron las modificamos
const modificarCuentaCompensadas = async () => {
  const trs = document.querySelectorAll('tbody tr');
  let numeros = [];
  for await (let tr of trs) {
    const numero = parseFloat(tr.children[5].children[0].value) !== 0 ? tr.children[1].innerHTML : '';
    const pagado = parseFloat(tr.children[5].children[0].value);
    numero !== '' && numeros.push({ numero, pagado });
  }
  return numeros;
};

//Pnemos los valores del cliente traido
const ponerInputs = async (id) => {
  let cliente = {};

  try {
    const { data } = await axios.get(`${URL}clientes/id/${id}`);
    if (data.ok) {
      cliente = data.cliente;
    } else {
      return await sweet.fire('Error al obtener el cliente', data?.msg, 'error');
    }
  } catch (error) {
    console.log(error);
    return await sweet.fire('Error al obtener el cliente', error?.response?.data?.msg, 'error');
  }

  if (cliente !== '') {
    codigo.value = cliente._id;
    nombre.value = cliente.nombre;
    saldo.value = cliente.saldo.toFixed(2);
    localidad.value = cliente.localidad;
    direccion.value = cliente.direccion;
    let compensadas = [];

    try {
      const { data } = await axios.get(`${URL}compensada/traerCompensadas/${cliente._id}`);

      if (data.ok) {
        compensadas = data.compensadas;
      } else {
        await sweet.fire('No se pudo obtener las compensadas', data.msg, 'error');
      }
    } catch (error) {
      console.log(error);
      await sweet.fire('No se pudo traer las compensadas', error?.response?.data?.msg, 'error');
    }
    tbody.innerHTML = '';

    let i = 1;
    compensadas.forEach((compensada) => {
      if (compensada.observaciones) {
        observaciones.value = observaciones.value + compensada.nro_venta + ' ' + compensada.observaciones + ';';
        i++;
      }

      ponerVenta(compensada);
    });
  } else {
    await sweet.fire('Cliente no encontrado');
    codigo.value = '';
    nombre.value = '';
    saldo.value = '';
    localidad.value = '';
    direccion.value = '';
    tbody.innerHTML = '';
  }
};

//Ponemos las cuentas compensadas de los clientes
const ponerVenta = async (cuenta) => {
  const hoy = new Date(cuenta.fecha);
  let dia = hoy.getDate();
  let mes = hoy.getMonth() + 1;
  let anio = hoy.getFullYear();

  dia = dia < 10 ? `0${dia}` : dia;
  mes = mes < 10 ? `0${mes}` : mes;
  mes = mes === 13 ? 1 : mes;

  const tr = document.createElement('tr');
  tr.classList.add(`${cuenta.nro_venta}`);

  const tdFecha = document.createElement('td');
  const tdNumero = document.createElement('td');
  const tdImporte = document.createElement('td');
  const tdTipoComp = document.createElement('td');
  const tdPagado = document.createElement('td');
  const tdActual = document.createElement('td');
  const inputActual = document.createElement('input');
  const tdSaldo = document.createElement('td');

  tdFecha.innerHTML = `${dia}/${mes}/${anio}`;
  tdNumero.innerHTML = cuenta.nro_venta;
  tdTipoComp.innerHTML = `${cuenta.tipo_comp} ${cuenta.nro_factura}`;
  tdImporte.innerHTML = cuenta.tipo_comp === 'Nota Credito C' ? redondear(cuenta.importe * -1, 2) : redondear(cuenta.importe, 2);
  tdPagado.innerHTML = redondear(cuenta.pagado, 2);
  tdSaldo.innerHTML = cuenta.tipo_comp === 'Nota Credito C' ? redondear(cuenta.saldo * -1, 2) : redondear(cuenta.saldo, 2);
  inputActual.value = '0.00';
  inputActual.type = 'number';
  inputActual.id = cuenta.nro_venta;
  tdActual.appendChild(inputActual);

  tr.appendChild(tdFecha);
  tr.appendChild(tdNumero);
  tr.appendChild(tdTipoComp);
  tr.appendChild(tdImporte);
  tr.appendChild(tdPagado);
  tr.appendChild(tdActual);
  tr.appendChild(tdSaldo);

  tbody.appendChild(tr);
};

const verValorRecibo = () => {
  if (cheque.checked) {
    return `CHEQUE`;
  } else if (tarjeta.checked) {
    return `TARJETA`;
  } else {
    return 'EFECTIVO';
  }
};

//Cuando hago un click que seleccione el input
let inputSeleccionado = tbody;
let trSeleccionado = '';
tbody.addEventListener('click', (e) => {
  const seleccion = e.target;
  if (seleccion.nodeName === 'INPUT') {
    inputSeleccionado = seleccion;
  } else if (seleccion.nodeName === 'TD') {
    inputSeleccionado = seleccion.parentNode.children[5].children[0];
    inputSeleccionado.focus();
  } else if (seleccion.nodeName === 'TR') {
    inputSeleccionado = seleccion.children[5].children[0];
    inputSeleccionado.focus();
  }
  trSeleccionado = inputSeleccionado.parentNode.parentNode;
  inputSeleccionado.select();
});

//cuando cambiamos el valor del input, tambien cambiamos el valor de las demas columnas y el total del recibo
inputSeleccionado.addEventListener('change', (e) => {
  total.value = parseFloat(total.value) - (parseFloat(trSeleccionado.children[3].innerHTML) - parseFloat(trSeleccionado.children[4].innerHTML) - parseFloat(trSeleccionado.children[6].innerHTML));
  trSeleccionado.children[6].innerHTML = (parseFloat(trSeleccionado.children[3].innerHTML) - parseFloat(trSeleccionado.children[4].innerHTML) - parseFloat(inputSeleccionado.value)).toFixed(2);
  total.value = redondear(parseFloat(total.value) + parseFloat(inputSeleccionado.value), 2);
  if (trSeleccionado.nextElementSibling) {
    trSeleccionado = trSeleccionado.nextElementSibling;
    inputSeleccionado = trSeleccionado.children[5].children[0];
    inputSeleccionado.focus();
    inputSeleccionado.select();
  }

  //para sacar el disabled del saldo a favor
  if (parseFloat(total.value) === parseFloat(saldo.value)) {
    entregado.removeAttribute('disabled');
  }
});

entregado.addEventListener('change', async (e) => {
  const trs = document.querySelectorAll('tbody tr');
  if (entregado.value !== '' && parseFloat(entregado.value) !== 0) {
    let saldo = parseFloat(entregado.value);
    for await (let tr of trs) {
      const hijo = tr.children;
      if (saldo !== 0) {
        if (saldo >= parseFloat(hijo[3].innerHTML) - parseFloat(hijo[4].innerHTML)) {
          hijo[5].children[0].value = redondear(parseFloat(hijo[3].innerHTML) - parseFloat(hijo[4].innerHTML), 2);
          hijo[6].innerHTML = redondear(parseFloat(hijo[3].innerHTML) - parseFloat(hijo[4].innerHTML) - parseFloat(hijo[5].children[0].value), 2);
          saldo = parseFloat(redondear((saldo - parseFloat(hijo[5].children[0].value)).toFixed(2), 2));
        } else {
          hijo[5].children[0].value = saldo;
          hijo[6].innerHTML = redondear(parseFloat(hijo[3].innerHTML) - parseFloat(hijo[4].innerHTML) - parseFloat(hijo[5].children[0].value), 2);
          saldo = 0;
        }
      } else {
        hijo[5].children[0].value = saldo;
        hijo[6].innerHTML = redondear(parseFloat(hijo[3].innerHTML) - parseFloat(hijo[4].innerHTML) - parseFloat(hijo[5].children[0].value), 2);
      }
    }
    if (saldo > 0) {
      //si queda saldo por descontar , creamos una compensada para que quede el saldo a favor  tambien un historica
      cuentaAFavor = await crearCompensadaAFavor(saldo);
    } else {
      cuentaAFavor = cuentaAFavor && null;
    }
    total.value = entregado.value;
  } else if (parseFloat(entregado.value) === 0 || entregado.value === '') {
    for await (let tr of trs) {
      const hijo = tr.children;
      hijo[5].children[0].value = 0;
      hijo[6].innerHTML = (parseFloat(hijo[3].innerHTML) - parseFloat(hijo[4].innerHTML)).toFixed(2);
    }
    total.value = entregado.value;
  }
});

imprimir.addEventListener('click', async (e) => {
  //ponemos los valores en el recibo
  const recibo = {};
  recibo.cliente = nombre.value;
  recibo.idCliente = codigo.value;
  recibo.tipo_comp = 'Recibo';
  recibo.tipo_venta = 'RB';
  recibo.descuento = 0;
  recibo.valorRecibido = nroCheque ? `CHEQUE ${nroCheque.toUpperCase()}` : 'EFECTIVO';
  recibo.precio = parseFloat(total.value);
  recibo.vendedor = vendedor ? vendedor : '';
  recibo.caja = archivo.caja;
  recibo.compensadas = await modificarCuentaCompensadas();
  recibo.valorRecibido = verValorRecibo();

  // try {
  //     const { data } = await axios.get(`${URL}tipoCuenta/forText/Recibo`);
  //     await cargarMovCaja(recibo.cliente, '000R', recibo.numero, data.tipo._id, recibo.precio, "639dbc31dfdb8a1d243d19c2");
  // } catch (error) {
  //     console.log(error)
  // }

  try {
    const { data } = await axios.post(`${URL}recibo`, recibo);

    if (data.ok) {
      data.recibo.retencion = [];
      if (retencionValor) {
        const { data: retencion } = await axios.post(`${URL}retencion`, {
          importe: retencionValor,
          reciboId: data.recibo._id,
          nro_comp: data.recibo.numero,
          descripcion: 'Retenciones Imp a las Ganancias',
        });
        data.recibo.retencion.push(retencion.retencion);
      }

      if (retencionBrutos) {
        const { data: retencion } = await axios.post(`${URL}retencion`, {
          importe: retencionBrutos,
          reciboId: data.recibo._id,
          nro_comp: data.recibo.numero,
          descripcion: 'Retencones IIBB - ATER Contribuyente',
        });
        data.recibo.retencion.push(retencion.retencion);
      }

      if (cheque.checked) {
        await ipcRenderer.send('abrir-ventana', {
          path: './cheque/agregarCheque.html',
          altura: 800,
          ancho: 600,
          reinicio: false,
          informacion: JSON.stringify([data.recibo, data.cliente, data.movsRecibos, false]),
        });
      } else if (tarjeta.checked) {
        await ipcRenderer.send('abrir-ventana', {
          path: './tarjeta/agregarTarjeta.html',
          altura: 800,
          ancho: 600,
          reinicio: false,
          informacion: JSON.stringify([data.recibo, data.cliente, data.movsRecibos, false]),
        });
      } else {
        ipcRenderer.send('imprimir-recibo', [data.recibo, data.cliente, data.movsRecibos, false]);
        location.href = '../menu.html';
      }
    } else {
      await sweet.fire('Error al generar el recibo', data?.msg, 'error');
    }
  } catch (error) {
    console.log(error);
  }
});

const crearCompensadaAFavor = async (saldo) => {
  const compensada = {};
  compensada.idCliente = codigo.value;
  compensada.cliente = nombre.value;
  compensada.tipo_comp = 'Recibo';
  compensada.importe = -1 * saldo;
  compensada.pagado = 0;
  compensada.saldo = -1 * saldo;
  return compensada;
};

entregado.addEventListener('focus', (e) => {
  entregado.select();
});

nombre.addEventListener('keypress', (e) => {
  apretarEnter(e, localidad);
});

localidad.addEventListener('keypress', (e) => {
  apretarEnter(e, direccion);
});

direccion.addEventListener('keypress', (e) => {
  apretarEnter(e, fecha);
});

fecha.addEventListener('keypress', (e) => {
  apretarEnter(e, localidad);
});

cancelar.addEventListener('click', (e) => {
  location.href = '../menu.html';
});

//si apretramos enter y el valor es vacio abrimos para buscar los clientes
codigo.addEventListener('keypress', async (e) => {
  if (e.key === 'Enter') {
    if (codigo.value != '') {
      ponerInputs(codigo.value);
      codigo.setAttribute('disabled', true);
    } else {
      const options = {
        path: './clientes/clientes.html',
        botones: false,
      };
      ipcRenderer.send('abrir-ventana', options);
    }
  }
});

observaciones.parentElement.addEventListener('dblclick', async (e) => {
  const { isConfirmed, value } = await sweet.fire({
    title: 'Observaciones',
    input: 'textarea',
    inputValue: observaciones.value.split(';').join(';\n'),
    confirmButtonText: 'Modificar',
    showCancelButton: true,
  });

  if (isConfirmed) {
    const valores = value.split(';');

    valores.map(async (valor) => {
      let aux = '';
      let auxText = '';

      for (let i = 0; i < valor.trim().length; i++) {
        if (!isNaN(parseInt(valor[i]))) {
          aux += valor[i];
        } else {
          auxText += valor[i];
        }
      }

      if (aux) {
        await axios.put(`${URL}compensada/observaciones/${aux}`, {
          observaciones: auxText.trim(),
        });
        observaciones.value = value.toUpperCase();
      }
    });
  }
});

retencion.addEventListener('click', async (e) => {
  if (!e.target.checked) {
    retencionValor = null;
    retencionBrutos = null;
    return;
  }

  const { isConfirmed, value } = await Swal.fire({
    title: 'Retenciones',
    html:
      `<div class="mb-2">
                <label class="font-bold text-xl" htmlFor="">Retencion Ganancias</label>
                <input id="swal-input-ganancias" class="swal2-input" type="number" placeholder="Retención de Ganancias" value="${retencionValor ? retencionValor : 0}">
            </div>` +
      `
                <div class="mb-2">
                <label class="font-bold text-xl" htmlFor="">Retencion Brutos</label>
                <input id="swal-input-brutos" class="swal2-input" type="number" placeholder="Ingresos Brutos" value="${retencionBrutos ? retencionBrutos : 0}">`, // Assuming ingresosBrutosValor is defined elsewhere
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Aceptar',
    preConfirm: () => {
      const ganancias = document.getElementById('swal-input-ganancias').value;
      const brutos = document.getElementById('swal-input-brutos').value;
      return [parseFloat(ganancias || 0), parseFloat(brutos || 0)];
    },
  });

  if (isConfirmed) {
    const [gananciasValue, brutosValue] = value;
    retencionValor = gananciasValue;
    retencionBrutos = brutosValue;
  }
});

setInterval(() => {
  if (observaciones.value !== '') {
    observaciones.classList.toggle('observacionesAlerta');
  }
}, 800);

ipcRenderer.on('recibir', (e, args) => {
  const { informacion } = JSON.parse(args);
  ponerInputs(informacion);
});

borrarCliente.addEventListener('click', () => {
  codigo.value = '';
  nombre.value = '';
  saldo.value = '';
  localidad.value = '';
  direccion.value = '';
  observaciones.value = '';

  codigo.removeAttribute('disabled');

  tbody.innerHTML = '';
});
