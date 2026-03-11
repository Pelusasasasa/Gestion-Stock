const MovCaja = require('../../models/MovCaja');

const cargarMovCajaPagoProvedor = async (pago, factura) => {
  try {
    const movCaja = new MovCaja({
      fecha: factura.fecha,
      importe: pago.importe,
      tipo: pago?.tipo,
      puntoVenta: '000E',
      numero: factura.numero.toString().padStart(8, '0'),
      descripcion: `Pago a ${factura.provedorId.nombre}`,
      tipoPago: pago?.tipoPago,
      vendedor: pago?.vendedor,
    });

    await movCaja.save();
    return {
      ok: true,
      movCaja,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error,
    };
  }
};

module.exports = { cargarMovCajaPagoProvedor };
