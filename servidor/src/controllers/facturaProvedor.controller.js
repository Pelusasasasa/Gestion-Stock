const cargarCuentaCorriente = require('../helpers/cuentaCorrienteProvedor/cargarCuentaCorriente');
const FacturaProvedor = require('../models/FacturaProvedor');
const crearFacturaProvedor = async (req, res) => {
  try {
    const factura = new FacturaProvedor(req.body);
    await factura.save();

    if (factura.tipo_pago === 'CUENTA CORRIENTE') {
      cargarCuentaCorriente(factura);
    } else {
      cargarMovCaja(factura);
    }
    return factura;
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  crearFacturaProvedor,
};
