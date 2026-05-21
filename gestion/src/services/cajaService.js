const axios = require('axios');
const { Swal } = require('sweetalert2');
require('dotenv').config();

const url = process.env.GESTIONURL;

const getCajaForDia = async (tipoFecha, desde, hasta) => {
  try {
    const { data } = await axios.get(`${url}caja/${tipoFecha}/${desde}/${hasta}`);
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

const getCajaForFecha = async (tipoFecha, fecha) => {
  try {
    const { data } = await axios.get(`${url}caja/${tipoFecha}/${fecha}`);
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
  getCajaForDia,
  getCajaForFecha,
};
