const Gasto = require("../models/Gasto");
const Recibo = require("../models/Recibo");
const Venta = require("../models/Venta");
const Movimiento = require("../models/movProducto");
const MovRecibo = require("../models/MovRecibos");

exports.traerInformacionCajaDelDia = async (req, res) => {
  const { desde, hasta } = req.params;
  try {
    const fechaBase = new Date(`${desde}T00:00:00-03:00`);
    const fechaFin = new Date(`${hasta}T23:59:59-03:00`);

    const ventas = await Venta.find({
      $and: [{ fecha: { $gte: fechaBase } }, { fecha: { $lte: fechaFin } }],
    })
      .populate("vendedor", "nombre")
      .lean();

    const recibos = await Recibo.find({
      $and: [{ fecha: { $gte: fechaBase } }, { fecha: { $lte: fechaFin } }],
    })
      .populate("vendedor", "nombre")
      .lean();

    const gastos = await Gasto.find({
      $and: [{ fecha: { $gte: fechaBase } }, { fecha: { $lte: fechaFin } }],
    });

    // Buscar movimientos del día una sola vez
    const movimientos = await Movimiento.find({
      $and: [{ fecha: { $gte: fechaBase } }, { fecha: { $lte: fechaFin } }],
    }).lean();

    const movRecibos = await MovRecibo.find({
      $and: [{ fecha: { $gte: fechaBase } }, { fecha: { $lte: fechaFin } }],
    }).lean();

    // Asociar movimientos a sus ventas correspondientes
    ventas.forEach((venta) => {
      venta.movimientos = movimientos.filter(
        (mov) => mov.nro_venta == venta.numero
      );
    });

    recibos.forEach((recibo) => {
      recibo.movimientos = movRecibos.filter(
        (mov) => mov.numeroRecibo == recibo.numero
      );
    });

    
    res.status(200).json({
      ok: true,
      ventas: ventas,
      recibos: recibos,
      gastos: gastos,
    });
  } catch (error) {
    console.error("Error al traer la información de la caja del día:", error);
    res.status(500).json({
      ok: false,
      msg: "Error al obtener la información de la caja del día",
    });
  }
};

exports.traerInformacionCajaDelMes = async (req, res) => {
  const { month } = req.params;
  let mes = parseInt(month);
  let year = new Date().getFullYear();

  mes = mes > 12 ? 1 : mes;

  try {
    const ventas = await Venta.find({
      $expr: {
        $eq: [{ $month: "$fecha" }, mes],
        $eq: [{ $year: "$fecha" }, year],
      },
    })
      .populate("vendedor", "nombre")
      .lean();

    const recibos = await Recibo.find({
      $expr: {
        $eq: [{ $month: "$fecha" }, mes],
        $eq: [{ $year: "$fecha" }, year],
      },
    })
      .populate("vendedor", "nombre")
      .lean();

    const movimientos = await Movimiento.find({
      $expr: {
        $eq: [{ $month: "$fecha" }, mes],
        $eq: [{ $year: "$fecha" }, year],
      },
    }).lean();

    const movRecibos = await MovRecibo.find({
      $expr: {
        $eq: [{ $month: "$fecha" }, mes],
        $eq: [{ $year: "$fecha" }, year],
      },
    }).lean();

    // Asociar movimientos a sus ventas correspondientes
    ventas.forEach((venta) => {
      venta.movimientos = movimientos.filter(
        (mov) => mov.nro_venta == venta.numero
      );
    });

    recibos.forEach((recibo) => {
      recibo.movimientos = movRecibos.filter(
        (mov) => mov.numeroRecibo == recibo.numero
      );
    });

    

    res.status(200).json({
      ok: true,
      ventas: ventas,
      recibos: recibos,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al obtener la información de la caja del mes",
    });
  }
};

exports.traerInformacionCajaDelAnio = async (req, res) => {
  const { year } = req.params;
  try {
    const ventas = await Venta.find({
      $expr: { $eq: [{ $year: "$fecha" }, year] },
    }).populate("vendedor", "nombre");

    const recibos = await Recibo.find({
      $expr: { $eq: [{ $year: "$fecha" }, year] },
    }).populate("vendedor", "nombre");

    res.status(200).json({
      ok: true,
      ventas: ventas,
      recibos: recibos,
    });
  } catch (error) {
    console.error("Error al traer la información de la caja del año:", error);
    res.status(500).json({
      ok: false,
      msg: "Error al obtener la información de la caja del año",
    });
  }
};
