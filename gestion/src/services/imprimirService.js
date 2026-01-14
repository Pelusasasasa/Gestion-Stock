const axios = require('axios');
const { Swal } = require('sweetalert2');
require('dotenv').config();

const URL = process.env.GESTIONURL;

const getInfoImprimir = async (id) => {
  try {
    const { data } = await axios.get(`${URL}imprimir/${id}`);
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
