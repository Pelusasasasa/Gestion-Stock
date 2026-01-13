const URL = process.env.GESTIONURL;
const axios = require('axios');
require('dotenv').config();

const postCheque = async (cheque) => {
  try {
    const { data } = await axios.post(`${URL}cheques`, cheque);
    return data;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  postCheque,
};
