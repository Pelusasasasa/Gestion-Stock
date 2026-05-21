const axios = require('axios');
require('dotenv').config();
const url = process.env.GESTIONURL;
const sweet = require('sweetalert2');

const select = document.getElementById('provedores');
const porcentaje = document.getElementById('porcentaje');
const aceptar = document.getElementById('aceptar');
const salir = document.getElementById('salir');

window.addEventListener('load', async (e) => {
  const { data } = await axios.get(`${url}provedores`);
  if (data.ok) {
    listarProvedores(data.provedores);
  } else {
    await sweet.fire('Error al traer los provedores', data.msg, 'error');
  }
});

aceptar.addEventListener('click', async (e) => {
  const mensaje = (
    await axios.put(`${url}productos/provedores`, {
      provedor: select.value,
      porcentaje: parseFloat(porcentaje.value),
    })
  ).data;

  await sweet.fire({
    title: mensaje,
  });

  window.close();
});

select.addEventListener('keypress', (e) => {
  if (e.keyCode === 13) {
    e.preventDefault();
    porcentaje.focus();
  }
});

porcentaje.addEventListener('keypress', (e) => {
  if (e.keyCode === 13) {
    aceptar.focus();
  }
});

const listarProvedores = async (lista) => {
  for await (let elem of lista) {
    const option = document.createElement('option');
    option.value = elem.nombre;
    option.text = elem.nombre;

    select.appendChild(option);
  }
};

salir.addEventListener('click', (e) => {
  window.close();
});

document.addEventListener('keyup', (e) => {
  if (e.keyCode === 27) {
    window.close();
  }
});
