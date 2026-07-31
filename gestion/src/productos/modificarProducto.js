const { ipcRenderer } = require('electron');
const { cerrarVentana, apretarEnter, redondear, agregarMovimientoVendedores, verificarDatos } = require('../helpers');
const sweet = require('sweetalert2');

const axios = require('axios');
require('dotenv').config();
const url = process.env.GESTIONURL;

const archivo = require('../configuracion.json');

//Identificador
const dolar = document.getElementById('dolar');
const dolarInstalador = document.getElementById('dolarInstalador');

const codigo = document.querySelector('#codigo');
const descripcion = document.querySelector('#descripcion');
const codigoSecundario = document.querySelector('#codigoSecundario');
//Informacion
const unidad = document.querySelector('#unidad');
const marca = document.querySelector('#marca');
const select = document.querySelector('#rubro');
const provedor = document.querySelector('#provedor');
const stock = document.querySelector('#stock');
//Precio
const costo = document.querySelector('#costo');
const costoDolar = document.querySelector('#costoDolar');
const utilidad = document.querySelector('#utilidad');
const costoUtilidad = document.querySelector('#costoUtilidad');
const impuesto = document.querySelector('#impuesto');

const costoIvaInstalador = document.querySelector('#costoIvaInstalador');
//Total
const ganancia = document.querySelector('#ganancia');
const total = document.querySelector('#total');
//Botones
const modificar = document.querySelector('.modificar');
const salir = document.querySelector('.salir');

let vendedor;

const calcularCosto = (costo, impuesto, dolar) => {
  if (parseFloat(costoDolar.value) !== 0) {
    return (costo + (costo * impuesto) / 100) * dolar;
  } else {
    return costo + (costo * impuesto) / 100;
  }
};

const traerRubros = async () => {
  const { data } = (await axios.get(`${url}rubro`));
  const rubros = data.rubros || [];
  for await (let { rubro, numero } of rubros) {
    const option = document.createElement('option');
    option.text = numero + '-' + rubro;
    option.id = numero;
    option.value = rubro;
    select.appendChild(option);
  }
};

const traerProvedor = async () => {
  const { data } = await axios.get(`${url}provedores`);
  for await (let { nombre } of data.provedores) {
    const option = document.createElement('option');
    ((option.text = nombre), (option.value = nombre));
    provedor.appendChild(option);
  }
};

const traerMarcas = async () => {
  const { data } = (await axios.get(`${url}marca`));
  const marcas = data.marcas || [];
  for await (let { nombre } of marcas) {
    const option = document.createElement('option');
    ((option.text = nombre), (option.value = nombre));
    marca.appendChild(option);
  }
};

//Recibimos la informacion del producto para luego llenar los inputs
ipcRenderer.on('informacion', async (e, args) => {
  if (!archivo.dolar) {
    costoDolar.setAttribute('disabled', '');
  }
  dolar.value = (await axios.get(`${url}numero/Dolar`)).data.toFixed(2);
  dolarInstalador.value = (await axios.get(`${url}numero/dolarInstalador`)).data.toFixed(2);

  const { informacion } = args;
  vendedor = args.vendedor;
  await traerRubros();
  await traerProvedor();
  await traerMarcas();

  llenarInputs(informacion);
});

