const axios = require('axios');
require('dotenv').config();
const URL = process.env.GESTIONURL;
const Swal = require('sweetalert2');

const getRemitoById = async (id) => {
  try {
    const { data } = await axios.get(`${URL}remitos/forId/${id}`);
    if (data.ok) {
      return data.remito;
    }
    return null;
  } catch (error) {
    console.log(error);
    await Swal.fire('No se pudo traer el remito', error?.response?.data?.msg, 'error');
    return null;
  }
};

const getRemitos = async (pasados = false) => {
  try {
    const { data } = await axios.get(`${URL}remitos`, { params: { pasados } });
    if (data.ok) {
      return data.remitos;
    }
    return null;
  } catch (error) {
    console.log(error);
    await Swal.fire('No se pudo traer los remitos', error?.response?.data?.msg, 'error');
    return null;
  }
};

const postRemito = async (remito) => {
  try {
    const { data } = await axios.post(`${URL}remitos`, remito);
    return data;
  } catch (error) {
    console.log(error);
    return await Swal.fire('Error al crear el remito', `${error?.response?.data?.msg}`, 'error');
  }
};

const putRemitoPasado = async (id) => {
  try {
    const { data } = await axios.put(`${URL}remitos/pasado/${id}`);
    return data;
  } catch (error) {
    console.log(error);
    return await Swal.fire('Error al modificar el remito', `${error?.response?.data?.msg}`, 'error');
  }
};

const putObservaciones = async (id, observaciones) => {
  try {
    const { data } = await axios.patch(`${URL}remitos/observaciones/${id}`, { observaciones });
    if (!data.ok) {
      return await Swal.fire('Error al modificar el remito', data.msg, 'error');
    }
    return data;
  } catch (error) {
    console.log(error);
    return await Swal.fire('Error al modificar el remito', `${error?.response?.data?.msg}`, 'error');
  }
};

module.exports = {
  getRemitoById,
  getRemitos,

  postRemito,

  putRemitoPasado,
  putObservaciones,
};
