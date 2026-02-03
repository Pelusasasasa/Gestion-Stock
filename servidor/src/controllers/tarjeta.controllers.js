const tarjetaCTRL = {};

const fechaConHoraLocal = require('../helpers/fechaConHoraLocal');
const cargarMovCaja = require('../helpers/movCaja/cargarMovCaja');
const Tarjeta = require('../models/Tarjeta');
const { validateTarjeta, validatePartialTarjeta } = require('../schemas/tarjeta.schema');

tarjetaCTRL.postOne = async (req, res) => {
  try {
    const tarjetaData = {
      ...req.body,
      fecha: fechaConHoraLocal(req.body.fecha),
    };
    const result = await validateTarjeta(req.body);
    if (!result.success)
      return res.status(400).json({
        ok: false,
        msg: JSON.parse(result.error),
      });

    const tarjeta = new Tarjeta(result.data);
    await tarjeta.save();

    if (tarjeta.comprobanteId) {
      const movCaja = await cargarMovCaja({
        comprobante: tarjeta.comprobanteId,
        tipoPago: 'TARJETA',
        importe: tarjeta.importe,
      });

      if (!movCaja) {
        return res.status(400).json({
          msg: 'Error al cargar el movimiento de caja',
          ok: false,
        });
      }
    }

    const tarjetaConDatos = await Tarjeta.findById(tarjeta._id).populate('tarjeta');

    res.status(201).json({
      ok: true,
      tarjeta: tarjetaConDatos,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    });
  }
};

tarjetaCTRL.getAll = async (req, res) => {
  const { desde, hasta, text } = req.query;

  const query = {
    fecha: {
      $gte: new Date(desde + 'T00:00:00.000Z'),
      $lte: new Date(hasta + 'T23:59:59.999Z'),
    },
  };

  if (text) {
    const regex = new RegExp(text, 'i');
    const or = [{ nombre: regex }, { tipo: regex }];

    query.$or = or;
  }

  console.log(query);

  try {
    const tarjetas = await Tarjeta.find(query).populate('tarjeta');
    console.log(tarjetas);

    res.status(200).json({
      ok: true,
      tarjetas,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    });
  }
};

tarjetaCTRL.patchOne = async (req, res) => {
  const { id } = req.params;

  const result = validatePartialTarjeta(req.body);

  if (!result.success)
    return res.status(400).json({
      ok: false,
      error: JSON.parse(result.error),
    });

  try {
    const tarjetaUpdate = await Tarjeta.findByIdAndUpdate(id, result.data, {
      new: true,
    });

    const tarjetaConDatos = await Tarjeta.findById(tarjetaUpdate._id).populate('tarjeta');

    res.status(200).json({
      ok: true,
      tarjeta: tarjetaConDatos,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    });
  }
};

tarjetaCTRL.deleteOne = async (req, res) => {
  const { id } = req.params;

  try {
    const deleteTarjeta = await Tarjeta.findOneAndDelete({ _id: id });

    res.status(200).json({
      ok: true,
      deleteTarjeta,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    });
  }
};

module.exports = tarjetaCTRL;
