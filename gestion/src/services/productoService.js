const axios = require('axios');
require('dotenv').config();
const url = process.env.GESTIONURL;
const Swal = require('sweetalert2');

const getProductoById = async (id) => {
  try {
    if (!id) return null;
    const { data } = await axios.get(`${url}productos/${id}`);
    return data;
  } catch (error) {
    console.log(error);
    await Swal.fire('No se pudo traer el producto', error?.response?.data?.msg, 'error');
    return null;
  }
};

const getProductoByType = async (value, type) => {
  try {
    const { data } = await axios.get(`${url}productos/${value}/${type}`);
    return data;
  } catch (error) {
    console.log(error);
    await Swal.fire('No se pudo traer el producto', error?.response?.data?.msg, 'error');
    return null;
  }
};

const getProductoByNombre = async (nombre) => {
  try {
    const { data } = await axios.get(`${url}productos/nombre/${nombre}`);
    return data;
  } catch (error) {
    console.log(error);
    await Swal.fire('No se pudo traer el producto', error?.response?.data?.msg, 'error');
    return null;
  }
};

module.exports = {
  getProductoById,
  getProductoByType,
  getProductoByNombre,
};
