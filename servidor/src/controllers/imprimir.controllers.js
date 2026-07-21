const Venta = require("../models/Venta");
const Movimiento = require("../models/movProducto");
const Cliente = require("../models/Cliente");
const Remito = require("../models/Remito");

const informacionVenta = async (req, res) => {
  const { id } = req.params;
  const { tipo_venta } = req.query;

  let venta;
  try {
    if (tipo_venta === "RT") {
      venta = await Remito.findById(id);
    } else {
      venta = await Venta.findById(id);
    }

    const movimientos = await Movimiento.find({
      $and: [{ nro_venta: venta.numero }, { tipo_venta: venta.tipo_venta }],
    });

    const cliente = await Cliente.findById(venta.idCliente);

    res.status(200).json({
      ok: true,
      venta,
      movimientos,
      cliente,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al obtener la venta",
    });
  }
};

module.exports = {
  informacionVenta,
};
