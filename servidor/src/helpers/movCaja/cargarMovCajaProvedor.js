const MovCaja = require('../../models/MovCaja');

const cargarMovCajaProvedor = async (factura) => {
  try {
    const movCaja = new MovCaja({
      fecha: factura.fecha_comp,
      descripcion: factura.provedorId.nombre,
      puntoVenta: factura.puntoVenta,
      numero: factura.numero,
      tipo: factura.tipo,
      importe: factura.total,
      tipoPago: 'EFECTIVO',
      vendedor: factura.vendedor,
    });
    await movCaja.save();
    return movCaja;
  } catch (error) {
    console.error(error);
    return false;
  }
};

module.exports = { cargarMovCajaProvedor };
