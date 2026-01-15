const sweet = require('sweetalert2');
const { ipcRenderer } = require('electron/renderer');

const { redondear, getParameterByName } = require('../helpers');
const { default: Swal } = require('sweetalert2');
const {
  getCompensadas,
  getHistoricas,
  getHistoricaForDateAndClient,
  getCompensada,
  getHistoricaForNumberAndType,
  deleteHistorica,
  deleteCompensada,
  putHistoricaForId,
  putCompensadaForId,
} = require('../services/cuentasService');
const { getClienteById, putCliente } = require('../services/clientesService');
const { getPrecio, getCostoImpuesto } = require('../services/productosService');
const { putMovimientos, getMovimientoForNumberAndType } = require('../services/movProductosService');
const { listarVentas, listarProductos } = require('../ui/consultar');
const { getVentaForNumberAndType, putVentaForNumeroAndType } = require('../services/ventasService');

const vendedor = getParameterByName('vendedor');

const buscar = document.querySelector('#buscar');

const tbodyVenta = document.querySelector('.listaVentas tbody');
const tbodyProducto = document.querySelector('.listaProductos tbody');
const tbodyMovRecibo = document.querySelector('.listaMovRecibo tbody');
const clienteInput = document.querySelector('#cliente');
const saldo = document.querySelector('#saldo');
const dolarTomado = document.querySelector('#dolarTomado');

const actualizar = document.querySelector('.actualizar');
const compensada = document.querySelector('.compensada');
const historica = document.querySelector('.historica');
const volver = document.querySelector('.volver');

const borrar = document.querySelector('.borrar');
const imprimirResumen = document.querySelector('#imprimirResumen');
const facturar = document.getElementById('facturar');

let trSeleccionado = '';
let clienteTraido = {};
let listaCompensada = [];
let listaHistorica = [];
let movimientos;

let tipoLista = 'compensada';

//Recibimos el cliente si lo buscamos por nombre
ipcRenderer.on('recibir', async (e, args) => {
  const { tipo, informacion } = JSON.parse(args);
  if (tipo === 'cliente') {
    listaCompensada = await getCompensadas(informacion);

    listaHistorica = await getHistoricas(informacion);
    cliente = await getClienteById(informacion);

    saldo.value = cliente.saldo.toFixed(2);
    clienteInput.value = cliente.nombre.slice(0, 45);
    buscar.value = cliente._id;
    buscar.blur();

    listarVentas(listaCompensada);
  }
});

const actualiarHistoricasSig = async (historica) => {
  let cuentasHistoricasRestantes = await getHistoricas(historica.idCliente);
  cuentasHistoricasRestantes = cuentasHistoricasRestantes.filter((cuenta) => cuenta.fecha > historica.fecha);
  let saldo = historica.saldo;

  for (let elem of cuentasHistoricasRestantes) {
    elem.saldo -= saldo;
    saldo = elem.saldo;
    await putHistoricaForId(elem.no_venta, elem);
  }
};

const agregarNumeroSerie = async (e) => {
  if (e.target.innerHTML === 'post_add') {
    const movimientoSeleccionado = movimientos.find((movimiento) => movimiento._id == e.target.closest('tr').id);
    let valor = '';

    movimientoSeleccionado.series.forEach((serie) => {
      if (valor) {
        valor = valor + '\n' + serie;
      } else {
        valor = serie;
      }
    });

    await sweet.fire({
      title: 'Series',
      input: 'textarea',
      inputValue: valor,
    });
  }
};

//Borramos las cuenta compensada y la historica arrelando el saldo
const borrarCuentaCompHist = async (e) => {
  if (trSeleccionado) {
    const { isConfirmed } = await sweet.fire({
      title: 'Segura que quiere borrar',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
    });

    if (isConfirmed) {
      const saldoAModificar = parseFloat(trSeleccionado.children[6].innerText);
      clienteTraido.saldo = (clienteTraido.saldo - saldoAModificar).toFixed(2);

      await putCliente(clienteTraido._id, clienteTraido, vendedor); //Arreglamos el saldo de los clientes
      await deleteCompensada(trSeleccionado.id);
      const historica = await deleteHistorica(trSeleccionado.id); //Eliminamos la cuneta historica

      await actualiarHistoricasSig(historica); //Las cuentas historicas siguientes, arreglamos el saldo
      await filtrarVentas(historica);

      trSeleccionado.remove();
      saldo.value = clienteTraido.saldo.toFixed(2);
    }
  } else {
    await sweet.fire({
      title: 'Ninguna venta seleccionado',
    });
  }
};

