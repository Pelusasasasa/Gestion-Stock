const listarGastos = (gastos) => {
  tbodyGastos.innerHTML = '';
  let totalVenta = 0;
  for (let gasto of gastos) {
    const fecha = gasto.fecha.slice(0, 10).split('-', 3);
    const tr = `
        <tr id=${gasto._id}>
            <td>${fecha[2]}/${fecha[1]}/${fecha[0]}</td>
            <td>${gasto.descripcion}</td>
            <td>${redondear(gasto.importe * -1, 2)}</td>
            <td>${gasto.vendedor}</td>
            <td>${gasto.caja}</td>
        </tr>
    `;
    tbodyGastos.innerHTML += tr;
    totalVenta -= gasto.importe;
  }

  total.value = totalVenta.toFixed(2);
};

const listarVentas = async (comprobantes) => {
  tbody.innerHTML = ``;
  let lista = [];
  //organizamos las ventas por fecha
  comprobantes.sort((a, b) => {
    if (a.fecha > b.fecha) {
      return 1;
    } else if (b.fecha > a.fecha) {
      return -1;
    }
    return 0;
  });

  //filtramos las ventas si son contadas o tarjeta
  if (tipoVenta === 'T') {
    lista = comprobantes.filter((venta) => venta.tipo_venta === 'T');
  } else {
    lista = comprobantes;
  }

  let totalVenta = 0;
  for await (let venta of lista) {
    const fecha = parsearFecha(venta.fecha);

    const tr = document.createElement('tr');
    tr.id = venta._id;
    tr.classList.add('bold');

    const tdNumero = document.createElement('td');
    const tdFecha = document.createElement('td');
    const tdCliente = document.createElement('td');
    const tdCodProducto = document.createElement('td');
    const tdProducto = document.createElement('td');
    const tdCantidad = document.createElement('td');
    const tdPrecio = document.createElement('td');
    const tdPrecioTotal = document.createElement('td');
    const tdVendedor = document.createElement('td');
    const tdAcciones = document.createElement('td');

    tdAcciones.classList.add('acciones');

    tdNumero.innerText = venta.numero;
    tdFecha.innerText = fecha;
    tdCliente.innerText = venta.cliente;
    tdCodProducto.innerText = venta.tipo_comp;
    tdProducto.innerText = venta.tipo_comp === 'Recibo' ? venta.valorRecibido.slice(0, 30) : '';
    tdPrecioTotal.innerText = venta.tipo_comp === 'Nota Credito C' ? redondear(venta.precio * -1, 2) : venta.precio.toFixed(2);
    tdVendedor.innerText = venta.vendedor ? venta.vendedor.nombre : '';
    tdAcciones.innerHTML = `
            <div class=tool>
                    <span class=material-icons-outlined title='Modificar' id='edit'>edit</span>
                </div>
            <div class=tool>
                    <span class=material-icons-outlined title='Re-Imprimir' id='print'>print</span>
                </div>
            <div class=tool>
                <span class=material-icons-outlined title='Eliminar' id='delete'>delete</span>
            </div>
        `;

    tr.appendChild(tdNumero);
    tr.appendChild(tdFecha);
    tr.appendChild(tdCliente);
    tr.appendChild(tdCodProducto);
    tr.appendChild(tdProducto);
    tr.appendChild(tdCantidad);
    tr.appendChild(tdPrecio);
    tr.appendChild(tdPrecioTotal);
    tr.appendChild(tdVendedor);
    tr.appendChild(tdAcciones);

    tbody.appendChild(tr);

    //aca listamos los productos de cada venta traidos desde el movimiento
    if (venta.tipo_comp !== 'Recibo') {
      await listarMovimientoComprobante(venta.movimientos, venta._id);
    } else {
      await listarMovimientoRecibo(venta.movimientos, venta._id);
    }

    totalVenta += venta.tipo_comp === 'Nota Credito C' ? venta.precio * -1 : venta.precio;
  }
  total.value = totalVenta.toFixed(2);
};

const listarMovimientoComprobante = async (movimientos, codigo) => {
  for await (let { cantidad, precio, fecha, cliente, codProd, producto, nro_venta, series } of movimientos) {
    const trProducto = document.createElement('tr');
    trProducto.classList.add('none');
    trProducto.classList.add(`venta${codigo}`);
    trProducto.classList.add(`text-xs`);

    const date = parsearFecha(fecha);

    const tdNumeroProducto = document.createElement('td');
    const tdFechaProducto = document.createElement('td');
    const tdClienteProducto = document.createElement('td');
    const tdIdProducto = document.createElement('td');
    const tdDescripcion = document.createElement('td');
    const tdCantidad = document.createElement('td');
    const tdPrecioProducto = document.createElement('td');
    const tdTotalProducto = document.createElement('td');
    const tdSerie = document.createElement('td');

    tdNumeroProducto.innerText = nro_venta;
    tdFechaProducto.innerText = date;
    tdClienteProducto.innerText = cliente;
    tdIdProducto.innerText = codProd === undefined ? ' ' : codProd;
    tdDescripcion.innerText = producto;
    tdCantidad.innerText = cantidad.toFixed(2);
    tdPrecioProducto.innerText = precio.toFixed(2);
    tdTotalProducto.innerText = (cantidad * precio).toFixed(2);
    tdSerie.innerHTML = `
                <div>
                    ${
                      series.length > 0
                        ? `<textarea name="" id="" class=w-full m-0>
                        ${series}
                        </textarea>`
                        : ''
                    }
                </div>
            `;

    trProducto.appendChild(tdNumeroProducto);
    trProducto.appendChild(tdFechaProducto);
    trProducto.appendChild(tdClienteProducto);
    trProducto.appendChild(tdIdProducto);
    trProducto.appendChild(tdDescripcion);
    trProducto.appendChild(tdCantidad);
    trProducto.appendChild(tdPrecioProducto);
    trProducto.appendChild(tdTotalProducto);
    trProducto.appendChild(tdSerie);

    tbody.appendChild(trProducto);
  }
};

const listarMovimientoRecibo = async (movimientos, codigo) => {
  for await (let mov of movimientos) {
    const trProducto = document.createElement('tr');
    trProducto.classList.add(`recibo${codigo}`);
    trProducto.classList.add('none');

    const tdNumeroProducto = document.createElement('td');
    const tdFechaProducto = document.createElement('td');
    const tdClienteProducto = document.createElement('td');
    const tdIdProducto = document.createElement('td');
    const tdDescripcion = document.createElement('td');
    const tdCantidad = document.createElement('td');
    const tdPrecioProducto = document.createElement('td');
    const tdTotalProducto = document.createElement('td');

    tdFechaProducto.innerText = mov.fecha.slice(0, 10).split('-', 3).reverse().join('/') + ' - ' + mov.fecha.slice(11, 19).split(':', 3).join(':');
    tdClienteProducto.innerText = mov.cliente;
    tdIdProducto.innerText = mov.numero;

    trProducto.appendChild(tdNumeroProducto);
    trProducto.appendChild(tdFechaProducto);
    trProducto.appendChild(tdClienteProducto);
    trProducto.appendChild(tdIdProducto);
    trProducto.appendChild(tdDescripcion);
    trProducto.appendChild(tdCantidad);
    trProducto.appendChild(tdPrecioProducto);
    trProducto.appendChild(tdTotalProducto);

    tbody.appendChild(trProducto);
  }
};

module.exports = {
  listarGastos,
  listarVentas,
};
