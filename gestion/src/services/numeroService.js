const axios = require('axios');
require('dotenv').config();
const url = process.env.GESTIONURL;
const Swal = require('sweetalert2');

const getNumero = async () => {
  try {
    const { data } = await axios.get(`${url}numero`);
    return data;
  } catch (error) {
    console.log(error);
    return await Swal.fire('No se pudo traer el dolar', error?.response?.data?.msg, 'error');
  }
};

module.exports = {
  getNumero,
};