//llenamos los inputs con la informacion que tenemos
const llenarInputs = async (codigoProducto) => {
  codigo.value = codigoProducto;

  const id = codigo.value.replace(/\//g, '%2F');
  const producto = (await axios.get(`${url}productos/${id}`)).data;

  descripcion.value = producto.descripcion;
  codigoSecundario.value = producto.codigoSecundario;
  unidad.value = producto.unidad;
  marca.value = producto.marca;
  select.value = producto.rubro;
  provedor.value = producto.provedor;
  stock.value = producto.stock;
  costo.value = producto.costo.toFixed(2);
  costoDolar.value = producto.costoDolar.toFixed(2);
  utilidad.value = producto?.utilidad?.toFixed(2) ?? 0;
  impuesto.value = producto.impuesto.toFixed(2);

  if (producto.costoDolar !== 0) {
    costoUtilidad.value = redondear(producto.costoDolar + (producto.costoDolar * (producto.utilidad ?? 0)) / 100, 2);
    costoIvaInstalador.value = redondear((parseFloat(costoUtilidad.value) + (parseFloat(costoUtilidad.value) * producto.impuesto) / 100) * parseFloat(dolarInstalador.value), 2);
  } else {
    costoUtilidad.value = redondear(producto.costo + (producto.costo * producto.utilidad) / 100, 2);
    costoIvaInstalador.value = redondear(parseFloat(costoUtilidad.value) + (parseFloat(costoUtilidad.value) * producto.impuesto) / 100, 2);
  }
  ganancia.value = producto.ganancia.toFixed(2);
  total.value = producto.precio.toFixed(2);
};

//al hacer click modificamos los productos con el valor de los inputs
modificar.addEventListener('click', async (e) => {
  const verificacion = await verificarDatos();

  if (verificacion) {
    const producto = {};
    producto._id = codigo.value;
    producto.descripcion = descripcion.value.trim().toUpperCase();
    producto.codigoSecundario = codigoSecundario.value;
    producto.unidad = unidad.value;
    producto.marca = marca.value.trim().toUpperCase();
    producto.rubro = rubro.value;
    producto.provedor = provedor.value.trim().toUpperCase();
    producto.stock = parseFloat(stock.value).toFixed(2);
    producto.costo = parseFloat(costo.value).toFixed(2);
    producto.costoDolar = parseFloat(costoDolar.value).toFixed(2);
    producto.utilidad = parseFloat(utilidad.value).toFixed(2);
    producto.impuesto = parseFloat(impuesto.value).toFixed(2);
    producto.ganancia = parseFloat(ganancia.value).toFixed(2);
    producto.precio = parseFloat(total.value).toFixed(2);

    const { mensaje, estado } = (await axios.put(`${url}productos/${producto._id.replace(/\//g, '%2F')}`, producto)).data;

    await ipcRenderer.send('informacion-a-ventana', producto);

    vendedor && (await agregarMovimientoVendedores(`Modifico el producto ${producto.descripcion} con el precio ${producto.precio}`, vendedor));

    await sweet.fire('Producto Modificado Correctamente', '', 'success');

    if (estado) {
      window.close();
    }
  }
});

codigo.addEventListener('keypress', (e) => {
  apretarEnter(e, descripcion);
});

descripcion.addEventListener('keypress', (e) => {
  apretarEnter(e, unidad);
});

unidad.addEventListener('keypress', (e) => {
  e.preventDefault();
  apretarEnter(e, marca);
});

marca.addEventListener('keypress', (e) => {
  apretarEnter(e, rubro);
});

rubro.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    provedor.focus();
  }
});

provedor.addEventListener('keypress', (e) => {
  e.preventDefault();
  apretarEnter(e, costo);
});

stock.addEventListener('keypress', (e) => {
  apretarEnter(e, costo);
});

costo.addEventListener('keypress', (e) => {
  if (costoDolar.hasAttribute('disabled')) {
    apretarEnter(e, impuesto);
  } else {
    apretarEnter(e, costoDolar);
  }
});

costoDolar.addEventListener('keypress', (e) => {
  apretarEnter(e, utilidad);
});

utilidad.addEventListener('keypress', (e) => {
  apretarEnter(e, impuesto);

  if (e.key === 'Enter') {
    if (parseFloat(costoDolar.value) !== 0) {
      costoUtilidad.value = redondear(parseFloat(costoDolar.value) + (parseFloat(costoDolar.value) * parseFloat(utilidad.value)) / 100, 2);
    } else {
      costoUtilidad.value = redondear(parseFloat(costo.value) + (parseFloat(costo.value) * parseFloat(utilidad.value)) / 100, 2);
    }
  }
});

impuesto.addEventListener('keypress', (e) => {
  apretarEnter(e, ganancia);
});

costoIvaInstalador.addEventListener('keypress', (e) => {
  apretarEnter(e, ganancia);
});

ganancia.addEventListener('keypress', (e) => {
  apretarEnter(e, total);
});

total.addEventListener('keypress', (e) => {
  apretarEnter(e, modificar);
});

descripcion.addEventListener('focus', (e) => {
  descripcion.select();
});

marca.addEventListener('focus', (e) => {
  marca.select();
});

stock.addEventListener('focus', (e) => {
  stock.select();
});

costo.addEventListener('focus', (e) => {
  costo.select();
});

costoDolar.addEventListener('focus', (e) => {
  costoDolar.select();
});
utilidad.addEventListener('focus', (e) => {
  utilidad.select();
});

impuesto.addEventListener('focus', (e) => {
  impuesto.select();
});

ganancia.addEventListener('focus', (e) => {
  ganancia.select();
});

total.addEventListener('focus', (e) => {
  total.select();
});

impuesto.addEventListener('blur', (e) => {
  if (parseFloat(costoDolar.value) !== 0) {
    costoIvaInstalador.value = redondear((parseFloat(costoUtilidad.value) + (parseFloat(costoUtilidad.value) * parseFloat(impuesto.value)) / 100) * parseFloat(dolarInstalador.value), 2);
  } else {
    costoIvaInstalador.value = (parseFloat(costoUtilidad.value) + parseFloat(costoUtilidad.value) * (parseFloat(impuesto.value) / 100)).toFixed(2);
  }
});

ganancia.addEventListener('blur', (e) => {
  const costoAux = calcularCosto(parseFloat(costoUtilidad.value), parseFloat(impuesto.value), parseFloat(dolar.value));
  total.value = Math.round((parseFloat(costoAux) * parseFloat(ganancia.value)) / 100 + parseFloat(costoAux)).toFixed(2);
});

salir.addEventListener('click', (e) => {
  window.close();
});

document.addEventListener('keydown', (e) => {
  cerrarVentana(e);
});
