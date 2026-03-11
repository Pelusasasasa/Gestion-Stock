const { modificarCheques } = require('../helpers/cheque/modificarCheques');
const { cargarCuentaCorriente } = require('../helpers/cuentaCorrienteProvedor/cargarCuentaCorriente');
const eliminarCuentacorriente = require('../helpers/cuentaCorrienteProvedor/eliminarCuentacorriente');
const { cargarMovCajaProvedor } = require('../helpers/movCaja/cargarMovCajaProvedor');
const { descontarSaldo } = require('../helpers/provedor/descontarSaldo');
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

const obtenerFacturasProvedores = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    let query = {};

    if (search && search.trim() !== '') {
      const provedores = await Provedor.find({ nombre: { $regex: search, $options: 'i' } }).select('_id');
      const provedorIds = provedores.map((p) => p._id);

      query = {
        $or: [{ numero: { $regex: search, $options: 'i' } }, { provedorId: { $in: provedorIds } }],
      };
    }

    const facturas = await FacturaProvedor.find(query)
      .populate('tipo')
      .populate('provedorId')
      .sort({ fecha_comp: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await FacturaProvedor.countDocuments(query);

    res.status(200).json({
      ok: true,
      facturas,
      total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: 'Error al obtener las facturas',
    });
  }
};

const eliminarFacturaProvedor = async (req, res) => {
  try {
    const { id } = req.params;

    const factura = await FacturaProvedor.findByIdAndDelete(id);
    if (!factura) {
      return res.status(404).json({
        ok: false,
        message: 'Factura no encontrada',
      });
    }

    if (factura.tipo_pago === 'CUENTA CORRIENTE') {
      const okCuentaCorriente = await eliminarCuentacorriente(factura);
      const okProvedor = await descontarSaldo(factura);

      if (!okCuentaCorriente || !okProvedor) {
        return res.status(500).json({
          ok: false,
          message: 'Error al eliminar la factura',
        });
      }
    } else {
      await eliminarMovimientosCaja(factura);
    }

    res.status(200).json({
      ok: true,
      message: 'Factura eliminada correctamente',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: 'Error al eliminar la factura',
    });
  }
};

module.exports = {
  crearFacturaProvedor,
  obtenerFacturasProvedores,
  eliminarFacturaProvedor,
};
