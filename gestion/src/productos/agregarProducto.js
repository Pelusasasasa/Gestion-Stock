const dolarInstalador = document.querySelector('#dolarInstalador');

//Identificador
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
const guardar = document.querySelector('.guardar');
const salir = document.querySelector('.salir');

const sweet = require('sweetalert2');
const { cerrarVentana, apretarEnter, redondear, agregarMovimientoVendedores, verificarDatos } = require('../helpers');

const archivo = require('../configuracion.json');

const axios = require('axios');
const { ipcRenderer } = require('electron');
require('dotenv').config();
const url = process.env.GESTIONURL;

let vendedor;

const calcularCosto = (costo, impuesto, dolar) => {
  if (parseFloat(costoDolar.value) !== 0) {
    return (costo + (costo * impuesto) / 100) * dolar;
  } else {
    return costo + (costo * impuesto) / 100;
  }
};

//Funciones
const traerRubros = async () => {
  const rubros = (await axios.get(`${url}rubro`)).data;
  for await (let { numero, rubro } of rubros) {
    const option = document.createElement('option');
    ((option.text = numero + ' - ' + rubro), (option.value = rubro));
    select.appendChild(option);
  }
};

const traerProvedores = async () => {
  const { data } = await axios.get(`${url}provedores`);
  for await (let { nombre } of data.provedores) {
    const option = document.createElement('option');
    ((option.text = nombre), (option.value = nombre));
    provedor.appendChild(option);
  }
};

const traerMarcas = async () => {
  const marcas = (await axios.get(`${url}marca`)).data;
  for await (let { nombre } of marcas) {
    const option = document.createElement('option');
    ((option.text = nombre), (option.value = nombre));
    marca.appendChild(option);
  }
};

ipcRenderer.on('informacion', (e, args) => {
  vendedor = args.vendedor;
});

window.addEventListener('load', async (e) => {
  if (!archivo.dolar) {
    costoDolar.setAttribute('disabled', '');
  }
  dolar.value = (await axios.get(`${url}numero`)).data.Dolar.toFixed(2);
  dolarInstalador.value = (await axios.get(`${url}numero`)).data.dolarInstalador.toFixed(2);

  traerRubros();
  traerProvedores();
  traerMarcas();
});

guardar.addEventListener('click', async (e) => {
  const producto = {};
  e.preventDefault();
  const verificacion = await verificarDatos();

  if (verificacion) {
    producto._id = codigo.value;
    producto.descripcion = descripcion.value.trim().toUpperCase();
    producto.codigoSecundario = codigoSecundario.value;
    producto.marca = marca.value.trim().toUpperCase();
    producto.rubro = rubro.value.trim();
    producto.provedor = provedor.value.toUpperCase().trim();
    producto.stock = stock.value;
    producto.costo = costo.value;
    producto.costoDolar = costoDolar.value;
    producto.utilidad = utilidad.value;
    producto.impuesto = impuesto.value === '' ? 0 : impuesto.value;
    producto.ganancia = ganancia.value;
    producto.precio = total.value;
    producto.unidad = unidad.value;

    const { estado, mensaje } = (await axios.post(`${url}productos`, producto)).data;

    await sweet.fire({
      title: mensaje,
      icon: 'success',
      confirmButtonText: 'Aceptar',
    });

    //Si el estado es true de que se guardo el producto salimos de la pagina Y guaradmos el movimineto del vendeor si esta activado
    if (estado) {
      await ipcRenderer.send('informacion-a-ventana-principal', producto);
      vendedor && (await agregarMovimientoVendedores(`Cargo el producto ${producto.descripcion} con el precio ${producto.precio}`, vendedor));
      window.close();
    }
  }
});

codigo.addEventListener('keypress', async (e) => {
  if (e.keyCode === 13) {
    if (codigo.value !== '') {
      const producto = (await axios.get(`${url}productos/${codigo.value}`)).data;
      if (producto) {
        await sweet.fire({
          title: 'Codigo Ya utilizado por ' + producto.descripcion,
        });
        codigo.value = '';
        codigo.focus();
      } else {
        apretarEnter(e, descripcion);
      }
    }
  }
});

descripcion.addEventListener('keypress', (e) => {
  apretarEnter(e, unidad);
});

unidad.addEventListener('keypress', (e) => {
  e.preventDefault();
  apretarEnter(e, marca);
});

marca.addEventListener('keypress', (e) => {
  e.preventDefault();
  apretarEnter(e, rubro);
});

rubro.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    provedor.focus();
  }
});

provedor.addEventListener('keypress', (e) => {
  e.preventDefault();
  apretarEnter(e, stock);
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

ganancia.addEventListener('keypress', (e) => {
  apretarEnter(e, total);
});

total.addEventListener('keypress', (e) => {
  apretarEnter(e, guardar);
});

salir.addEventListener('click', (e) => {
  window.close();
});

document.addEventListener('keydown', (e) => {
  cerrarVentana(e);
});

codigo.addEventListener('focus', (e) => {
  codigo.select();
});

descripcion.addEventListener('focus', async (e) => {
  descripcion.select();
});

marca.addEventListener('focus', (e) => {
  marca.select();
});

provedor.addEventListener('focus', (e) => {
  provedor.select();
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
  impuesto.value = impuesto.value === '' ? 0 : impuesto.value;
  if (parseFloat(costoDolar.value) !== 0) {
    costoIvaInstalador.value = ((parseFloat(costoUtilidad.value) + (parseFloat(costoUtilidad.value) * parseFloat(impuesto.value)) / 100) * parseFloat(dolarInstalador.value)).toFixed(2);
  } else {
    costoIvaInstalador.value = (parseFloat(costoUtilidad.value) + parseFloat(costoUtilidad.value) * parseFloat(impuesto.value / 100)).toFixed(2);
  }
});

total.addEventListener('focus', (e) => {
  const costoAux = calcularCosto(parseFloat(costoUtilidad.value), parseFloat(impuesto.value), parseFloat(dolar.value));
  total.value = (parseFloat(costoAux) + (parseFloat(costoAux) * parseFloat(ganancia.value)) / 100).toFixed(2);
});
