const axios = require('axios');
require('dotenv').config();
const URL = process.env.GESTIONURL;

const getReciboById = async (id) => {
  try {
    const { data } = await axios.get(`${URL}recibo/id/${id}`);
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const postRecibo = async (recibo) => {
  try {
    const { data } = await axios.post(`${URL}recibo`, recibo);
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const putRecibo = async (recibo) => {
  try {
    const { data } = await axios.put(`${URL}recibo/id/${recibo._id}`, recibo);
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = {
  getReciboById,

  postRecibo,

  putRecibo,
};
