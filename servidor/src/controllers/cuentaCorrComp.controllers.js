const compensadaCTRL = {};

const Venta = require('../models/Venta');
const MovProducto = require('../models/movProducto');
const Producto = require('../models/producto');
const CuentaCompensada = require("../models/cuentaCorrComp");
const Cliente = require("../models/Cliente");
const CuentaHistorica = require('../models/cuentaCorrHisto');

const {
  agregarIngormacionCompensadas,
  agregarInformacionHistoricas,
} = require("../helpers/agregarIngormacionCompensadas");

compensadaCTRL.crearCompensda = async (req, res) => {
  const ultimaCompensada = await CuentaCompensada.find({}, { _id: 1 });
  let arreglo = ultimaCompensada.map((e) => {
    return e._id;
  });
  let id = arreglo.length !== 0 ? Math.max(...arreglo) : 0;
  req.body._id = id + 1;
  const now = new Date();
  req.body.fecha = new Date(
    now.getTime() - now.getTimezoneOffset() * 60000
  ).toISOString();
  const nuevaCompensada = new CuentaCompensada(req.body);
  await nuevaCompensada.save();
  console.log(
    `Compensdad ${req.body.nro_venta} creada al cliente ${req.body.cliente}`
  );
  res.send(`Compensdad ${req.body._id} creada`);
};

compensadaCTRL.traerPorCliente = async (req, res) => {
  const { id } = req.params;

  try {
    const compensadas = await CuentaCompensada.find({
      $and: [{ idCliente: id }, { saldo: { $not: { $eq: 0 } } }],
    });

    const historicas = await CuentaHistorica.find({
      $and: [{idCliente: id}]
    });
    

    const compensadasConInformacion = await agregarIngormacionCompensadas(
      compensadas
    );

    const historicasConInformacion = await agregarInformacionHistoricas(historicas);

    res.status(200).json({
      ok: true,
      historicas: historicasConInformacion,
      compensadas: compensadasConInformacion,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al traer las cuentas Compensadas",
    });
  }
};

compensadaCTRL.traerCompensada = async (req, res) => {
  const { id } = req.params;
  try {
    const compensada = await CuentaCompensada.findOne({ nro_venta: id });
    res.status(200).json({
      ok: true,
      compensada,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al traer la cuenta Compensada",
    });
  }
};

compensadaCTRL.modificarCompensada = async (req, res) => {
  const { id } = req.params;
  delete req.body._id;
  const compensada = await CuentaCompensada.findOneAndUpdate(
    { nro_venta: id },
    req.body
  );
  console.log(`Compensada ${id} Modificada del cliente ${req.body.cliente}`);
  res.send(`Compensada ${id} Modificada`);
};

compensadaCTRL.eliminarCuenta = async (req, res) => {
  const { id } = req.params;
  const compensada = await CuentaCompensada.findOneAndDelete({ nro_venta: id });
  res.send(compensada);
};

compensadaCTRL.cambiarObservaciones = async (req, res) => {
  const { numero } = req.params;
  if (numero) {
    await CuentaCompensada.findOneAndUpdate(
      { nro_venta: numero },
      { $set: { observaciones: req.body.observaciones } }
    );
  }
  res.send("OK");
};

compensadaCTRL.actualizarCompensada = async (req, res) => {
  const {numero} = req.params;
  
  try {
   
    // 1.Traer Venta 
    const venta = await Venta.findOne({numero, tipo_venta: 'CC'});
    if(!venta){
      return res.status(404).json({
        ok: false,
        msg: "No se encontro la venta",
      });
    }

    // 2. Traer Cliente
    const cliente = await Cliente.findOne({_id: venta.idCliente});
    if(!cliente){
      return res.status(404).json({
        ok: false,
        msg: "No se encontro el cliente",
      });
    }

    // 3. Traer Compensadas
    const compensada = await CuentaCompensada.findOne({nro_venta: numero});
    if(!compensada){
      return res.status(404).json({
        ok: false,
        msg: "No se encontraron las compensadas",
      });
    }


    // 4. Traer Historica
    const historica = await CuentaHistorica.findOne({nro_venta: numero});
    if(!historica){
      return res.status(404).json({
        ok: false,
        msg: "No se encontraron las historicas",
      });
    }

    // 5. Traer Movimientos
    const movimientos = await MovProducto.find({nro_venta: numero, tipo_venta: 'CC'});
    if(!movimientos){
      return res.status(404).json({
        ok: false,
        msg: "No se encontraron los movimientos",
      });
    }

    // 6. Traer Productos y actaulizar movimientos
    for(const movimiento of movimientos){
      const producto = await Producto.findOne({_id: movimiento.codProd});
      if(!producto){
        return res.status(404).json({
          ok: false,
          msg: "No se encontro el producto",
        });
      }

      movimiento.precio = producto.precio;
      await movimiento.save()
    }

    // 7. Actualizar Venta
    venta.precio = movimientos.reduce((acc, mov) => acc + mov.precio, 0);
    await venta.save();

    // 8. Actualizar Compensada
    compensada.importe = venta.precio;
    compensada.saldo = venta.precio - compensada.pagado;
    await compensada.save();

    // 9. Actualizar Historica
    const debeAnterior = historica.debe;
    const saldoAnterior = historica.saldo;

    historica.debe = venta.precio;
    historica.saldo = saldoAnterior - debeAnterior + venta.precio;
    await historica.save();

    // 10. Actualizar Cliente
    cliente.saldo = venta.precio - compensada.pagado;
    await cliente.save();

    // 11. Traer historicas con fecha superior a la actual
    const historicasPosteriores = await CuentaHistorica.find({
      idCliente: cliente._id,
      fecha: { $gt: historica.fecha }
    }).sort({fecha: 1});

    let saldoInicial = historica.saldo;

    for(const item of historicasPosteriores){
      item.saldo = saldoInicial - item.haber + item.debe;
      saldoInicial = item.saldo;
      await item.save();
    }

    res.status(200).json({
      ok: true,
      msg: 'Actualizado correctamente',
      historicasPosteriores
    });
    

  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al actualizar la cuenta Compensada",
    });
  }
}

module.exports = compensadaCTRL;
