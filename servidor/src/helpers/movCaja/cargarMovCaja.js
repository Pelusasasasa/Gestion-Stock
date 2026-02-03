const MovCaja = require('../../models/MovCaja');
const Recibo = require('../../models/Recibo');
const TipoCuenta = require('../../models/TipoCuenta');
const modificarValorRecibido = require('../recibo/modificarValorRecibido');

const cargarMovCaja = async (data) => {
  try {
    const comprobante = await Recibo.findById(data.comprobante);
    modificarValorRecibido(data.comprobante, data.tipoPago);

    const tipoCuenta = await TipoCuenta.findOne({
      nombre: comprobante.tipo_comp.toUpperCase(),
    });
    const mov = {
      fecha: comprobante.fecha,
      descripcion: comprobante.cliente,
      puntoVenta: comprobante.tipo_venta === 'RECIBO' ? '000R' : '000C',
      numero: comprobante.numero.toString().padStart(8, '0'),
      importe: data.importe,
      tipoPago: data.tipoPago,
      tipo: tipoCuenta._id ?? '',
      vendedor: comprobante.vendedor,
    };

    const movCaja = new MovCaja(mov);
    await movCaja.save();

    if (data.tipoPago === 'TARJETA' && comprobante.precio > data.importe) {
      cargarMovCaja({
        comprobante: data.comprobante,
        importe: comprobante.precio - data.importe,
        tipoPago: 'EFECTIVO',
      });
    }

    return movCaja;
  } catch (error) {
    console.error(error);
    return false;
  }
};

module.exports = cargarMovCaja;
