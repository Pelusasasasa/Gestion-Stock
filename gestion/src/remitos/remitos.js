const { ipcRenderer } = require('electron');
const { getParameterByName } = require('../helpers');
const { listarRemito, listarMov, crearEncabezadoRem, crearEncabezadoMov } = require('../ui/remito');
const { getRemitos, putObservaciones } = require('../services/remitoService');

const volver = document.getElementById('volver');
const buscador = document.getElementById('buscador');
const remitoC = document.getElementById('remitoC');
const listRem = document.getElementById('listRem');
const listMov = document.getElementById('listMov');

const pasarCTA = document.getElementById('pasarCTA');

const modal = document.getElementById('modal');
const cambiarObservaciones = document.getElementById('cambiarObservaciones');
const aceptarCambioObservaciones = document.getElementById('aceptarCambioObservaciones');

let remitos = [];
let bandera = false;
let seleccionado = '';

const vendedor = getParameterByName('vendedor');
const apretarTecla = async (e) => {
  if (e.keyCode === 27) {
    if (listMov.classList.contains('none')) {
      location.href = '../menu.html';
    } else {
      listMov.classList.add('none');
      listRem.classList.add('h-80vh');
      listRem.classList.remove('h-30vh');
    }
  }
};

const obtenerRemitos = async () => {
  remitos = await getRemitos(bandera);
  listRem.innerHTML = '';
  listRem.appendChild(crearEncabezadoRem());
  for (let elem of remitos) {
    const remitoHTML = listarRemito(elem);
    listRem.appendChild(remitoHTML);
  }

  bandera = !bandera;
};

const clickModal = (e) => {
  if (e.target.classList.contains('cerrarModal')) {
    cambiarObservaciones.value = '';
    modal.classList.add('none');
  }
};

const clickTbody = async (e) => {
  if (e.target.classList.contains('remitoContainer')) {
    seleccionado && seleccionado.classList.remove('seleccionado');
    seleccionado = e.target;
    seleccionado.classList.add('seleccionado');
  } else if (e.target.classList.contains('numeroRemito')) {
    seleccionado && seleccionado.classList.remove('seleccionado');
    seleccionado = e.target.parentNode.parentNode;
    seleccionado.classList.add('seleccionado');
  } else if (e.target.nodeName === 'INPUT') {
    seleccionado && seleccionado.classList.remove('seleccionado');
    seleccionado = e.target.parentNode.parentNode;
    seleccionado.classList.add('seleccionado');
  } else {
    seleccionado && seleccionado.classList.remove('seleccionado');
    seleccionado = e.target.parentNode;
    seleccionado.classList.add('seleccionado');
  }

  let aux = remitos.find((elem) => elem._id === seleccionado.id);

  listMov.innerHTML = '';
  listMov.appendChild(crearEncabezadoMov());
  for (let elem of aux.movimientos) {
    const movHTML = listarMov(elem);
    listMov.appendChild(movHTML);
  }
};

const dobleclickTbody = (e) => {
  modal.classList.remove('none');
  cambiarObservaciones.value = seleccionado.children[4].innerText;
  cambiarObservaciones.focus();
};

const filtrarRemitos = async (e) => {
  const filtro = await getRemitos(bandera, buscador.value.toUpperCase());
  listRem.innerHTML = '';
  listRem.appendChild(crearEncabezadoRem());
  for (let elem of filtro) {
    const remitoHTML = listarRemito(elem);
    listRem.appendChild(remitoHTML);
  }
};

const modificarObservacionesRemitos = async () => {
  const data = await putObservaciones(seleccionado.id, cambiarObservaciones.value.toUpperCase());
  if (data.ok) {
    modal.classList.add('none');
    seleccionado.children[4].innerText = data.remito.observaciones;
  }
};

const pasarCuenta = async () => {
  const trSeleccinados = document.querySelectorAll('#listRem input[type="checkbox"]:checked');
  const filasSeleccionadas = Array.from(trSeleccinados).map((checkbox) => checkbox.closest('input'));
  const idFilas = filasSeleccionadas.map((elem) => elem.id);

  location.href = `../venta/index.html?remito=true&remitos=${JSON.stringify(idFilas)}&vendedor=${vendedor}`;
};

aceptarCambioObservaciones.addEventListener('click', modificarObservacionesRemitos);
buscador.addEventListener('keyup', filtrarRemitos);
document.addEventListener('keyup', apretarTecla);
modal.addEventListener('click', clickModal);
remitoC.addEventListener('change', obtenerRemitos);
pasarCTA.addEventListener('click', pasarCuenta);
listRem.addEventListener('click', clickTbody);
listRem.addEventListener('dblclick', dobleclickTbody);
window.addEventListener('load', obtenerRemitos);

volver.addEventListener('click', () => {
  location.href = '../menu.html';
});
