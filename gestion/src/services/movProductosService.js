const axios = require('axios');
const getMovimientoForNumberAndType = async (number, type) => {
  try {
    const { data } = await axios.get(`${URL}movimiento/${number}/${type}`);
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getMovimientosRecibosForNumber = async (number) => {
  try {
    const { data } = await axios.get(`${URL}movRecibo/forNumber/${number}`);
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const putMovimientos = async (movimiento) => {
  try {
    const { data } = await axios.put(`${URL}movimiento`, movimiento);
    if (!data.ok) return await sweet.fire('Error al modificar el movimiento', data.msg, 'error');
    return data.movimiento;
  } catch (error) {
    console.log(error);
    return await sweet.fire('Error al modificar el movimiento', `${error?.response?.data?.msg}`, 'error');
  }
};

module.exports = {
  getMovimientoForNumberAndType,
  getMovimientosRecibosForNumber,

  putMovimientos,
};
