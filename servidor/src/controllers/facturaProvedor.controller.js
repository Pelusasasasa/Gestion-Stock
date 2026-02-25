const cargarCuentaCorriente = require('../helpers/cuentaCorrienteProvedor/cargarCuentaCorriente');
const cargarMovCajaProvedor = require('../helpers/movCaja/cargarMovCajaProvedor');
const FacturaProvedor = require('../models/FacturaProvedor');
const Provedor = require('../models/Provedor');
const crearFacturaProvedor = async (req, res) => {
  try {
    const facturaAux = new FacturaProvedor(req.body);
    await facturaAux.save();

    const factura = await FacturaProvedor.findById(facturaAux._id).populate('tipo');

    if (factura.tipo_pago === 'CUENTA CORRIENTE') {
      await cargarCuentaCorriente(factura);

      const provedor = await Provedor.findById(factura.provedorId);
      provedor.saldo += factura.total;
      await provedor.save();
    } else {
      await cargarMovCajaProvedor(factura);
    }
    return factura;
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  crearFacturaProvedor,
};
