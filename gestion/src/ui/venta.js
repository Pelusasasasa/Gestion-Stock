const crearHTML = async (elem) => {
  const tr = document.createElement('tr');

  const tdCodigo = document.createElement('td');
  const tdCantidad = document.createElement('td');
  const tdDescripcion = document.createElement('td');
  const tdMarca = document.createElement('td');
  const tdIva = document.createElement('td');
  const tdPrecio = document.createElement('td');
  const tdTotal = document.createElement('td');
  const tdAcciones = document.createElement('td');

  tdAcciones.classList.add('acciones');

  tdCodigo.innerText = elem.codProd;
  tdCantidad.innerText = elem.cantidad;
  tdDescripcion.innerText = elem.producto;
  tdMarca.innerText = elem.marca;
  tdIva.innerText = elem.iva;
  tdPrecio.innerText = elem.precio;
  tdTotal.innerText = redondear(elem.precio * elem.cantidad, 2);

  tdAcciones.innerHTML = `
            <td class=acciones>
                <div class=tool>
                    <span class=material-icons>post_add</span>
                    <p class=tooltip>Series</p>
                </div>
                <div class=tool>
                    <span class=material-icons>delete</span>
                    <p class=tooltip>Eliminar</p>
                </div>
            </td>
        `;

  tr.appendChild(tdCodigo);
  tr.appendChild(tdCantidad);
  tr.appendChild(tdDescripcion);
  tr.appendChild(tdMarca);
  tr.appendChild(tdIva);
  tr.appendChild(tdPrecio);
  tr.appendChild(tdTotal);
  tr.appendChild(tdAcciones);

  tbody.appendChild(tr);

  let producto = await obtenerProducto(elem.codProd);

  if (!producto) {
    producto = {
      _id: elem.codProd,
      descripcion: elem.producto,
      precio: elem.precio,
      marca: elem.marca,
      impuesto: elem.iva,
    };
  }
  listaProductos.push({
    cantidad: elem.cantidad,
    producto,
    series: elem?.series,
  });
  await calcularTotal();
};

const crearProducto = (producto, cantidad) => {
  tbody.innerHTML += `
        <tr id=${producto.idTabla}>
            <td></td>
            <td>${cantidad}</td>
            <td>${producto.descripcion.toUpperCase()}</td>
            <td></td>
            <td>${producto.impuesto.toFixed(2)}</td>
            <td>${parseFloat(producto.precioAux).toFixed(2)}</td>
            <td>${redondear(producto.precioAux * parseFloat(cantidad), 2)}</td>
            <td class=acciones>
                <div class=tool>
                        <span class=material-icons>post_add</span>
                        <p class=tooltip>Agregar Nº serie</p>
                </div>
                <div class=tool>
                    <span class=material-icons>delete</span>
                    <p class=tooltip>Eliminar</p>
                </div>
            </td>
        </tr>
    `;
  tbody.scrollIntoView({
    block: 'end',
  });
};

module.exports = {
  crearHTML,
  crearProducto,
};
