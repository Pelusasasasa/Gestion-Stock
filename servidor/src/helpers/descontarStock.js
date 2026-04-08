const NroSerie = require('../models/NroSerie');
const Producto = require('../models/producto');
const Vendedor = require('../models/Vendedor');

exports.descontarStock = async (lista, vendedorId = '', numero = '') => {
  let bandera = true;
  for (let { cantidad, producto, series } of lista) {
    try {
      if (!producto?._id) continue;

      const productoActualizado = await Producto.findById(producto._id);
      productoActualizado.stock -= cantidad;
      productoActualizado.utilidad = producto.utilidad ?? 0;
      await productoActualizado.save();

      const vendedor = await Vendedor.findById(vendedorId);

      if (series) {
        for (let elem of series) {
          const serie = new NroSerie({
            codigo: producto._id,
            producto: producto.descripcion,
            marca: producto.marca,
            nro_serie: elem,
            provedor: 'Venta',
            factura: numero.toString(),
            vendedor: vendedor.nombre,
          });
          await serie.save();
        }
      }
    } catch (error) {
      console.error(error);
      bandera = false;
    }
  }
  return bandera;
};
