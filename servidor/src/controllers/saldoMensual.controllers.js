const saldoMensualCTRL = {};

const getSaldoInicial = require('../helpers/getSaldoInicial');
const SaldoMensual = require('../models/SaldoMensual');

saldoMensualCTRL.getSaldoInicial = async (req, res) => {
  const { mes } = req.params;
  const [anio, mesNum] = mes.split('-');

  const desde = new Date(`${anio}-${mesNum}-01T00:00:00.000Z`);
  const hasta = new Date(`${anio}-${parseInt(mesNum) + 1}-01T00:00:00.000Z`);

  try {
    const saldoInicial = await getSaldoInicial(mes);

    const movimientos = await Movimiento.find({
      fecha: { $gte: desde, $lt: hasta },
    }).sort({ fecha: 1 });

    let saldo = saldoInicial;
    const movsConSaldo = movimientos.map((mov) => {
      saldo += mov.tipo === 'ingreso' ? mov.importe : -mov.importe;
      return { ...mov.toObject(), saldo };
    });
  } catch (error) {}

  const respuesta = await getSaldoInicial('2025-04');

  res.send(`${respuesta}`);
};

saldoMensualCTRL.getAll = async (req, res) => {
  try {
    const saldos = await SaldoMensual.find();
    res.json(saldos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error al obtener los saldos' });
  }
};

saldoMensualCTRL.postNew = async (req, res) => {
  const { mes, anio, saldo } = req.body;

  try {
    const saldoUsado = await SaldoMensual.findOne({ mes, anio });

    if (saldoUsado)
      return res.status(400).json({
        ok: false,
        msg: 'El saldo para el mes y año indicado ya existe',
      });

    const saldoNuevo = new SaldoMensual({ mes, anio, saldo });
    await saldoNuevo.save();

    res.status(201).json({
      ok: true,
      msg: 'Saldo creado exitosamente',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error al crear el saldo',
    });
  }
};

saldoMensualCTRL.patchOne = async (req, res) => {
  const { id } = req.params;
  const { saldo } = req.body;

  try {
    const saldoUsado = await SaldoMensual.findById(id);

    if (!saldoUsado)
      return res.status(404).json({
        ok: false,
        msg: 'Saldo no encontrado',
      });

    saldoUsado.saldo = saldo;
    await saldoUsado.save();

    res.status(200).json({
      ok: true,
      msg: 'Saldo actualizado exitosamente',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error al actualizar el saldo',
    });
  }
};

module.exports = saldoMensualCTRL;
