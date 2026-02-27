const Provedor = require('../../models/Provedor');

const descontarSaldo = async (factura) => {
  try {
    const provedor = await Provedor.findById(factura.provedorId);

    if (!provedor) {
      return false;
    }

    provedor.saldo -= factura.dolar ? factura.total * factura.dolarTomado : factura.total;
    await provedor.save();
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

module.exports = {
  descontarSaldo,
};
