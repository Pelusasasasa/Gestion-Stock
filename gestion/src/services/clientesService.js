const axios = require('axios');
require('dotenv').config();
const URL = process.env.GESTIONURL;

const { Swal } = require('sweetalert2');

const getUltimoId = async () => {
  try {
    const { data } = await axios.get(`${URL}clientes`);
    console.log(data);

    if (!data.ok) return await Swal.fire('Error al obtener el ultimo id', data.msg, 'error');
    return data.id;
  } catch (error) {
    console.log(error);
    return await Swal.fire('Error al obtener el ultimo id', `${error?.response?.data?.msg}`, 'error');
  }
};

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

const searchClientes = async (nombre) => {
  try {
    const { data } = await axios.get(`${URL}clientes/buscar/${nombre === '' ? 'NADA' : nombre}`);
    if (data.ok) {
      return data.clientes;
    } else {
      return await Swal.fire(`Error al obtener los clientes`, data.msg, 'error');
    }
  } catch (error) {
    console.log(error);
    return await Swal.fire(`Error al obtener los clientes`, error?.response?.data?.msg, 'error');
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

const postCliente = async (cliente) => {
  try {
    const { data } = await axios.post(`${URL}clientes`, cliente);
    console.log(data);
    if (!data.ok) return await Swal.fire('Error al agregar el cliente', data.msg, 'error');
    return { cliente: data.cliente, ok: true };
  } catch (error) {
    console.log(error);
    return await Swal.fire('Error al agregar el cliente', `${error?.response?.data?.msg}`, 'error');
  }
};

module.exports = {
  getClienteById,
  getUltimoId,
  searchClientes,

  putCliente,

  postCliente,

  deleteCliente,
};
