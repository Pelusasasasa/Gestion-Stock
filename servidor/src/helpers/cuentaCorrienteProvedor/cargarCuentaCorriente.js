const CuentaCorrienteProvedores = require('../../models/CuentaCorrienteProvedores');

const cargarCuentaCorriente = async (factura) => {
  try {
    const ultimaCuentaCorriente = await CuentaCorrienteProvedores.findOne({
      provedorId: factura.provedorId,
    }).sort({ fecha: -1 });

    const cuentaCorriente = new CuentaCorrienteProvedores({
      fecha: factura.fecha_comp,
      facturaAsoc: factura._id,
      provedorId: factura.provedorId,
      debe: factura.tipo.nombre.includes('NOTA') ? 0 : factura.dolar ? factura.total * factura.dolarTomado : factura.total,
      haber: factura.tipo.nombre.includes('NOTA') ? (factura.dolar ? factura.total * factura.dolarTomado : factura.total) : 0,
      saldo: factura.tipo.nombre.includes('NOTA')
        ? -(factura.dolar ? factura.total * factura.dolarTomado : factura.total) + (ultimaCuentaCorriente?.saldo ?? 0)
        : (factura.dolar ? factura.total * factura.dolarTomado : factura.total) + (ultimaCuentaCorriente?.saldo ?? 0),
      tipo: factura.tipo._id,
      observaciones: factura.observaciones,
    });
    await cuentaCorriente.save();
    return cuentaCorriente;
  } catch (error) {
    console.error(error);
  }
};

const cargarCuentaCorrienteProvedor = async (pago) => {
  try {
    const ultimaCuentaCorriente = await CuentaCorrienteProvedores.findOne({
      provedorId: pago.provedorId,
    }).sort({ fecha: -1 });

    const cuentaCorriente = new CuentaCorrienteProvedores({
      fecha: pago.fecha,
      facturaAsoc: pago._id,
      provedorId: pago.provedorId,
      debe: 0,
      haber: pago.importe,
      saldo: (ultimaCuentaCorriente?.saldo ?? 0) - pago.importe,
      tipo: pago?.tipo?._id,
      observaciones: pago.observaciones,
    });
    await cuentaCorriente.save();
    return cuentaCorriente;
  } catch (error) {
    console.error(error);
    return false;
  }
};

module.exports = {
  cargarCuentaCorriente,
  cargarCuentaCorrienteProvedor,
};
