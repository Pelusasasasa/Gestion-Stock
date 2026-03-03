const { actualizarNumero } = require('../helpers/actualizarNumero');
const PagoProvedor = require('../models/PagoProvedore');

const postPagoProvedor = async (req, res) => {
  try {
    const numero = await actualizarNumero('EP');

    if (!numero.ok) {
      return res.status(500).json({ message: 'Error al registrar el pago' });
    }

    req.body.numero = numero.numero;

    for (let pago of req.body.mediosPagos) {
      if (pago.tipoPago === 'EFECTIVO') {
        cargarMovCajaPagoProvedor(req.body);
      }
    }

    const pagoProvedor = new PagoProvedor(req.body);
    await pagoProvedor.save();

    return res.status(201).json({ message: 'Pago registrado correctamente' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al registrar el pago' });
  }
};

module.exports = {
  postPagoProvedor,
};
