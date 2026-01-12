const Producto = require("../models/producto");

exports.descontarStock = async (lista) => {
  let bandera = true;
  for (let { cantidad, producto, series } of lista) {
    try {
      if (!producto?._id) continue;

      const productoActualizado = await Producto.findById(producto._id);
      productoActualizado.stock -= cantidad;
      productoActualizado.utilidad = producto.utilidad ?? 0;
      await productoActualizado.save();
    } catch (error) {
      console.error(error);
      bandera = false;
    }
  }
  return bandera;
};
