const CuentaCorrienteProvedores = require('../../models/CuentaCorrienteProvedores');

const eliminarCuentacorriente = async (factura) => {
  try {
    const cuenta = await CuentaCorrienteProvedores.findOneAndDelete({ facturaAsoc: factura._id });

    const cuentasSig = await CuentaCorrienteProvedores.find({
      provedorId: cuenta.provedorId,
      fecha: {
        $gt: cuenta.fecha,
      },
    });

    cuentasSig.forEach((cuenta) => {
      cuenta.saldo += factura.dolar ? (cuenta.debe - cuenta.haber) * factura.dolarTomado : cuenta.debe - cuenta.haber;
      cuenta.save();
    });

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

module.exports = eliminarCuentacorriente;
