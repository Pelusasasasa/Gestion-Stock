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

const descontarSaldoDesdePago = async (id, importe) => {
  try {
    const provedor = await Provedor.findById(id);

    if (!provedor) {
      return false;
    }

    provedor.saldo -= importe;
    await provedor.save();
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = {
  descontarSaldo,
  descontarSaldoDesdePago,
};
