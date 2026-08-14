const presupuestoCTRL = {};

const Movimiento = require('../models/movProducto');
const Presupuesto = require("../models/Presupuesto");

const funcion = require("../assets/js/pdf");
const { actualizarNumero } = require("../helpers/actualizarNumero");
const { crearMovimientosStock } = require("../helpers/crearMovimientosStock");
const {
  crearMovimientoVendedores,
} = require("../helpers/crearMovimientoVendedores");
const Cliente = require('../models/Cliente');

presupuestoCTRL.post = async (req, res) => {
  try {
    const presupuesto = new Presupuesto(req.body);

    const numeroActualizado = await actualizarNumero(presupuesto.tipo_venta);
    
    if (numeroActualizado.ok) {
      presupuesto.numero = numeroActualizado.numero;
    }

    const movimientos = await crearMovimientosStock(
      req.body.listaProductos,
      presupuesto
    );
    if (!movimientos) {
      return res.status(400).json({
        ok: false,
        msg: "Error al crear los movimientos",
      });
    }

    await presupuesto.save();

    if (req.body.F) {
      funcion.crearPDF(req.body); //creamos un pdf con la presupuesto
    }

    await crearMovimientoVendedores(
      `Se hizo un presupuesto al cliente ${presupuesto.cliente}`,
      presupuesto.vendedor
    );

    const nuevoPresupuesto = await Presupuesto.findById(
      presupuesto._id
    ).populate("vendedor", "nombre");

    console.log(
      `Presupuesto ${presupuesto.numero} cargado a las ${req.body.fecha}`
    );

    res.status(201).json({
      ok: true,
      venta: nuevoPresupuesto,
      movimientos,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error en el servidor al cargar el presupuesto, hable con el administrador",
    });
  }
};

presupuestoCTRL.realizarPresupuesto = async(req, res) => {
  try {
    const { presupuesto } = req.body;
    const { productos, facturado } = req.query;

    // 1. Facturar

    // 2. Actualizar numero
    const numeroActualizado = await actualizarNumero(presupuesto.tipo_venta);

    if(!numeroActualizado.ok)
      return res.status(400).json({
        ok: false,
        msg: 'Error al actualizar el numero'
      });

    presupuesto.numero = numeroActualizado.numero;
    console.log(numeroActualizado.numero)
    
    // 3. Cargar Presupuesto
    const presupuestoCargado = new Presupuesto(presupuesto)
    await presupuestoCargado.save()

    if(!presupuestoCargado)
      return res.status(400).json({
        ok: false,
        msg: 'Error al cargar el presupuesto, pero se actualizao en numero'
      })

    let movimientos = [];
    // 4. Cargar Movimientos stock
    for(let i = 0; i < productos.length; i++){
      if(!productos[i]._id) continue;
      
      const movimiento = new Movimiento({
        fecha: presupuestoCargado.fecha,
        tipo_venta: presupuestoCargado.tipo_venta,
        cliente: presupuestoCargado.idCliente,
        nombreCliente: presupuestoCargado.cliente,
        marca: productos[i].marca,
        codProd: productos[i]._id,
        producto: productos[i].descripcion,
        cantidad: productos[i].cantidad,
        iva: productos[i].impuesto,
        precio: productos[i].precio,
        nro_venta: presupuestoCargado.numero,
        vendedor: presupuestoCargado.vendedor
      });

      await movimiento.save()
      movimientos.push(movimiento);

      if(!movimiento)
        return res.status(400).json({
          ok: false,
          msg: 'Error al cargar el movimiento, pero si se actualizao el numero y se cargo el presupuesto'
        });
    };

    const cliente = await Cliente.findById(presupuesto.idCliente);

    const presupuestoObj = presupuestoCargado.toObject();
    presupuestoObj.movimientos = movimientos;
    presupuestoObj.datosClientes = {
      direccion: cliente?.direccion,
      localidad: cliente?.localidad,
      telefono: cliente?.telefono,
      cuit: cliente?.cuit,
      condicionIva: cliente?.condicionIva,
    };

    res.status(201).json({
      ok: true,
      msg: 'Remito cargado correctamente',
      presupuesto: presupuestoObj
    })
    
  } catch (error) {
   console.error(error);
   return res.status(500).json({
    ok: false,
    msg: 'Error al realizar el presupuesto'
   })
  }
};

presupuestoCTRL.get = async (req, res) => {
  const presupuestos = await Presupuesto.find();
  res.send(presupuestos);
}; //Poner en rutas

presupuestoCTRL.getForNumber = async (req, res) => {
  const { number } = req.params;
  const presupuesto = await Presupuesto.findOne({ numero: number });
  res.send(presupuesto);
};

presupuestoCTRL.getForDay = async (req, res) => {
  const { day } = req.params;
  
  let inicioDia = new Date(day + "T00:00:00.000Z");
  let finDia = new Date(day + "T23:59:59.000Z");

  const presupuestos = await Presupuesto.find({
    $and: [{ fecha: { $gte: inicioDia } }, { fecha: { $lte: finDia } }],
  }).populate("vendedor", "nombre");

  res.send(presupuestos);
};

presupuestoCTRL.getForMonth = async (req, res) => {
  const { month } = req.params;
  let now = new Date();
  let inicioMes = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  let finMes = new Date(now.getTime() - now.getTimezoneOffset() * 60000);

  inicioMes.setMonth(month - 1, 1);
  finMes.setMonth(month, 1);
  inicioMes.setHours(-3, 0, 0, 0);
  finMes.setHours(-3, 0, 0, 0);

  const presupuestos = await Presupuesto.find({
    $and: [{ fecha: { $gte: inicioMes } }, { fecha: { $lt: finMes } }],
  }).populate("vendedor", "nombre");
  res.send(presupuestos);
};

presupuestoCTRL.getForYear = async (req, res) => {
  const { year } = req.params;

  let inicioAño = new Date(year, 0, 1, -3, 0, 0);
  let finAño = new Date(year, 11, 31, 20, 59, 59);
  const presupuestos = await Presupuesto.find({
    $and: [{ fecha: { $gte: inicioAño } }, { fecha: { $lte: finAño } }],
  }).populate("vendedor", "nombre");
  res.send(presupuestos);
};

presupuestoCTRL.deleteForId = async (req, res) => {
  const { day } = req.params;
};

presupuestoCTRL.getBetweenDate = async (req, res) => {
  const { desde, hasta } = req.params;
  const inicioDia = new Date(desde + "T00:00:00.000Z");
  const finDia = new Date(hasta + "T23:59:59.000Z");
  const presupuestos = await Presupuesto.find({
    $and: [
      { fecha: { $gte: inicioDia } },
      { fecha: { $lte: finDia } },
      { tipo_comp: { $ne: "Presupuesto" } },
    ],
  });
  res.send(presupuestos);
};

module.exports = presupuestoCTRL;
