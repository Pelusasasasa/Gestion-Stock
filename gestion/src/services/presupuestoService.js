const axios = require('axios');
const { Swal } = require('sweetalert2');
require('dotenv').config();

const URL = process.env.GESTIONURL;

const getPresupuestoForFecha = async (tipoFecha, fecha) => {
  try {
    const { data } = await axios.get(`${URL}presupuesto/${tipoFecha}/${fecha}`);
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    return await Swal.fire('Error al obtener el presupuesto', `${error?.response?.data?.msg}`, 'error');
  }
};

module.exports = {
  getPresupuestoForFecha,
};
