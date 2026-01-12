const axios = require('axios');
const getVentaForNumberAndType = async (number, type) => {
  try {
    const { data } = await axios.get(`${URL}ventas/numeroYtipo/${number}/${type}`);
    return data;
  } catch (error) {
    console.log(error);
    await sweet.fire('No se pudo traer la venta', error?.response?.data?.msg, 'error');
  }
};

const putVentaForNumeroAndType = async (venta) => {
  try {
    const { data } = await axios.put(`${URL}ventas/id/${venta.numero}/${venta.tipo_venta}`, venta);
    console.log(data);

    if (!data.ok) return await sweet.fire('Error al modificar la venta', data.msg, 'error');
    return data.venta;
  } catch (error) {
    console.log(error);
    return await sweet.fire('Error al modificar la venta', `${error?.response?.data?.msg}`, 'error');
  }
};
module.exports = {
  getVentaForNumberAndType,
  putVentaForNumeroAndType,
};
