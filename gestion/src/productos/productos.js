require('dotenv').config();

const sweet = require('sweetalert2');
const axios = require('axios');
const { ipcRenderer } = require('electron');
const { recorrerFlechas, copiar, redondear, agregarMovimientoVendedores, verificarUsuarios, getParameterByName, parsearFecha } = require('../helpers');

const URL = process.env.GESTIONURL;

let vendedor = getParameterByName('vendedor');
let permiso = getParameterByName('permiso');
permiso = permiso === '' ? 0 : parseInt(permiso);

let seleccionado;
let subSeleccionado;
let ventanaSecundaria = false;

const seleccion = document.querySelector('#seleccion');
const body = document.querySelector('body');
const tbody = document.querySelector('tbody');
const historicaMovDiv = document.getElementById('historicaMovDiv');
const cerrarMovLista = document.getElementById('cerrarMovLista');
const historicaMovTable = document.getElementById('historicaMovTable');
const agregar = document.querySelector('.agregar');
const ingresarMov = document.querySelector('.ingresarMov');
const salir = document.querySelector('.salir');
const buscador = document.querySelector('#buscarProducto');

const abrirVentanaModificar = () => {
  const opciones = {
    path: './productos/modificarProducto.html',
    botones: true,
    informacion: seleccionado.id,
    altura: 800,
    vendedor: vendedor,
  };
  ipcRenderer.send('abrir-ventana', opciones);
};

const filtrar = async () => {
  tbody.innerHTML = '';
  let condicion = seleccion.value;
  if (condicion === 'codigo') {
    condicion = '_id';
  }
  const descripcion = buscador.value !== '' ? buscador.value : 'textoVacio';
  const producto = (await axios.get(`${URL}productos/${descripcion}/${condicion}`)).data;
  producto.length !== 0 && listar(producto);
};

const ingresarMovimiento = async (e) => {
  if (!seleccionado)
    return await sweet.fire({
      title: 'Elegir un producto',
    });

  const vendedor = await verificarUsuarios();

  if (vendedor === undefined) return;

  if (vendedor) {
    ipcRenderer.send('abrir-ventana', {
      path: 'productos/ingresarMovimiento.html',
      ancho: 1100,
      altura: 700,
      informacion: seleccionado.id,
      vendedor: vendedor,
      permiso: permiso,
    });
  } else {
    await sweet.fire({
      title: 'Contraseña Incorrecta',
    });
  }
};

const listar = (productos) => {
  tbody.innerHTML = '';
  for (let { _id, descripcion, marca, rubro, stock, precio } of productos) {
    const tr = document.createElement('tr');
    tr.id = _id;

    tr.addEventListener('dblclick', abrirVentanaModificar);

    const tdId = document.createElement('td');
    const tdDescripcion = document.createElement('td');
    const tdPrecio = document.createElement('td');
    const tdStock = document.createElement('td');
    const tdRubro = document.createElement('td');
    const tdMarca = document.createElement('td');
    const tdAcciones = document.createElement('td');

    tdPrecio.classList.add('text-rigth');
    tdStock.classList.add('text-rigth');
    tdAcciones.classList.add('acciones');

    tdId.innerHTML = _id;
    tdDescripcion.innerHTML = descripcion.slice(0, 80);
    tdPrecio.innerHTML = redondear(precio, 2);
    tdStock.innerHTML = redondear(stock, 2);
    tdMarca.innerHTML = marca;
    tdRubro.innerText = rubro;
    tdAcciones.innerHTML = `
            <div id=edit class=tool>
                <span id=visibility class=material-icons-outlined title='Historial Mov'>visibility</span>
            </div>
            <div id=edit class=tool>
                <span id=edit title='Modificar' class=material-icons-outlined>edit</span>
            </div>
            <div id=delete class="tool ${permiso !== 0 && 'none'}">
                <span id=delete title='Eliminar' class=material-icons-outlined>delete</span>
            </div>
        `;

    tr.appendChild(tdId);
    tr.appendChild(tdDescripcion);
    tr.appendChild(tdPrecio);
    tr.appendChild(tdStock);
    tr.appendChild(tdMarca);
    tr.appendChild(tdRubro);
    tr.appendChild(tdAcciones);

    tbody.appendChild(tr);
  }
};

const listarMovimientos = (lista) => {
  historicaMovTable.innerHTML = '';

  for (let elem of lista) {
    const tr = document.createElement('tr');
    tr.id = elem._id;

    const tdFecha = document.createElement('td');
    const tdCodCliente = document.createElement('td');
    const tdCliente = document.createElement('td');
    const tdTipo = document.createElement('td');
    const tdCantidad = document.createElement('td');
    const tdPrecio = document.createElement('td');
    const tdTotal = document.createElement('td');

    tdFecha.innerText = parsearFecha(elem.fecha);
    tdCodCliente.innerText = elem.cliente;
    tdCliente.innerText = elem.nombreCliente;
    tdTipo.innerText = elem.tipo_comp;
    tdCantidad.innerText = elem.cantidad.toFixed(2);
    tdPrecio.innerText = elem.precio.toFixed(2);
    tdTotal.innerText = (elem.precio * elem.cantidad).toFixed(2);

    tr.appendChild(tdFecha);
    tr.appendChild(tdCodCliente);
    tr.appendChild(tdCliente);
    tr.appendChild(tdTipo);
    tr.appendChild(tdCantidad);
    tr.appendChild(tdPrecio);
    tr.appendChild(tdTotal);

    historicaMovTable.appendChild(tr);
  }
};

