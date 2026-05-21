const axios = require('axios');
const { Swal } = require('sweetalert2');
require('dotenv').config();

const url = process.env.GESTIONURL;

const getInfoImprimir = async (id, tipo_venta = 'CD') => {
  try {
    const { data } = await axios.get(`${url}imprimir/${id}`, { params: { tipo_venta } });

    return data;
  } catch (error) {
    console.error(error);
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Error al obtener la informacion',
    });
  }
};

module.exports = {
  getInfoImprimir,
};
