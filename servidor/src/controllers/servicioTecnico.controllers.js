const servicioCTRL = {};
const Servicio = require("../models/ServicioTecnico");
const EquipoServicio = require("../models/EquipoServicio");
const ServicioHistorial = require("../models/ServicioHistorial");

const { actualizarNumero } = require("../helpers/actualizarNumero");
const { modificarEquipos, cargarEquipos } = require("../helpers/cargarEquipos");
const {
  cargarHistoricaServicio,
} = require("../helpers/cargarHistoricaServicio");
const {
  crearMovimientoVendedores,
} = require("../helpers/crearMovimientoVendedores");

servicioCTRL.eliminarPorID = async (req, res) => {
  const { id } = req.params;

  try {
    const servicio = await Servicio.findByIdAndUpdate(id, { activo: false });
    crearMovimientoVendedores(
      `Elimino el servico numero ${servicio.numero} del cliente ${servicio.datosClientes.nombre}`,
      req.query.vendedor,
      "Servicio",
    );

    res.status(200).json({
      ok: true,
      msg: `Servicio con el numero ${servicio.numero} Eliminado correctamente`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "No se pudo eliminar el servicio",
    });
  }
};

servicioCTRL.crearServicio = async (req, res) => {
  const { equipos } = req.body;
  try {
    const numero = await actualizarNumero("SR");
    if (!numero)
      return res.status(404).json({
        ok: false,
        msg: "No se pudo modificar el numero",
      });

    req.body.numero = numero.numero;
    req.body.historial = cargarHstorial(req.body);

    const servicio = new Servicio(req.body);

    const equiposCargados = await cargarEquipos(equipos, req.body.numero);

    const historialCargado = await cargarHistoricaServicio(
      equiposCargados,
      req.body.numero,
    );

    if (!equiposCargados) {
      return res.status(500).json({
        ok: false,
        msg: "No se pudo cargar los equipos",
      });
    }

    await servicio.save();

    const nuevoServicio = await Servicio.findById(servicio._id).populate(
      "vendedor",
      ["nombre"],
    );

    await crearMovimientoVendedores(
      `Creo el servicio numero ${servicio.numero} del cliente ${servicio.datosClientes.nombre}`,
      servicio.vendedor,
      "Servicio",
    );

    res.status(201).json({
      ok: true,
      servicio: nuevoServicio,
      equiposCargados,
      historialCargado,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      ok: false,
      msg: "No se pudo cargar el servicio",
    });
  }
};

servicioCTRL.traerPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const servicio = await Servicio.findById(id).populate("vendedor", [
      "nombre",
      "permiso",
    ]);

    const equipos = await EquipoServicio.find({ numero: servicio.numero });
    const historial = await ServicioHistorial.find({ numero: servicio.numero });

    res.status(200).json({
      ok: true,
      servicio,
      equipos,
      historial,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "No se pud obtener los servicios",
    });
  }
};

servicioCTRL.modificarPorId = async (req, res) => {
  const { id } = req.params;
  const { servicio, equipos, vendedor } = req.body;
  console.log(servicio.historial);
  servicio.historial = cargarHstorial(servicio);
  try {
    const servicioTraido = await Servicio.findByIdAndUpdate(id, servicio, {
      new: true,
    });
    if (!servicioTraido) {
      res.status(404).json({
        ok: false,
        msg: "No existe el servicio tecnico",
      });
    }

    const equiposModificados = await modificarEquipos(
      equipos,
      servicioTraido.numero,
    );

    if (!equiposModificados)
      return res.status(404).json({
        ok: false,
        msg: "No se pudo modificar los equipos",
      });

    await crearMovimientoVendedores(
      `Modifico el servicio ${servicioTraido.numero} del cliente ${servicioTraido.datosClientes.nombre}`,
      vendedor,
      "Servicio",
    );

    res.status(200).json({
      ok: true,
      servicio: servicioTraido,
      equiposModificados,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "No se pudo modificar el servicio tecnico",
    });
  }
};

servicioCTRL.traerActivos = async (req, res) => {
  try {
    let equipos = [];
    const servicios = await Servicio.find({ activo: true })
      .populate("vendedor", ["nombre", "permiso"])
      .sort({ fecha: -1 });

    for (let servicio of servicios) {
      const equipo = await EquipoServicio.find({ numero: servicio.numero });
      equipos.push(...equipo);
    }

    res.status(200).json({
      ok: true,
      equipos,
      servicios,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "No se pudo obtener los servicios",
    });
  }
};

servicioCTRL.traerPorNumero = async (req, res) => {
  const { numero } = req.params;

  try {
    const servicio = await Servicio.findOne({ numero: numero });

    if (!servicio)
      return res.status(404).json({
        ok: false,
        msg: "No se encontro el servicio",
      });

    const equipos = await EquipoServicio.find({ numero: numero });
    const historial = await ServicioHistorial.find({ numero: servicio.numero });

    res.status(200).json({
      ok: true,
      servicio,
      equipos,
      historial,
    });
  } catch (error) {
    console.log(error);
    res.status(200).json({
      ok: false,
      msg: "No se pudo obtener el servicio, hable con el administrador",
    });
  }
};

servicioCTRL.modificarEstado = async (req, res) => {
  const { id } = req.params;

  try {
    const servicioModificado = await Servicio.findByIdAndUpdate(
      id,
      { estado: req.body },
      { new: true },
    );
    if (!servicioModificado)
      return res.status(404).json({
        ok: false,
        msg: "No existe el servicio",
      });

    res.status(200).json({
      ok: true,
      servicioModificado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "No se pudo modificar el estado, hable con el administrador",
    });
  }
};

//TODO
servicioCTRL.getForText = async (req, res) => {
  const { text } = req.params;
  if (text !== "vacio") {
    const re = new RegExp(`^${text}`);

    const servicios = await Servicio.find({
      $or: [
        { producto: { $regex: re, $options: "i" } },
        { marca: { $regex: re, $options: "i" } },
        { modelo: { $regex: re, $options: "i" } },
        { cliente: { $regex: re, $options: "i" } },
      ],
    })
      .populate("vendedor", ["nombre", "permiso"])
      .populate("idCliente", ["nombre", "telefono", "direccion"])
      .populate("codProd", ["producto", "marca", "descripcion"]);

    res.send(servicios);
  } else {
    const servicios = await Servicio.find();
    res.send(servicios);
  }
};

module.exports = servicioCTRL;

const cargarHstorial = (servicio) => {
  if (servicio.historial) {
    return [
      ...servicio.historial,
      {
        fecha: new Date(),
        texto: servicio.sugerencias ?? "",
      },
    ];
  } else {
    return [
      {
        fecha: new Date(),
        texto: servicio.sugerencias ?? "",
      },
    ];
  }
};
