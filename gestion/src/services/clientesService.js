const getClienteById = async (id) => {
  try {
    const { data } = await axios.get(`${URL}clientes/id/${id}`);
    if (!data.ok) return await sweet.fire('Error al obtener el cliente', data.msg, 'error');
    return data.cliente;
  } catch (error) {
    console.log(error);
    return await sweet.fire('Error al obtener el cliente', `${error?.response?.data?.msg}`, 'error');
  }
};

module.exports = {
  getClienteById,
};
