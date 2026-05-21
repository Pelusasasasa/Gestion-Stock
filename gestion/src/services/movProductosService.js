const axios = require('axios');
require('dotenv').config();
const url = process.env.GESTIONURL;
const Swal = require('sweetalert2');

const getMovimientoForNumberAndType = async (number, type) => {
  try {
    const { data } = await axios.get(`${url}movimiento/${number}/${type}`);
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getMovimientosRecibosForNumber = async (number) => {
  try {
    const { data } = await axios.get(`${url}movRecibo/forNumber/${number}`);
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const patchMovNumeroSerie = async (id, series) => {
  try {
    const { data } = await axios.patch(`${url}movimiento/serie/${id}`, { series });
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    return await Swal.fire('Error al modificar el movimiento', `${error?.response?.data?.msg}`, 'error');
  }
};

const putMovimientos = async (movimiento) => {
  try {
    const { data } = await axios.put(`${url}movimiento`, movimiento);
    if (!data.ok) return await sweet.fire('Error al modificar el movimiento', data.msg, 'error');
    return data.movimiento;
  } catch (error) {
    console.log(error);
    return await sweet.fire('Error al modificar el movimiento', `${error?.response?.data?.msg}`, 'error');
  }
};

const deleteMovimientos = async (number, type) => {
  try {
    await axios.delete(`${url}movimiento/${number}/${type}`);
    return {
      ok: true,
      msg: 'Movimiento Eliminado',
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      msg: 'No se pudo eliminar el movimiento',
    };
  }
};

module.exports = {
  getMovimientoForNumberAndType,
  getMovimientosRecibosForNumber,

  patchMovNumeroSerie,
  putMovimientos,

  deleteMovimientos,
};
