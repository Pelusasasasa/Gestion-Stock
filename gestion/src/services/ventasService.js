const axios = require('axios');
require('dotenv').config();
const URL = process.env.GESTIONURL;
const { Swal } = require('sweetalert2');

const getVentaForNumberAndType = async (number, type) => {
  try {
    const { data } = await axios.get(`${URL}ventas/numeroYtipo/${number}/${type}`);
    return data;
  } catch (error) {
    console.log(error);
    await Swal.fire('No se pudo traer la venta', error?.response?.data?.msg, 'error');
  }
};

const putVentaForNumeroAndType = async (venta) => {
  try {
    const { data } = await axios.put(`${URL}ventas/id/${venta.numero}/${venta.tipo_venta}`, venta);
    console.log(data);

    if (!data.ok) return await Swal.fire('Error al modificar la venta', data.msg, 'error');
    return data.venta;
  } catch (error) {
    console.log(error);
    return await Swal.fire('Error al modificar la venta', `${error?.response?.data?.msg}`, 'error');
  }
};

const deleteVentaForNumeroAndType = async (number, type, vendedor) => {
  try {
    const { data } = await axios.delete(`${URL}ventas/id/${number}/${type}`, {
      params: {
        vendedor,
      },
    });
    console.log(data);

    if (!data.ok) return await Swal.fire('Error al eliminar la venta', data.msg, 'error');
    return data.venta;
  } catch (error) {
    console.log(error);
    return await Swal.fire('Error al eliminar la venta', `${error?.response?.data?.msg}`, 'error');
  }
};

module.exports = {
  getVentaForNumberAndType,
  putVentaForNumeroAndType,
  deleteVentaForNumeroAndType,
};
