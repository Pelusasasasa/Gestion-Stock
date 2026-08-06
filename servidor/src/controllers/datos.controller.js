const datosCTRL = {};

const Marca = require('../models/Marca.js');
const Rubro = require('../models/Rubro.js');
const Proveedor = require('../models/Provedor.js');
const Numero = require('../models/Numero.js');

datosCTRL.getDatos = async (req, res) => {
  try {
    const marcas = await Marca.find({}).sort({ nombre: 1 });
    const rubros = await Rubro.find({}).sort({ nombre: 1 });
    const proveedores = await Proveedor.find({}).sort({ nombre: 1 });
    const numeros = await Numero.findOne();
    
    res.status(200).json({
      ok: true,
      marcas,
      rubros,
      proveedores,
      numeros,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: "Error interno",
    });
  }
};

module.exports = datosCTRL