const axios = require('axios');
require('dotenv').config();
const url = process.env.GESTIONURL;

const postRetencion = async (retencion) => {
  try {
    const { data } = await axios.post(`${url}retencion`, retencion);
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = {
  postRetencion,
};
