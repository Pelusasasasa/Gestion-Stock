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

module.exports = cargarCuentaCorriente;