const buscarCliente = async (e) => {
  if (e.key === 'Enter') {
    if (buscar.value !== '') {
      clienteTraido = await getClienteById(buscar.value);
      saldo.value = clienteTraido.saldo.toFixed(2);
      clienteInput.value = clienteTraido.nombre;

      listaCompensada = await getCompensadas(clienteTraido._id);

      listaHistorica = await getHistoricas(clienteTraido._id);

      if (tipoLista === 'compensada') {
        listarVentas(listaCompensada);
      } else {
        listarVentas(listaHistorica);
      }
    } else {
      const options = {
        path: './clientes/clientes.html',
        botones: false,
      };
      ipcRenderer.send('abrir-ventana', options);
    }
  }
};

const clickCompensada = async (e) => {
  actualizar.removeAttribute('disabled');
  tipoLista = 'compensada';
  historica.classList.remove('none');
  compensada.classList.add('none');
  borrar.classList.toggle('none');

  listarVentas(listaCompensada);
};

const clickCuenta = async (e) => {
  if (e.target.nodeName === 'TD') {
    const id = e.target.parentNode.id;
    trSeleccionado && trSeleccionado.classList.remove('seleccionado');
    trSeleccionado = e.target.parentNode;
    trSeleccionado.classList.add('seleccionado');

    dolarTomado.value = listaCompensada.find((elem) => elem.nro_venta == id)?.dolar || 0;

    if (trSeleccionado.children[3].innerText !== 'Recibo') {
      movimientos = await getMovimientoForNumberAndType(id, 'CC');
      tbodyProducto.innerHTML = '';
      listarProductos(movimientos);
    } else {
      movimientos = await getMovimientosRecibosForNumber(trSeleccionado.children[1].innerText);
      tbodyProducto.innerHTML = '';
      listarMovientosRecibos(movimientos);
    }
  }
};

const clickHistorica = async (e) => {
  actualizar.setAttribute('disabled', true);
  historica.classList.add('none');
  compensada.classList.remove('none');
  borrar.classList.toggle('none');
  tipoLista = 'historica';

  listarVentas(listaHistorica);
};

const facturarVarios = async () => {
  let html = '';

  const comprobantes = document.querySelectorAll('tbody tr');

  for (let elem of comprobantes) {
    if (elem.children[3].innerText.toUpperCase() === 'COMPROBANTE') {
      html += `
            <div>
                <input type="checkbox" name="${elem.id}" id="${elem.id}" />
                <label htmlFor="">${elem.children[1].innerText}</label>
            </div>
            `;
    }
  }

  const { isConfirmed } = await Swal.fire({
    title: 'Facturar Varios',
    html,
    confirmButtonText: 'Aceptar',
    showCancelButton: true,
  });

  let values = [];

  if (isConfirmed) {
    const chequeados = document.querySelectorAll('input[type=checkbox]');
    chequeados.forEach((elem) => elem.checked && values.push(elem.id));

    ipcRenderer.send('facturarVarios', JSON.stringify(values));
  }
};

const filtrarVentas = async (cuenta) => {
  listaCompensada = listaCompensada.filter((elem) => elem.nro_venta !== cuenta.nro_venta);
  listaHistorica = listaHistorica.filter((elem) => elem.nro_venta !== cuenta.nro_venta);
};

//Listamos los productos cuando tocamos un  en una cuenta compensada o historica

const impresionDeResumen = async () => {
  const date = new Date();
  const mes = date.getMonth() + 1;
  const anio = date.getFullYear();

  await sweet.fire({
    html: `
            <section>
                <input id="fechas" type="date" value=${anio}-${mes}-01 />
            </section>
        `,
    confirmButtonText: 'Imprimir',
    showCancelButton: true,
  });
  const fecha = document.getElementById('fechas').value;

  const historicas = await getHistoricaForDateAndClient(fecha, buscar.value);
  const info = {
    historicas,
    idCliente: buscar.value,
  };
  ipcRenderer.send('imprimir-historica', info);
};

const listarMovientosRecibos = async (movimientos) => {
  tbodyMovRecibo.parentNode.parentNode.classList.remove('none');
  tbodyProducto.parentNode.parentNode.classList.add('none');
  tbodyMovRecibo.innerHTML = '';
  for await (let mov of movimientos) {
    const tr = document.createElement('tr');

    const tdFecha = document.createElement('td');
    const tdNumero = document.createElement('td');
    const tdImporte = document.createElement('td');
    const tdPrecio = document.createElement('td');
    const tdSaldo = document.createElement('td');

    tdFecha.innerText = mov.fecha.slice(0, 10).split('-', 3).reverse().join('/');
    tdNumero.innerText = mov.numero;
    tdImporte.innerText = mov.importe.toFixed(2);
    tdPrecio.innerText = mov.precio.toFixed(2);
    tdSaldo.innerText = mov.saldo.toFixed(2);

    tr.appendChild(tdFecha);
    tr.appendChild(tdNumero);
    tr.appendChild(tdImporte);
    tr.appendChild(tdPrecio);
    tr.appendChild(tdSaldo);

    tbodyMovRecibo.appendChild(tr);
  }
};

