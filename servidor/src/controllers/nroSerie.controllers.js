const nroSerieCTRL = {};

const { buscarMovimientosPorNROSeries } = require('../helpers/buscarMovimientosPorNROSeries');
const NroSerie = require('../models/NroSerie');

nroSerieCTRL.get = async (req, res) => {
  const respuesta = await NroSerie.find();
  res.send(respuesta);
};

nroSerieCTRL.post = async (req, res) => {
  const nroSerie = new NroSerie(req.body);

  await nroSerie.save();

  res.send(nroSerie);
};

nroSerieCTRL.getForSearch = async (req, res) => {
  const { text } = req.params;

  try {
    const re = new RegExp(`^${text}`);

    if (text === 'all') {
      const numeros = await NroSerie.find().sort({ _id: -1 }).limit(50);

      const movs = await buscarMovimientosPorNROSeries(numeros);

      return res.status(200).json({
        ok: true,
        movs,
      });
    }

    const numeros = await NroSerie.find({
      $or: [
        { nro_serie: { $regex: re, $options: 'i' } },
        { codigo: { $regex: re, $options: 'i' } },
        { producto: { $regex: re, $options: 'i' } },
        { provedor: { $regex: re, $options: 'i' } },
        { factura: { $regex: re, $options: 'i' } },
      ],
    }).sort({ _id: -1 });

    const movs = await buscarMovimientosPorNROSeries(numeros);

    res.status(200).json({
      ok: true,
      movs,
    });
  } catch (error) {
    console.error(error);
  }
};

nroSerieCTRL.putforId = async (req, res) => {
  const { id } = req.params;

  const respuesta = await NroSerie.findByIdAndUpdate(id, req.body);

  res.send(respuesta);
};

nroSerieCTRL.getForDelete = async (req, res) => {
  const { id } = req.params;
  const respuesta = await NroSerie.findByIdAndDelete(id);
  res.send(respuesta);
};

module.exports = nroSerieCTRL;
