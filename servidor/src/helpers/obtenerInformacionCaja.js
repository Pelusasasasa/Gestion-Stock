const Presupuesto = require("../models/Presupuesto");
const Recibo = require("../models/Recibo");
const Venta = require("../models/Venta");
const Movimiento = require("../models/movProducto");
const MovRecibo = require("../models/MovRecibos");
const MetodoPago = require('../models/MetodoPago');


const Cheque = require('../models/Cheque');
const Retencion = require('../models/Retencion');

exports.traerInformacionCajaDelDia = async (req, res) => {
  const { desde, hasta } = req.params;

  const { desactivados = 'false'} = req.query;

  const estaActivo = desactivados === 'false' ? true : false;

  try {
    const fechaBase = new Date(`${desde}T00:00:00-03:00`);
    const fechaFin = new Date(`${hasta}T23:59:59-03:00`);

    const ventas = await Venta.find({
      $and: [{ fecha: { $gte: fechaBase } }, { fecha: { $lte: fechaFin } }, { activo: estaActivo }],
    })
      .populate("vendedor", "nombre")
      .lean();

    const recibos = await Recibo.find({
      $and: [{ fecha: { $gte: fechaBase } }, { fecha: { $lte: fechaFin } }, { activo: estaActivo }],
    })
      .populate("vendedor", "nombre")
      .lean();
      
      const presupuestos = await Presupuesto.find({
        $and: [{ fecha: { $gte: fechaBase } }, { fecha: { $lte: fechaFin } }, { activo: estaActivo }],
      }).populate("vendedor", "nombre").lean();
      
      // Traer MetodoPagos de recibos
    const metodoPagos = await MetodoPago.find({
      $and: [{ fecha: { $gte: fechaBase } }, { fecha: { $lte: fechaFin } }],
    }).lean()

    // Traer Cheques de esa fecha
    const cheques = await Cheque.find({
      $and: [{f_recibido: { $gte: fechaBase}}, {f_recibido: { $lte: fechaFin}}]
    });

    // Retenciones
    const retenciones = await Retencion.find({
      reciboId: { $in: recibos.map((r) => r._id)}
    }).lean();

    

    // Buscar movimientos del día una sola vez
    const movimientos = await Movimiento.find({
      $and: [{ fecha: { $gte: fechaBase } }, { fecha: { $lte: fechaFin } }],
    }).lean();

    const movRecibos = await MovRecibo.find({
      $and: [{ fecha: { $gte: fechaBase } }, { fecha: { $lte: fechaFin } }],
    }).lean();

    const movPresupuestos = await Movimiento.find({
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

      recibo.metodoPago = metodoPagos.filter(
        (metodo) => metodo.nro_comp == recibo.numero
      );

      recibo.retenciones = retenciones.filter(
        (retencion) => retencion.reciboId?.toString() === recibo._id?.toString()
      );
      
      
      recibo.metodoPago.forEach((metodo) => {
        if(metodo.tipo.toLowerCase() === 'cheque'){
          const chequeAsociado = cheques.find((cheque) => cheque.comprobanteId.toString() == metodo.comprobanteId.toString());
          if(chequeAsociado){
            metodo.banco = chequeAsociado.banco;
            metodo.numero = chequeAsociado.numero;
            metodo.fecha_pago = chequeAsociado.f_cheque
            
          }
        }
      })
    });

    presupuestos.forEach((presupuesto) => {
      presupuesto.movimientos = movPresupuestos.filter(
        (mov) => mov.nro_venta == presupuesto.numero
      );
    });


    
    res.status(200).json({
      ok: true,
      ventas: ventas,
      recibos: recibos,
      presupuestos: presupuestos
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
