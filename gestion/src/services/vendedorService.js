const axios = require('axios');
const { default: Swal } = require('sweetalert2');
require('dotenv').config();

const url = process.env.GESTIONURL;

const getVendedores = async () => {
  try {
    const { data } = await axios.get(`${url}vendedores`);
    if (!data.ok) return await Swal.fire('Error al cargar los vendedores', '', 'error');
    return data.vendedores;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const postVendedor = async (vendedor) => {
  try {
    const { data } = await axios.post(`${url}vendedores`, vendedor);

    if (!data.ok) {
      await Swal.fire('Error al cargar el vendedor', '', 'error');
      return null;
    }

    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const putVendedor = async (vendedor, id) => {
  console.log(vendedor);
  try {
    const { data } = await axios.put(`${url}vendedores/id/${id}`, vendedor);

    if (!data.ok) {
      await Swal.fire('Error al cargar el vendedor', '', 'error');
      return null;
    }

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const deleteVendedor = async (id) => {
  try {
    const { data } = await axios.delete(`${url}vendedores/id/${id}`);

    if (!data.ok) {
      await Swal.fire('Error al cargar el vendedor', '', 'error');
      return null;
    }

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

module.exports = {
  getVendedores,

  postVendedor,

  putVendedor,

  deleteVendedor,
};
