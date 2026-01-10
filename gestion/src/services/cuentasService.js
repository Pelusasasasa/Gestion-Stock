const sweet = require('sweetalert2');

const getCompensadas = async (idCliente) => {
  try {
    const { data } = await axios.get(`${URL}compensada/traerCompensadas/${idCliente}`);

    if (data.ok) {
      return data.compensadas;
    } else {
      await sweet.fire('No se pudo obtener las compensadas', data.msg, 'error');
    }
  } catch (error) {
    console.log(error);
    await sweet.fire('No se pudo traer las compensadas', error?.response?.data?.msg, 'error');
  }
};

const getHistoricas = async (idCliente) => {
  try {
    const { data } = await axios.get(`${URL}historica/traerPorCliente/${idCliente}`);

    if (data) {
      return data;
    } else {
      await sweet.fire('No se pudo obtener las historicas', data.msg, 'error');
    }
  } catch (error) {
    console.log(error);
    await sweet.fire('No se pudo traer las historicas', error?.response?.data?.msg, 'error');
  }
};

module.exports = {
  getCompensadas,
  getHistoricas,
};
