const clienteCTRL = {};
const {
  crearMovimientoVendedores,
} = require("../helpers/crearMovimientoVendedores");
const Clientes = require("../models/Cliente");

clienteCTRL.getsClientes = async (req, res) => {
  const { nombre } = req.params;
  let clientes;
  let texto = "";

  texto = nombre.includes("*") ? nombre.substr(1) : nombre;

  try {
    if (nombre === "NADA") {
      clientes = await Clientes.find().sort({ nombre: 1 }).limit(50);
    } else {
      const re = nombre.includes("*")
        ? new RegExp(`${texto}`)
        : new RegExp(`^${texto}`);
      clientes = await Clientes.find({
        nombre: { $regex: re, $options: "i" },
      }).sort({ nombre: 1 });
    }

    res.status(200).json({
      ok: true,
      clientes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "No se pudo obtener los clientes, Hable con el administrador",
    });
  }
};

clienteCTRL.id = async (req, res) => {
  clg;
  try {
    const ultimoCliente = await Clientes.find({}, { _id: 1 });
    let arreglo = ultimoCliente.map((e) => {
      return e._id;
    });
    let id = arreglo.length !== 0 ? Math.max(...arreglo) : 0;
    res.status(200).json({
      ok: true,
      id: id + 1,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "No se pudo obtener el id, Hable con el administrador",
    });
  }
};

clienteCTRL.getClienteId = async (req, res) => {
  const { id } = req.params;

  if (isNaN(id))
    return res.status(400).json({
      ok: false,
      msg: "No es un id valido",
    });

  try {
    const cliente = await Clientes.findOne({ _id: id });

    if (!cliente)
      return res.status(400).json({
        ok: false,
        msg: "No se encontro el cliente",
      });

    res.status(200).json({
      ok: true,
      cliente,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "No se pudo obtener el cliente, Hable con el administrador",
    });
  }
};

clienteCTRL.cargarCliente = async (req, res) => {
  try {
    const cliente = new Clientes(req.body);
    await cliente.save();

    if (!cliente)
      return res.status(404).json({
        ok: false,
        msg: "No se pudo cargar el cliente",
      });

    const movCreado = await crearMovimientoVendedores(
      `Alta de Cliente ${cliente.nombre}`,
      req.body.vendedor
    );
    if (!movCreado)
      return res.status(500).json({
        ok: false,
        msg: "No se pudo crear el movimiento de vendedor, Hable con el administrador",
      });

    res.status(201).json({
      ok: true,
      cliente,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "No se pudo cargar el cliente, Hable con el administrador",
    });
  }
};

clienteCTRL.modificarCliente = async (req, res) => {
  const { id } = req.params;
  try {
    let cliente = await Clientes.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });

    if (!cliente)
      return res.status(404).json({
        ok: false,
        msg: "No se existe el cliente",
      });

    const movCreado = await crearMovimientoVendedores(
      `Modificacion del Cliente ${cliente.nombre}`,
      req.body.vendedor
    );
    if (!movCreado)
      return res.status(500).json({
        ok: false,
        msg: "No se pudo crear el movimiento de vendedor, Hable con el administrador",
      });

    console.log(`Cliente ${cliente.nombre} Modificado`);
    res.status(200).json({
      ok: true,
      cliente,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "No se pudo modificar el cliente, Hable con el administrador",
    });
  }
};

clienteCTRL.eliminarCliente = async (req, res) => {
  const { id } = req.params;
  try {
    const cliente = await Clientes.findOneAndDelete({ _id: id });

    if (!cliente)
      return res.status(404).json({
        ok: false,
        msg: "No existe el cliente",
      });

    const movCreado = await crearMovimientoVendedores(
      `Eliminacion de Cliente ${cliente.nombre}`,
      req.query.vendedor
    );
    if (!movCreado)
      return res.status(500).json({
        ok: false,
        msg: "No se pudo crear el movimiento de vendedor, Hable con el administrador",
      });

    res.status(200).json({
      ok: true,
      msg: `Cliente ${cliente.nombre} Eliminado`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "No se pudo eliminar el cliente, Hable con el administrador",
    });
  }
};

clienteCTRL.traerClienteConSaldo = async (req, res) => {
  const clientes = await Clientes.find({ saldo: { $not: { $eq: 0 } } });
  res.send(clientes);
};

module.exports = clienteCTRL;
