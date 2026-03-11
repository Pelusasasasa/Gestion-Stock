const { actualizarNumero } = require('../helpers/actualizarNumero');
const { entregarCheque } = require('../helpers/cheque/modificarCheques');
const { cargarCuentaCorrienteProvedor } = require('../helpers/cuentaCorrienteProvedor/cargarCuentaCorriente');
const { cargarMovCajaPagoProvedor } = require('../helpers/movCaja/cargarMovCajaPagoProvedor');
const { descontarSaldoDesdePago } = require('../helpers/provedor/descontarSaldo');
const PagoProvedor = require('../models/PagoProvedor');

const postPagoProvedor = async (req, res) => {
  try {
    const numero = await actualizarNumero('EP');

    if (!numero.ok) {
      return res.status(500).json({ message: 'Error al registrar el pago' });
    }
    req.body.numero = numero.numero;

    const pagoProvedor = new PagoProvedor(req.body);
    await pagoProvedor.save();

    const factura = await PagoProvedor.findById(pagoProvedor._id).populate('provedorId');
    for (let pago of req.body.mediosPagos) {
      if (pago.tipoPago === 'EFECTIVO' || pago.tipoPago === 'TRANSFERENCIA') {
        cargarMovCajaPagoProvedor(pago, factura);
      }
      if (pago.tipoPago === 'CHEQUE') {
        entregarCheque(pago.referencia, factura.provedorId.nombre);
      }
    }

    const saldo = await descontarSaldoDesdePago(req.body.provedorId, req.body.importe);

    if (!saldo) {
      return res.status(500).json({ message: 'Error al descontar el saldo' });
    }

    const cuentaCorriente = await cargarCuentaCorrienteProvedor(req.body);

    if (!cuentaCorriente) {
      return res.status(500).json({ ok: false, message: 'Error al registrar el pago' });
    }

    return res.status(201).json({ ok: true, message: 'Pago registrado correctamente' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, message: 'Error al registrar el pago' });
  }
};

module.exports = {
  postPagoProvedor,
};
