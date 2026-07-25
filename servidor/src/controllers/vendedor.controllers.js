const vendedorCTRL = {};

const Vendedor = require("../models/Vendedor");

vendedorCTRL.post = async (req, res) => {
  try {
    const vendedor = new Vendedor(req.body);
    await vendedor.save();
    console.log(`Vendedor ${req.body.nombre} Cargado`);
    res.status(201).json({
      ok: true,
      vendedor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al cargar el vendedor, hable con el administrador",
    });
  }
};

vendedorCTRL.getAll = async (req, res) => {

  const { desactivados } = req.query;

  const estaActivo = desactivados === 'false' ? true : false;

  try {
    const vendedores = await Vendedor.find({activo: estaActivo});
    res.status(200).json({
      ok: true,
      vendedores,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al obtener los vendedores, hable con el administrador",
    });
  }
};

vendedorCTRL.getForId = async (req, res) => {
  const { id } = req.params;
  const vendedor = await Vendedor.findOne({ codigo: id });
  res.send(vendedor);
};

vendedorCTRL.putForId = async (req, res) => {
  const { id } = req.params;
  try {
    const vendedor = await Vendedor.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    console.log(`Vendedor ${vendedor.nombre} Modificado`);
    res.status(200).json({
      ok: true,
      vendedor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al modificar el vendedor, hable con el administrador",
    });
  }
};

vendedorCTRL.deleteForId = async (req, res) => {
  const { id } = req.params;
  try {
    await Vendedor.findOneAndDelete({ _id: id });
    console.log(`Vendedor ${id} Eliminado`);
    res.status(200).json({
      ok: true,
      msg: "Vendedor eliminado correctamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al eliminar el vendedor, hable con el administrador",
    });
  }
};

vendedorCTRL.activar = async(req, res) => {
  try {
    const { id } = req.params;
    
    const vendedor = await Vendedor.findByIdAndUpdate(id, { activo: true }, {
      new: true,
    });
    console.log(`Vendedor ${vendedor.nombre} Desactivado`);
    res.status(200).json({
      ok: true,
      msg: "Vendedor desactivado correctamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al desactivar el vendedor, hable con el administrador",
    });
  }
};

vendedorCTRL.desactivar = async(req, res) => {
  try {
    const { id } = req.params;
    
    const vendedor = await Vendedor.findByIdAndUpdate(id, { activo: false }, {
      new: true,
    });
    console.log(`Vendedor ${vendedor.nombre} Desactivado`);
    res.status(200).json({
      ok: true,
      msg: "Vendedor desactivado correctamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al desactivar el vendedor, hable con el administrador",
    });
  }
};

module.exports = vendedorCTRL;
