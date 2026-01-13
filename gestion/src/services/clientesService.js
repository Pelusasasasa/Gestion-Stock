const axios = require('axios');
require('dotenv').config();
const URL = process.env.GESTIONURL;

const { Swal } = require('sweetalert2');

const getClienteById = async (id) => {
  try {
    const { data } = await axios.get(`${URL}clientes/id/${id}`);
    console.log(data);
    if (!data.ok) return await Swal.fire('Error al obtener el cliente', data.msg, 'error');
    return data.cliente;
  } catch (error) {
    console.log(error);
    return await Swal.fire('Error al obtener el cliente', `${error?.response?.data?.msg}`, 'error');
  }
};

const putCliente = async (id, cliente, vendedor) => {
  try {
    const { data } = await axios.put(`${URL}clientes/id/${id}`, { ...cliente, vendedor });
    console.log(data);
    if (!data.ok) return await Swal.fire('Error al modificar el cliente', data.msg, 'error');
    return { cliente: data.cliente };
  } catch (error) {
    console.log(error);
    return await Swal.fire('Error al modificar el cliente', `${error?.response?.data?.msg}`, 'error');
  }
};

const deleteCliente = async (id, vendedor) => {
  try {
    const { data } = await axios.delete(`${URL}clientes/id/${id}`, {
      params: { vendedor },
    });
    if (!data.ok) return await Swal.fire('Error al eliminar el cliente', data.msg, 'error');
    return data.ok;
  } catch (error) {
    console.log(error);
    return await Swal.fire('Error al eliminar el cliente', `${error?.response?.data?.msg}`, 'error');
  }
};

module.exports = {
  getClienteById,

  putCliente,

  deleteCliente,
};
