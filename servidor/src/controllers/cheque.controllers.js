const chequeCTRL = {};

const fechaConHoraLocal = require('../helpers/fechaConHoraLocal');
const cargarMovCaja = require('../helpers/movCaja/cargarMovCaja');
const Cheque = require('../models/Cheque');
const { validateCheque, validatePartialCheque } = require('../schemas/cheque.schema');

chequeCTRL.gestAll = async (req, res) => {
  const { desde, hasta } = req.query;
  const cheques = await Cheque.find({
    $and: [{ f_recibido: { $gte: new Date(desde + 'T00:00:00.000Z') } }, { f_recibido: { $lte: new Date(hasta + 'T23:59:59.999Z') } }],
  });
  try {
    res.status(200).json({
      cheques,
      ok: true,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Hable Con el Administrador',
    });
  }
};

chequeCTRL.postOne = async (req, res) => {
  const chequeData = {
    ...req.body,
    f_recibido: fechaConHoraLocal(req.body.f_recibido),
  };

  const result = await validateCheque(chequeData);
  if (!result.success)
    return res.status(400).json({
      msg: 'Error en el formato de los datos',
      errors: result.error,
      ok: false,
    });

  try {
    const cheque = new Cheque(result.data);
    await cheque.save();

    if (cheque.comprobanteId) {
      const movCaja = await cargarMovCaja({
        comprobante: cheque.comprobanteId,
        tipoPago: 'CHEQUE',
        importe: cheque.importe,
      });

      if (!movCaja) {
        return res.status(400).json({
          msg: 'Error al cargar el movimiento de caja',
          ok: false,
        });
      }
    }

    res.status(201).json({
      cheque,
      ok: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable Con el Administrador',
    });
  }
};

chequeCTRL.patchOne = async (req, res) => {
  const result = await validatePartialCheque(req.body);

  if (!result.success)
    return res.status(400).json({
      msg: result.error,
      ok: false,
    });

  try {
    const { id } = req.params;

    const chequeUpdate = await Cheque.findByIdAndUpdate(id, result.data, {
      new: true,
    });

    res.status(200).json({
      chequeUpdate,
      ok: true,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Hable Con el Administrador',
    });
  }
};

chequeCTRL.deleteOne = async (req, res) => {
  const { id } = req.params;

  try {
    const chequeDelete = await Cheque.findByIdAndDelete(id);

    res.status(200).json({
      chequeDelete,
      ok: true,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Hable Con el Administrador',
    });
  }
};

module.exports = chequeCTRL;
