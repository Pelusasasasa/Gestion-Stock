const axios = require('axios');
require('dotenv').config();
const URL = process.env.GESTIONURL;

const { Swal } = require('sweetalert2');

const getCompensadas = async (idCliente) => {
  try {
    const { data } = await axios.get(`${URL}compensada/traerCompensadas/${idCliente}`);

    if (data.ok) {
      return data.compensadas;
    } else {
      await Swal.fire('No se pudo obtener las compensadas', data.msg, 'error');
    }
  } catch (error) {
    console.log(error);
    await Swal.fire('No se pudo traer las compensadas', error?.response?.data?.msg, 'error');
  }
};

const getCompensada = async (id) => {
  try {
    const { data } = await axios.get(`${URL}compensada/traerCompensada/id/${id}`);
    if (data.ok) {
      return data.compensada;
    } else {
      await Swal.fire('No se pudo obtener la compensada', data.msg, 'error');
      return null;
    }
  } catch (error) {
    console.log(error);
    await Swal.fire('No se pudo traer la compensada', error?.response?.data?.msg, 'error');
    return null;
  }
};

const putCompensadaForId = async (id, compensada) => {
  try {
    const { data } = await axios.put(`${URL}compensada/traerCompensada/id/${id}`, compensada);
    return data;
  } catch (error) {
    console.log(error);
    await Swal.fire('No se pudo traer la compensada', error?.response?.data?.msg, 'error');
    return null;
  }
};

const putCompensadaObservaciones = async (aux, observaciones) => {
  try {
    const { data } = await axios.put(`${URL}compensada/observaciones/${aux}`, { observaciones });
    console.log(aux);
    return data;
  } catch (error) {
    console.log(error);
    await Swal.fire('No se pudo traer la compensada', error?.response?.data?.msg, 'error');
    return null;
  }
};

const deleteCompensada = async (id) => {
  try {
    await axios.delete(`${URL}compensada/traerCompensada/id/${id}`);
    return {
      ok: true,
      msg: 'Venta Eliminada',
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      msg: 'No se pudo eliminar la venta',
    };
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

const getHistoricaForDateAndClient = async (fecha, idCliente) => {
  try {
    const { data } = await axios.get(`${URL}historica/forDesdeAndCliente/${fecha}/${idCliente}`);
    return data;
  } catch (error) {
    console.log(error);
    await sweet.fire('No se pudo traer las historicas', error?.response?.data?.msg, 'error');
  }
};

const getHistoricaForNumberAndType = async (number, type) => {
  try {
    const { data } = await axios.get(`${URL}historica/porId/id/${number}`);
    if (data.ok) {
      return data.historica;
    } else {
      await sweet.fire('No se pudo traer las historicas', data.msg, 'error');
      return null;
    }
  } catch (error) {
    console.log(error);
    await sweet.fire('No se pudo traer las historicas', error?.response?.data?.msg, 'error');
    return null;
  }
};

const putHistoricaForId = async (id, historica) => {
  try {
    const { data } = await axios.put(`${URL}historica/PorId/id/${id}`, historica);
    return data;
  } catch (error) {
    console.log(error);
    await sweet.fire('No se pudo traer las historicas', error?.response?.data?.msg, 'error');
    return null;
  }
};

const deleteHistorica = async (id) => {
  try {
    console.log(id);
    await axios.delete(`${URL}historica/porNumero/${id}`);
    return {
      ok: true,
      msg: 'Historica Eliminada',
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      msg: 'No se pudo eliminar la venta',
    };
  }
};

module.exports = {
  getCompensadas,
  getCompensada,
  getHistoricas,
  getHistoricaForDateAndClient,
  getHistoricaForNumberAndType,

  putCompensadaForId,
  putCompensadaObservaciones,
  putHistoricaForId,

  deleteCompensada,
  deleteHistorica,
};