//cuando tocamos actualizar una venta, actualizamos con los precios de hoy en dia
actualizar.addEventListener('click', async (e) => {
  if (trSeleccionado) {
    let cliente = '';
    //traemos las compensa que seleccionamos
    const cuentaCompensada = await getCompensada(trSeleccionado.id);
    //Traemos la historica que seleccionamos
    const cuentaHistorica = await getHistoricaForNumberAndType(trSeleccionado.id, 'CC');
    //traemos los movimientos de productos de esa cuenta compensada
    const movimientos = await getMovimientoForNumberAndType(trSeleccionado.id, 'CC');
    //Traemos la venta de lo seleccionado
    const venta = await getVentaForNumberAndType(trSeleccionado.id, 'CC');
    //Traemos el cliente
    cliente = await getClienteById(cuentaCompensada.idCliente);

    let total = 0;

    const promesasPrecios = movimientos.map(async (movimiento) => {
      let precio;
      if (cuentaCompensada.condicion === 'NORMAL') {
        precio = await getPrecio(movimiento.codProd);
      } else {
        const { impuesto, costo } = await getCostoImpuesto(movimiento.codProd);
        precio = parseFloat(redondear(costo + (costo * impuesto) / 100, 2));
      }
      return precio !== '' ? precio : movimiento.precio;
    });

    const nuevosPrecios = await Promise.all(promesasPrecios);

    nuevosPrecios.forEach((precio, index) => {
      movimientos[index].precio = precio;
      total += precio * movimientos[index].cantidad;
    });

    venta.precio = total;

    await ipcRenderer.send('imprimir', ['negro', venta, cliente, movimientos, , true]);

    await sweet
      .fire({
        title: 'Grabar Importe?',
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          //si decimos aceptar actualizamos la venta
          total = parseFloat(total.toFixed(2));
          let cuentasHistoricasRestantes = await getHistoricas(cuentaHistorica.idCliente);
          cuentasHistoricasRestantes = cuentasHistoricasRestantes.filter((cuenta) => cuenta.nro_venta > cuentaHistorica.nro_venta && cuenta.fecha >= cuentaHistorica.fecha);

          //modificamos el saldo del cliente
          cliente.saldo -= parseFloat(cuentaCompensada.importe.toFixed(2));

          //modificamos el nuevo importe de la compensada
          cuentaCompensada.importe = total;
          cuentaCompensada.saldo = parseFloat((total - cuentaCompensada.pagado).toFixed(2));

          //Modificamos el saldo y debe de la cuenta historica
          cuentaHistorica.saldo = parseFloat((cuentaHistorica.saldo - cuentaHistorica.debe + total).toFixed(2));
          cuentaHistorica.debe = parseFloat(total.toFixed(2));

          //Le ponemos al cliente el saldo del importe nuevo
          cliente.saldo = (cliente.saldo + cuentaCompensada.importe).toFixed(2);
          //esto sirve para poner en las nuevas cuentas historicas el saldo
          let saldoAnterior = cuentaHistorica.saldo;

          const promesasActualizacion = cuentasHistoricasRestantes.map((cuenta) => {
            cuenta.saldo = cuenta.tipo_comp === 'Recibo' ? parseFloat((saldoAnterior - cuenta.haber).toFixed(2)) : parseFloat((saldoAnterior + cuenta.debe).toFixed(2));
            saldoAnterior = cuenta.saldo;
            return putHistoricaForId(cuenta.nro_venta, cuenta);
          });

          await Promise.all(promesasActualizacion);

          await putMovimientos(movimientos);
          await putCliente(cliente._id, cliente, vendedor);
          await putVentaForNumeroAndType(venta);
          await putCompensadaForId(cuentaCompensada.nro_venta, cuentaCompensada);
          await putHistoricaForId(cuentaHistorica.nro_venta, cuentaHistorica);

          const cuentaModificada = await getCompensada(trSeleccionado.id);

          listarProductos(movimientos);
          trSeleccionado.children[4].innerText = cuentaModificada.importe;
          trSeleccionado.children[6].innerText = cuentaModificada.saldo;
          saldo.value = cliente.saldo.toFixed(2);
        }
      });
  }
});

borrar.addEventListener('click', borrarCuentaCompHist);

buscar.addEventListener('keypress', buscarCliente);

compensada.addEventListener('click', clickCompensada);

facturar.addEventListener('click', facturarVarios);

historica.addEventListener('click', clickHistorica);

imprimirResumen.addEventListener('click', impresionDeResumen);

tbodyVenta.addEventListener('click', clickCuenta);

tbodyProducto.addEventListener('click', agregarNumeroSerie);

volver.addEventListener('click', (e) => {
  location.href = '../menu.html';
});

// ipcRenderer.on('saldoArreglado', actualizarSaldo);
