const modificarCheques = require('../helpers/cheque/modificarCheques');
const cargarCuentaCorriente = require('../helpers/cuentaCorrienteProvedor/cargarCuentaCorriente');
const cargarMovCajaProvedor = require('../helpers/movCaja/cargarMovCajaProvedor');
const FacturaProvedor = require('../models/FacturaProvedor');
const Provedor = require('../models/Provedor');
const crearFacturaProvedor = async (req, res) => {
  try {
    const facturaAux = new FacturaProvedor(req.body);
    await facturaAux.save();

    const factura = await FacturaProvedor.findById(facturaAux._id).populate('tipo').populate('provedorId');

    if (factura.tipo_pago === 'CUENTA CORRIENTE') {
      await cargarCuentaCorriente(factura);

      const provedor = await Provedor.findById(factura.provedorId);
      provedor.saldo += factura.dolar ? factura.total * factura.dolarTomado : factura.total;
      await provedor.save();
    } else {
      const ok = await modificarCheques(
        factura.detallesPago.filter((elem) => elem.tipo === 'cheque'),
        factura.provedorId.nombre,
      );
      if (!ok) {
        return res.status(500).json({
          ok: false,
          message: 'Error al modificar los cheques',
        });
      }

      await cargarMovCajaProvedor(factura);
    }
    res.status(200).json({
      ok: true,
      factura,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: 'Error al crear la factura',
    });
  }
};

module.exports = {
  crearFacturaProvedor,
};
