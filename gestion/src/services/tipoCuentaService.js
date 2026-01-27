const axios = require('axios');
const { default: Swal } = require('sweetalert2');
require('dotenv').config();
const URL = process.env.GESTIONURL;

const getTipoCuentas = async () => {
  try {
    const { data } = await axios.get(`${URL}tipocuenta`);

    if (data.ok) {
      return data.tipoCuentas;
    }
    await Swal.fire('No se pudo cargar el tipo de cuenta', data?.msg || 'error', 'error');
    return false;
  } catch (error) {
    console.error(error);
    await Swal.fire('No se pudo cargar el tipo de cuenta', error?.response?.data?.msg || 'error', 'error');
    return false;
  }
};

module.exports = {
  getTipoCuentas,
};
