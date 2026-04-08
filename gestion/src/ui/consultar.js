const listarVentas = async (lista) => {
  tbodyVenta.innerHTML = '';

  lista.forEach((venta) => {
    const tr = document.createElement('tr');
    tr.id = venta.nro_venta;
    const tdNumero = document.createElement('td');
    const tdFecha = document.createElement('td');
    const tdCliente = document.createElement('td');
    const tdTipo = document.createElement('td');
    const tdImporte = document.createElement('td');
    const tdPagado = document.createElement('td');
    const tdSaldo = document.createElement('td');
    const tdCondicion = document.createElement('td');

    tdCondicion.classList.add('td-con-scroll');

    const date = new Date(venta.fecha);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    day = day < 10 ? `0${day}` : day;
    month = month < 10 ? `0${month}` : month;
    month = month === 13 ? 1 : month;

    tdFecha.innerHTML = `${day}/${month}/${year}`;
    tdNumero.innerHTML = venta.nro_venta;
    tdCliente.innerHTML = venta.cliente.slice(0, 45);

    tdTipo.innerHTML = venta.tipo_comp ? (venta.tipo_comp === 'PRESUPUESTO' ? 'COMPROBANTE' : venta.tipo_comp) : '';
    if (venta.tipo_comp === 'Nota Credito C') {
      tdImporte.innerHTML = venta.importe ? redondear(venta.importe * -1, 2) : redondear(venta.debe * -1, 2);
    } else {
      tdImporte.innerHTML = venta.importe ? venta.importe.toFixed(2) : venta.debe.toFixed(2);
    }
    tdPagado.innerHTML = venta.pagado !== undefined ? venta.pagado.toFixed(2) : venta.haber.toFixed(2);

    if (venta.tipo_comp === 'Nota Credito C') {
      tdSaldo.innerHTML = redondear(venta.saldo * -1, 2);
    } else {
      tdSaldo.innerHTML = venta.saldo.toFixed(2);
    }
    tdCondicion.innerText = venta.condicion;

    tr.appendChild(tdFecha);
    tr.appendChild(tdNumero);
    tr.appendChild(tdCliente);
    tr.appendChild(tdTipo);
    tr.appendChild(tdImporte);
    tr.appendChild(tdPagado);
    tr.appendChild(tdSaldo);
    tr.appendChild(tdCondicion);

    tbodyVenta.appendChild(tr);
  });
};

const listarProductos = async (movimientos) => {
  tbodyMovRecibo.parentNode.parentNode.classList.add('none');
  tbodyProducto.parentNode.parentNode.classList.remove('none');
  tbodyProducto.innerHTML = '';

  movimientos.forEach((movimiento) => {
    const date = new Date(movimiento.fecha);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    day = day < 10 ? `0${day}` : day;
    month = month < 10 ? `0${month}` : month;
    month = month === 13 ? 1 : month;

    const tr = document.createElement('tr');
    tr.id = movimiento._id;

    const tdFecha = document.createElement('td');
    const tdCodigo = document.createElement('td');
    const tdProducto = document.createElement('td');
    const tdCantidad = document.createElement('td');
    const tdPrecio = document.createElement('td');
    const tdTotal = document.createElement('td');
    const tdSeries = document.createElement('td');

    tdSeries.classList.add('acciones');

    tdFecha.innerHTML = `${day}/${month}/${year}`;
    tdCodigo.innerHTML = movimiento.codProd;
    tdProducto.innerHTML = movimiento.producto;
    tdCantidad.innerHTML = movimiento.cantidad;
    tdPrecio.innerHTML = movimiento.precio.toFixed(2);
    tdTotal.innerHTML = (movimiento.precio * movimiento.cantidad).toFixed(2);
    tdSeries.innerHTML = `
            <div class=tool>
                <span class=material-icons>post_add</span>
                <p class=tooltip>Ver</p>
            </div>
        `;

    tr.appendChild(tdFecha);
    tr.appendChild(tdCodigo);
    tr.appendChild(tdProducto);
    tr.appendChild(tdCantidad);
    tr.appendChild(tdPrecio);
    tr.appendChild(tdTotal);
    tr.appendChild(tdSeries);

    tbodyProducto.appendChild(tr);
  });
};

module.exports = {
  listarVentas,
  listarProductos,
};
