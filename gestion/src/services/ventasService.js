const putVentaForNumeroAndType = async (numero, type, data) => {
  try {
    const { data } = await axios.put(`${URL}ventas/id/${numero}/${type}`, data);
    if (!data.ok) return await sweet.fire('Error al modificar la venta', data.msg, 'error');
    return data.venta;
  } catch (error) {
    console.log(error);
    return await sweet.fire('Error al modificar la venta', `${error?.response?.data?.msg}`, 'error');
  }
};

module.exports = {
  putVentaForNumeroAndType,
};