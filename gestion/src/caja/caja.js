const { redondear, parsearFecha, getParameterByName } = require('../helpers');
const sweet = require('sweetalert2');

const { vendedores } = require('../configuracion.json');
const { deleteVentaForNumeroAndType } = require('../services/ventasService');
const { getPresupuestoForFecha } = require('../services/presupuestoService');
const { getCajaForFecha, getCajaForDia } = require('../services/cajaService');
const { listarGastos, listarVentas } = require('../ui/caja');

let vendedor = getParameterByName('vendedor');
let permiso = getParameterByName('permiso');

const tarjeta = document.querySelector('.tarjeta');
const contado = document.querySelector('.contado');

const botonDia = document.querySelector('.botonDia');
const botonMes = document.querySelector('.botonMes');
const botonAnio = document.querySelector('.botonAnio');

const dia = document.querySelector('.dia');
const mes = document.querySelector('.mes');
const anio = document.querySelector('.anio');

let botonSeleccionado = document.querySelector('.seleccionado');

const desde = document.querySelector('#desde');
const hasta = document.querySelector('#hasta');
const selectMes = document.querySelector('#mes');
const inputAnio = document.querySelector('#anio');

const tbody = document.querySelector('.tbodyListado');
const tbodyGastos = document.querySelector('.tbodyGastos');
const volver = document.querySelector('.volver');
const total = document.querySelector('#total');

const pestaña = document.querySelector('.pestaña');

let seleccionado,
  ventas = [],
  recibos = [],
  gastos = [],
  presupuestos = [],
  cuentasCorrientes = [],
  filtro = 'Ingresos',
  //La idea es que cada vez que necesimetos re contstruir las ventas llamemos a este funcion
  tipoFecha = 'dia',
  tipoVenta = 'CD',
  date = '';

pestaña.addEventListener('click', async (e) => {
  const gastos = document.querySelector('.gastos');
  const listado = document.querySelector('.listado');

  if (e.target.parentNode.nodeName === 'MAIN') {
    if (vendedores && permiso !== '0' && e.target.innerHTML === 'Gastos') {
      await sweet.fire({
        title: 'No tiene permisos',
      });
    } else {
      document.querySelector('.pestañaSeleccionada') && document.querySelector('.pestañaSeleccionada').classList.remove('pestañaSeleccionada');
      e.target.parentNode.classList.add('pestañaSeleccionada');
      filtro = e.target.innerHTML;
    }
    if (filtro === 'Gastos') {
      gastos.classList.remove('none');
      listado.classList.add('none');
      tarjeta.classList.add('none');
      contado.classList.add('none');

      buscar();
    } else if (filtro === 'Ingresos') {
      listado.classList.remove('none');
      gastos.classList.add('none');
      tarjeta.classList.remove('none');
      contado.classList.remove('none');

      tipoVenta = 'CD';
      buscar();
    } else if (filtro === 'Presupuestos') {
      contado.classList.remove('none');
      tarjeta.classList.add('none');

      tipoVenta = 'PP';
      buscar();
    } else {
      listado.classList.remove('none');
      gastos.classList.add('none');
      tarjeta.classList.add('none');
      contado.classList.add('none');
      tipoVenta = 'CC';

      buscar();
    }
  }
});

window.addEventListener('load', async (e) => {
  desde.value = parsearFecha(new Date()).slice(0, 10).split('/', 3).reverse().join('-');
  hasta.value = parsearFecha(new Date()).slice(0, 10).split('/', 3).reverse().join('-');
  selectMes.value = parsearFecha(new Date()).slice(0, 10).split('/', 3)[1];
  inputAnio.value = parsearFecha(new Date()).slice(0, 10).split('/', 3)[2];

  buscar();
});

//Cuando se hace click en el boton tarjeta, lo que hacemos es mostrar las ventas con tarjetas
tarjeta.addEventListener('click', (e) => {
  if (!tarjeta.classList.contains('buttonSeleccionado')) {
    contado.classList.remove('buttonSeleccionado');
    tarjeta.classList.add('buttonSeleccionado');

    tipoVenta = 'T';
    listarVentas(ventas);
  }
});

//Cuando hacemos click en contado mostramos las ventas en contado
contado.addEventListener('click', (e) => {
  if (!contado.classList.contains('buttonSeleccionado')) {
    tarjeta.classList.remove('buttonSeleccionado');
    contado.classList.add('buttonSeleccionado');
    tipoVenta = 'CD';
    listarVentas(ventas);
  }
});

//muestra las ventas del mes cuando tocamos en el boton
botonMes.addEventListener('click', async (e) => {
  botonSeleccionado.classList.remove('seleccionado');
  botonSeleccionado = botonMes;
  botonSeleccionado.classList.add('seleccionado');

  mes.classList.remove('none');
  dia.classList.add('none');
  anio.classList.add('none');

  tipoFecha = 'mes';

  buscar();
});

