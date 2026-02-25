const CuentaCorrienteProvedores = require('../models/CuentaCorrienteProvedores');

const getCuentaCorrienteProvedores = async (req, res) => {
  try {
    const { id, desde, hasta } = req.params;

    const cuentas = await CuentaCorrienteProvedores.find({
      provedorId: id,
      fecha: {
        $gte: desde,
        $lte: hasta,
      },
    });

    res.status(200).json({
      ok: true,
      cuentas,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error al obtener la cuenta corriente de los provedores' });
  }
};

const putCuentaCorrienteProvedores = async (req, res) => {
  try {
    const { id } = req.params;
    const { debe, haber, saldo, tipo, observaciones } = req.body;

    const cuenta = await CuentaCorrienteProvedores.findByIdAndUpdate(id, {
      debe,
      haber,
      saldo,
      tipo,
      observaciones,
    });

    const cuentasSig = await CuentaCorrienteProvedores.find({
      provedorId: cuenta.provedorId,
      fecha: {
        $gt: cuenta.fecha,
      },
    });

    cuentasSig.forEach((cuenta) => {
      cuenta.saldo += cuenta.debe - cuenta.haber;
      cuenta.save();
    });

    res.status(200).json({
      ok: true,
      cuenta,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error al actualizar la cuenta corriente de los provedores' });
  }
};

const deleteCuentaCorrienteProvedores = async (req, res) => {
  try {
    const { id } = req.params;
    const cuenta = await CuentaCorrienteProvedores.findByIdAndDelete(id);

    const cuentasSig = await CuentaCorrienteProvedores.find({
      provedorId: cuenta.provedorId,
      fecha: {
        $gt: cuenta.fecha,
      },
    });

    cuentasSig.forEach((cuenta) => {
      cuenta.saldo += cuenta.debe - cuenta.haber;
      cuenta.save();
    });

    res.status(200).json({
      ok: true,
      cuenta,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error al eliminar la cuenta corriente de los provedores' });
  }
};

module.exports = {
  getCuentaCorrienteProvedores,
  putCuentaCorrienteProvedores,
  deleteCuentaCorrienteProvedores,
};