window.addEventListener('load', async (e) => {
  filtrar();
  copiar();

  if (permiso !== 0) {
    agregar.classList.add('none');
  }
});

//Vemos si llega una informacion de que se abrio desde otra ventana
ipcRenderer.on('informacion', (e, args) => {
  const botones = args.botones;
  if (!botones) {
    const botones = document.querySelector('.botones');
    botones.classList.add('none');
    ventanaSecundaria = true;
    seleccion.value = 'descripcion';
  }
});

ipcRenderer.on('informacion-a-ventana', (e, args) => {
  const producto = JSON.parse(args);
  const trModificado = document.getElementById(producto._id);
  trModificado.children[1].innerText = producto.descripcion;
  trModificado.children[2].innerText = producto.precio ? producto.precio : trModificado.children[2].innerText;
  trModificado.children[3].innerText = producto.stock ? producto.stock : trModificado.children[3].innerText;
  trModificado.children[4].innerText = producto.marca ? producto.marca : trModificado.children[4].innerText;
});

buscador.addEventListener('keyup', (e) => {
  if ((buscador.value === '' && e.keyCode === 40) || (buscador.value === '' && e.keyCode === 39)) {
    buscador.blur();
  }
});

buscador.addEventListener('change', (e) => {
  filtrar();
});

//cuando ahcemos un click en un tr lo ponemos como que esta seleccionado
tbody.addEventListener('click', async (e) => {
  seleccionado && seleccionado.classList.toggle('seleccionado');
  subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');

  if (e.target.nodeName === 'TD') {
    seleccionado = e.target.parentNode;
    subSeleccionado = e.target;
  } else if (e.target.nodeName === 'DIV') {
    seleccionado = e.target.parentNode.parentNode;
    subSeleccionado = e.target.parentNode;
  } else if (e.target.nodeName === 'SPAN') {
    seleccionado = e.target.parentNode.parentNode.parentNode;
    subSeleccionado = e.target.parentNode.parentNode;
  }

  seleccionado.classList.toggle('seleccionado');
  subSeleccionado.classList.add('subSeleccionado');

  if (e.target.innerHTML === 'delete') {
    sweet
      .fire({
        title: 'Seguro Borrar ' + seleccionado.children[1].innerHTML,
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            const mensaje = (await axios.delete(`${URL}productos/${seleccionado.id}`)).data;
            await sweet.fire({ title: mensaje });
            tbody.removeChild(seleccionado);
            vendedor && (await agregarMovimientoVendedores(`Elimino el producto ${seleccionado.children[1].innerHTML} con el precio ${seleccionado.children[2].innerHTML}`, vendedor));
          } catch (error) {
            console.log(error);
            sweet.fire({
              title: 'No se pudo borrar el producto',
            });
          }
        }
      });
  } else if (e.target.innerHTML === 'edit') {
    abrirVentanaModificar();
  } else if (e.target.innerHTML === 'visibility') {
    historicaMovDiv.classList.remove('none');
    try {
      const { data } = await axios.get(`${URL}movimiento/porProducto/${seleccionado.id}`);
      if (data.ok) {
        listarMovimientos(data.movimientos);
      }
    } catch (error) {
      console.log(error);
      return await sweet.fire('Erro al obtener los movimientos', error?.response?.data?.msg, 'error');
    }
  }
});

agregar.addEventListener('click', (e) => {
  const opciones = {
    path: './productos/agregarProducto.html',
    botones: true,
    altura: 600,
    vendedor: vendedor,
  };
  ipcRenderer.send('abrir-ventana', opciones);
});

ingresarMov.addEventListener('click', ingresarMovimiento);

body.addEventListener('keypress', async (e) => {
  if (e.key === 'Enter' && ventanaSecundaria) {
    if (seleccionado && document.activeElement.nodeName !== 'INPUT') {
      const { isConfirmed, value } = await sweet.fire({
        title: 'Cantidad ',
        input: 'text',
      });

      if (isConfirmed) {
        ipcRenderer.send('enviar', {
          tipo: 'producto',
          informacion: seleccionado.id,
          cantidad: value ? value : 1,
        });
        window.close();
      }
    }
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && ventanaSecundaria) {
    window.close();
  } else if (e.key === 'Escape' && !ventanaSecundaria) {
    location.href = '../menu.html';
  }
  recorrerFlechas(e.keyCode);
});

cerrarMovLista.addEventListener('click', () => {
  historicaMovDiv.classList.add('none');
});

salir.addEventListener('click', (e) => {
  location.href = '../menu.html';
});