//muestra las ventas del dia cuando tocamos en el boton
botonDia.addEventListener('click', async (e) => {
  botonSeleccionado.classList.remove('seleccionado');
  botonSeleccionado = botonDia;

  dia.classList.remove('none');
  mes.classList.add('none');
  anio.classList.add('none');

  botonSeleccionado.classList.add('seleccionado');

  tipoFecha = 'dia';

  buscar();
});

//muestra las ventas del año cuando tocamos en el boton
botonAnio.addEventListener('click', async (e) => {
  botonSeleccionado.classList.remove('seleccionado');
  botonSeleccionado = botonAnio;
  anio.classList.remove('none');
  dia.classList.add('none');
  mes.classList.add('none');
  botonSeleccionado.classList.add('seleccionado');

  tipoFecha = 'anio';

  buscar();
});

desde.addEventListener('keypress', async (e) => {
  if (e.key === 'Enter') {
    tipoFecha = 'dia';
    hasta.focus();
  }
});

hasta.addEventListener('keypress', async (e) => {
  if (e.key === 'Enter') {
    tipoFecha = 'dia';
    buscar();
  }
});

selectMes.addEventListener('click', async (e) => {
  tipoFecha = 'mes';
  buscar();
});

inputAnio.addEventListener('keypress', async (e) => {
  if (e.key === 'Enter') {
    tipoFecha = 'anio';
    buscar();
  }
});

tbody.addEventListener('click', async (e) => {
  const id = e.target.nodeName === 'TD' ? e.target.parentNode.id : e.target.id;

  seleccionado && seleccionado.classList.remove('seleccionado');

  if (e.target.nodeName === 'TD') {
    seleccionado = e.target.parentNode;
  } else if (e.target.nodeName === 'DIV') {
    seleccionado = e.target.parentNode.parentNode;
  } else if (e.target.nodeName === 'SPAN') {
    seleccionado = e.target.parentNode.parentNode.parentNode;
  }

  seleccionado.classList.add('seleccionado');

  if (e.target.innerHTML === 'delete') {
    sweet
      .fire({
        title: 'Seguro quiere borrar la Venta',
        confirmButtonText: 'Aceptar',
        showCancelButton: true,
      })
      .then(async ({ isConfirmed }) => {
        if (isConfirmed) {
          const venta = await deleteVentaForNumeroAndType(id, seleccionado.children[3].innerHTML, vendedor);
          if (venta) {
            tbody.removeChild(seleccionado);
            total.value = redondear(parseFloat(total.value) - parseFloat(seleccionado.children[7].innerHTML), 2);
          }
        }
      });
  } else if (e.target.innerHTML === 'edit') {
  }

  const trs = document.querySelectorAll('tbody .venta' + id);
  const trsRecibos = document.querySelectorAll('tbody .recibo' + id);

  for (let tr of trs) {
    tr.classList.toggle('none');
  }
  for (let tr of trsRecibos) {
    tr.classList.toggle('none');
  }
});

tbodyGastos.addEventListener('click', (e) => {
  seleccionado && seleccionado.classList.remove('seleccionado');
  seleccionado = e.target.nodeName === 'TD' ? e.target.parentNode : e.target;
  seleccionado.classList.add('seleccionado');
});

const buscar = async () => {
  if (tipoFecha === 'dia') {
    date = desde.value;
  } else if (tipoFecha === 'mes') {
    date = selectMes.value;
  } else if (tipoFecha === 'anio') {
    date = inputAnio.value;
  }

  //vemos que tipo de filtro es y ahi vemos si traemos los ingresos o gastos
  if (filtro === 'Ingresos' || filtro === 'Cuenta Corriente') {
    const { ventas, recibos, cuentaCorrientes, ok, gastos } = tipoFecha === 'dia' ? await getCajaForDia(tipoFecha, date, hasta.value) : await getCajaForFecha(tipoFecha, date);

    if (!ok) return await sweet.fire('Error al obtener las ventas', 'No se pudieron obterner las ventas del mes', 'error');

    if (filtro === 'Ingresos') {
      listarVentas([...ventas, ...recibos]);
    } else {
      listarVentas(cuentaCorrientes);
    }
  } else if (filtro === 'Presupuestos') {
    presupuestos = await getPresupuestoForFecha(tipoFecha, date);
    listarVentas(presupuestos);
  } else {
    listarGastos(gastos);
  }
};

volver.addEventListener('click', (e) => {
  location.href = '../menu.html';
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'Escape' && !document.activeElement.classList.contains('swal2-confirm')) {
    location.href = '../menu.html';
  }
});
