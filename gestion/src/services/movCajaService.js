const axios = require('axios');
const { default: Swal } = require('sweetalert2');
require('dotenv').config();
const URL = process.env.GESTIONURL;

const postMovCaja = async (movCaja) => {
  try {
    const { data } = await axios.post(`${URL}movCaja`, movCaja);
    if (data.ok) {
      return data.movCaja;
    }

    await Swal.fire('No se pudo cargar el mov de caja', data?.msg || 'error', 'error');
    return false;
  } catch (error) {
    console.error(error.response.data);
    await Swal.fire('No se pudo cargar el mov de caja', error?.response?.data?.msg || 'error', 'error');
    return false;
  }
};

module.exports = {
  postMovCaja,
};
