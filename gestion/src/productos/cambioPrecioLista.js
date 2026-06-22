require('dotenv').config();

const swet = require('sweetalert2');
const axios = require('axios');
const xlsx = require('xlsx');

const url = process.env.GESTIONURL;

const tipo = document.getElementById('tipo');
const archivo = document.getElementById('archivo');

const mensaje = document.getElementById('mensaje');

const tbody = document.getElementById('tbody');

const guardar = document.getElementById('guardar');

let productosModificados = [];

let dolar = 0;

archivo.addEventListener('change', (e) => {
  let selectedFile = e.target.files[0];
  let fileReader = new FileReader();

  fileReader.onload = async (e) => {
    let data = e.target.result;
    let woorbook = xlsx.read(data, { type: 'binary' });

    let { data: res } = await axios.get(`${url}productos/porMarca/${tipo.value}`);

    await llenarLista(res.productos);

    if (tipo.value === 'HIKVISION') {
      let datos = xlsx.utils.sheet_to_json(woorbook.Sheets['Lista']);
      cambiarPrecioshikvision(datos, res.productos);
    }
  };

  fileReader.readAsBinaryString(selectedFile);
});

const apretarTecla = (e) => {
  if (e.keyCode === 27) {
    window.close();
  }
};

const cambiarPrecioshikvision = (datos, productos) => {
  for (let producto of productos) {
    let productoAux = datos.find((elem) => producto._id == elem.SAP);
    if (!productoAux) {
      productoAux = datos.find((elem) => elem.SAP == producto.codigoSecundario);
    }
    if (!productoAux) continue;

    //productoAux.GREMIO = productoAux?.GREMIO?.replace(',', '.');
    //productoAux.GREMIO = parseFloat(productoAux.GREMIO.replace('USD', ''));
    if (productoAux.SAP == '300512639') console.log(productoAux.GREMIO);

    if (producto.costoDolar !== 0) {
      producto.costoDolar = productoAux ? productoAux.GREMIO : producto.costoDolar;
    } else {
      producto.costo = productoAux ? productoAux.GREMIO : producto.costoDolar;
    }

    productosModificados.push(producto);

    const tdCostoNuevo = document.createElement('td');
    const tdPrecioNuevo = document.createElement('td');
    const tdPorcentaje = document.createElement('td');

    const costo_Iva =
      producto.costoDolar !== 0 ? (producto.costoDolar + (producto.costoDolar * producto.impuesto) / 100) * dolar : producto.costoDolar + (producto.costoDolar * producto.impuesto) / 100;

    const utilidad = costo_Iva + (costo_Iva * producto.ganancia) / 100;

    producto.precio = parseFloat(utilidad.toFixed(2));
    let porcentaje = 0;

    tdCostoNuevo.value = producto.costoDolar.toFixed(2);
    tdPrecioNuevo.value = utilidad.toFixed(2);

    const tr = document.getElementById(producto._id);
    porcentaje = producto.precio !== 0 ? ((producto.precio - parseFloat(tr.children[4].innerText)) / parseFloat(tr.children[4].innerText)) * 100 : 0;
    tdPorcentaje.value = porcentaje.toFixed(2) + ' %';

    tr.children[5].innerText = tdCostoNuevo.value;
    tr.children[6].innerText = tdPrecioNuevo.value;
    tr.children[7].innerText = tdPorcentaje.value;
  }
};

const cargarArchvio = async () => {
  const { data } = await axios.get(`${url}numero`);
  dolar = data.Dolar;
};

const guardarCambios = async () => {
  if (productosModificados.length === 0) return swet.fire('No hay productos a modificar');

  const { data } = await axios.put(`${url}productos`, productosModificados);

  if (data.ok) {
    await swet.fire('Modificar Varios Productos', `${data.msg}`, 'success');
  } else {
    await swet.fire('Modificar Varios Productos', `${data.msg}`, 'error');
  }

  window.close();
};

const llenarLista = async (productos) => {
  for (let producto of productos) {
    const tr = document.createElement('tr');
    tr.id = producto._id;

    const tdCodigo = document.createElement('td');
    const tdDescripcion = document.createElement('td');
    const tdCodigoSecundario = document.createElement('td');
    const tdCosto = document.createElement('td');
    const tdPrecio = document.createElement('td');
    const tdCostoNuevo = document.createElement('td');
    const tdPrecioNuevo = document.createElement('td');
    const tdPorcentaje = document.createElement('td');

    tdCodigo.classList.add('border', 'text-center');
    tdDescripcion.classList.add('border', 'text-center');
    tdCodigoSecundario.classList.add('border', 'text-center');
    tdCosto.classList.add('border', 'text-center');
    tdPrecio.classList.add('border', 'text-center');
    tdCostoNuevo.classList.add('border', 'text-center');
    tdPrecioNuevo.classList.add('border', 'text-center');
    tdPorcentaje.classList.add('border', 'text-center');

    tdCodigo.textContent = producto._id;
    tdDescripcion.textContent = producto.descripcion.slice(0, 30);
    tdCodigoSecundario.textContent = producto.codigoSecundario;
    tdCosto.textContent = producto.costoDolar !== 0 ? producto.costoDolar.toFixed(2) : producto.costo.toFixed(2);
    tdPrecio.textContent = producto.precio.toFixed(2);
    tdCostoNuevo.textContent = tdCosto.textContent;
    tdPrecioNuevo.textContent = tdPrecio.textContent;
    tdPorcentaje.textContent = '0.00';

    tr.appendChild(tdCodigo);
    tr.appendChild(tdDescripcion);
    tr.appendChild(tdCodigoSecundario);
    tr.appendChild(tdCosto);
    tr.appendChild(tdPrecio);
    tr.appendChild(tdCostoNuevo);
    tr.appendChild(tdPrecioNuevo);
    tr.appendChild(tdPorcentaje);

    tbody.appendChild(tr);
  }
};

const mostrarMensaje = (e) => {
  if (e.target.value === 'HIKVISION') {
    mensaje.innerText = 'La Columa del codigo de barra tiene que llamarse "SAP" y la del precio final "GREMIO", tambien la hoja del excel tiene que llamarse "Lista"';
  }
};

document.addEventListener('keyup', apretarTecla);

guardar.addEventListener('click', guardarCambios);

tipo.addEventListener('focus', mostrarMensaje);

window.addEventListener('load', cargarArchvio);
