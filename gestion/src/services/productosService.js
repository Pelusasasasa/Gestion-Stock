const axios = require('axios');
require('dotenv').config();

const url = process.env.GESTIONURL;
const getPrecio = async (codProd) => {
  try {
    const { data } = await axios.get(`${url}productos/traerPrecio/${codProd}`);
    return data;
  } catch (error) {
    console.log(error);
    await sweet.fire('No se pudo traer el precio', error?.response?.data?.msg, 'error');
  }
};

const getCostoImpuesto = async (codProd) => {
  try {
    const { data } = await axios.get(`${url}productos/traerCostoImpuesto/${codProd}`);
    return data;
  } catch (error) {
    console.log(error);
    await sweet.fire('No se pudo traer el costo', error?.response?.data?.msg, 'error');
  }
};

module.exports = {
  getPrecio,
  getCostoImpuesto,
};
