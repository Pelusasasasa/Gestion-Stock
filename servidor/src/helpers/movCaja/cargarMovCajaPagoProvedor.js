const MovCaja = require('../../models/MovCaja');

const cargarMovCajaPagoProvedor = async (pago) => {
  try {
    const movCaja = new MovCaja({
      fecha: pago.fecha,
      importe: pago.importe,
      tipo: pago.tipo,
      puntoVenta: '000E',
      numero: pago.numero,
      descripcion: `Pago a ${pago.provedorId.nombre}`,
      tipoPago: 'EFECTIVO',
      vendedor: pago.vendedor,
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

module.exports = cargarMovCajaPagoProvedor;
