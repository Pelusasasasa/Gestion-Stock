const axios = require('axios');
const { Swal } = require('sweetalert2');
require('dotenv').config();

const URL = process.env.GESTIONURL;

const getCajaForFecha = async (tipoFecha, fecha) => {
  try {
    const { data } = await axios.get(`${URL}caja/${tipoFecha}/${fecha}`);
    console.log(data);
    if (!data.ok) return await Swal.fire('Error al obtener la caja', data.msg, 'error');

    return {
      ok: true,
      ventas: data.ventas.filter((venta) => venta.tipo_venta === 'CD'),
      recibos: data.recibos,
      cuentaCorrientes: data.ventas.filter((venta) => venta.tipo_venta === 'CC'),
      gastos: data.gastos,
    };
  } catch (error) {
    console.log(error);
    return await Swal.fire('Error al obtener la caja', `${error?.response?.data?.msg}`, 'error');
  }
};

module.exports = {
  getCajaForFecha,
};
