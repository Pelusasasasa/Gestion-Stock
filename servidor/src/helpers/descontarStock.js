const NroSerie = require('../models/NroSerie');
const Producto = require('../models/producto');
const Vendedor = require('../models/Vendedor');

exports.descontarStock = async (lista, vendedorId = '', numero = '') => {
  let bandera = true;
  for (let { cantidad, producto, series } of lista) {
    try {
      if (!producto?._id) continue;

      await Producto.findByIdAndUpdate(
        producto._id,
        {
          $inc: { stock: -cantidad },
          $set: { utilidad: producto.utilidad ?? 0 },
        },
        { runValidators: true }
      );

      const vendedor = await Vendedor.findById(vendedorId);

      if (series) {
        for (let elem of series) {
          console.log('Elem', elem);
          const serie = new NroSerie({
            codigo: producto._id,
            producto: producto.descripcion,
            marca: producto?.marca?._id || undefined,
            nro_serie: elem || ' ',
            provedor: elem?.provedor ? elem.provedor : undefined,
            factura: numero.toString(),
            vendedor: vendedor._id,
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
