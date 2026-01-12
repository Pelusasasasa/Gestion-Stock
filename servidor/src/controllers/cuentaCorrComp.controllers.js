const compensadaCTRL = {};

const {
  agregarIngormacionCompensadas,
} = require("../helpers/agregarIngormacionCompensadas");
const CuentaCompensada = require("../models/cuentaCorrComp");

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

    const compensadasConInformacion = await agregarIngormacionCompensadas(
      compensadas
    );

    res.status(200).json({
      ok: true,
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

module.exports = compensadaCTRL;
