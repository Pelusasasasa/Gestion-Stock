const productoCTRL = {};

const Producto = require('../models/producto');
const Numero = require('../models/Numero');
const Marca = require('../models/Marca');
const movProducto = require('../models/movProducto');


const { crearMovimientoVendedores } = require('../helpers/crearMovimientoVendedores');
const { crearNumeroSeries } = require('../helpers/crearNumeroSeries');

productoCTRL.descontarStock = async (req, res) => {
  const { id } = req.params;
  const { stock, tipo, descripcion, vendedor, series, cant } = req.body;
  try {
    const producto = await Producto.findByIdAndUpdate(id, { stock }, { new: true });

    const nuevoMovimiento = {
      fecha: new Date(),
      tipo_venta: tipo,
      cliente: '',
      nombreCliente: '',
      marca: producto.marca,
      codProd: producto._id,
      producto: producto.descripcion,
      rubro: producto.rubro,
      cantidad: cant ? cant : stock,
      iva: producto.impuesto,
      precio: producto.precio,
      nro_venta: 0,
      tipo_comp: tipo
    }

    const nuevoMovimientoProducto = new movProducto(nuevoMovimiento);

    await nuevoMovimientoProducto.save();

    const movimientoVendedor = await crearMovimientoVendedores(
      tipo === 'resta' ? `Resto el stock a ${stock} del producto ${descripcion}}` : `Sumo el stock a ${stock} del producto ${descripcion}`,
      vendedor,
    );

    if (!movimientoVendedor)
      return res.status(404).json({
        ok: false,
        msg: 'Error al crear el movimiento del vendedor',
      });

    const movimientoSeries = await crearNumeroSeries(series);

    if (!movimientoSeries)
      return res.status(404).json({
        ok: false,
        msg: 'Error al crear el numero de serie',
      });

    res.status(200).json({
      ok: true,
      producto,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: 'Error al descontrar stock, hable con el administrador',
    });
  }
};

productoCTRL.getsProductos = async (req, res) => {
  const { descripcion, condicion } = req.params;

  const { desactivados = 'false' } = req.query;

  const estaActivo = desactivados === 'false' ? true : false;
  
  try{
    let productos;
  if (descripcion === 'textoVacio') {
    productos = await Producto.find({activo: estaActivo}).populate('marca', ['nombre']).limit(50);
  } else if (condicion === 'codigo') {
    const re = new RegExp(`^${descripcion}`);
    productos = await Producto.find({
      $or: [{ _id: { $regex: re, $options: 'i' } }, { codigoSecundario: { $regex: re, $options: 'i' } }],
      activo: estaActivo,
    }).populate('marca', ['nombre']);
  } else if(condicion === 'marca'){
    const marcasCoincidentes = await Marca.find({
      nombre: {$regex: descripcion, $options: 'i'}
    });

    const marcaIds = marcasCoincidentes.map(m => m._id);

    productos = await Producto.find({
      marca: { $in: marcaIds},
      activo: estaActivo
    }).populate('marca', ['nombre']).limit(50);

  } else {
    let re;
    try {
      if (descripcion[0] === '*') {
        re = new RegExp(`${descripcion.substr(1)}`);
      } else {
        re = new RegExp(`^${descripcion}`);
      }
      productos = await Producto.find({
        [condicion]: { $regex: re, $options: 'i' },
        activo: estaActivo,
      }).populate('marca', ['nombre']).limit(50);
    } catch (error) {
      re = descripcion;
      productos = await Producto.find({activo: estaActivo}).populate('marca', ['nombre']).limit(50);
    }
  }

  if(!productos){
    return res.status(404).json({
      ok: false,
      msg: 'No se encontraron productos',
    })
  }

  res.status(200).json({
    ok: true,
    productos,
  });
  }catch(error){
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: 'Error al obtener los productos',
    });
  }
};

productoCTRL.traerPrecio = async (req, res) => {
  const { id } = req.params;
  const producto = (await Producto.find({ _id: id }, { precio: 1, _id: 0 }))[0];
  
  res.send(`${producto.precio}`);
};

productoCTRL.traerProducto = async (req, res) => {
  const { id } = req.params;
  let producto = [];
  if (id === 'rubro') {
    const rubros = await Producto.find({}, { rubro: 1, _id: 0 }).populate('marca', {nombre: 1});
    rubros.forEach((rubro) => {
      producto.push(rubro.rubro);
    });
  } else {
    producto = await Producto.findOne({
      $or: [{ _id: id },{codigoSecundario: id}]
    }).populate('marca', {nombre: 1});
  }
  res.send(producto);
};

productoCTRL.traerProductoPorNombre = async (req, res) => {
  const { nombre } = req.params;
  
  const producto = await Producto.findOne({ descripcion: nombre });
  res.send(producto);
};

productoCTRL.modificarProducto = async (req, res) => {
  const { id } = req.params;
  let producto;
  let mensaje;
  let estado;

  const now = new Date();
  req.body.ultimaModificacion = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();
  try {
    producto = await Producto.findOneAndUpdate({ _id: id }, req.body);
    mensaje = `Producto ${producto?.descripcion} Modificado`;
    estado = true;
  } catch (error) {
    console.error(error);
    mensaje = `Producto ${producto?.descripcion} No se modifico`;
    estado = false;
  }
  res.send(
    JSON.stringify({
      estado,
      mensaje,
    }),
  );
};

productoCTRL.updateProducto = async (req, res) => {
  const { codigo } = req.params;

  try {
    const productUpdate = await Producto.findOneAndUpdate({ _id: codigo }, req.body, { new: true });

    if (!productUpdate) {
      return res.status(404).json({
        ok: false,
        msg: 'Producto no encontrado',
      });
    }

    res.status(200).json({
      ok: true,
      productUpdate,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: 'No se puedo modificar el producto',
      error,
    });
  }
};

productoCTRL.cargarProducto = async (req, res) => {
  let producto;
  

  try {
    producto = new Producto(req.body);
    await producto.save();

    return res.status(200).json({
      ok: true,
      producto
    })
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: 'Error al cargar el producto'
    })
  }

  
};

productoCTRL.eliminarProducto = async (req, res) => {
  const { id } = req.params;
  const producto = await Producto.findOneAndDelete({ _id: id });
  res.send(`Producto ${producto.descripcion} eliminado`);
};

productoCTRL.traerMarcas = async (req, res) => {
  try {
    const marcas = await Producto.distinct('marca', { marca: {$ne: null}});
    res.status(200).send(marcas);
  }catch (error){
    console.error(error);
    res.status(500).send([])
  }
};

productoCTRL.traerProvedores = async (req, res) => {
  try{
    const provedores = await Producto.distinct('provedor', {provedor: {$nin: ['', null]}})
    res.status(200).send(provedores)   
  }catch(error){
    console.error(error)
    res.status(500).send([])
  }
};

productoCTRL.putMarcas = async (req, res) => {

  //Todo
  // try {
  //   const { porcentaje, marca } = req.body;
  //   const pct = parseFloat(porcentaje);
  //   const productos = await Producto.find({ marca: marca });
  //   for (const producto of productos) {
  //     if (producto.costoDolar && producto.costoDolar > 0) {
  //       producto.costoDolar = parseFloat((producto.costoDolar + (producto.costoDolar * pct) / 100).toFixed(2));
  //     } else {
  //       producto.costo = parseFloat((producto.costo + (producto.costo * pct) / 100).toFixed(2));
  //     }
  //     const baseCosto = producto.costoDolar > 0 ? producto.costoDolar : producto.costo;
  //     const utilidad = Number(producto.utilidad || 0);
  //     const impuesto = Number(producto.impuesto || 0);
  //     const ganancia = Number(producto.ganancia || 0);
  //     const costoMasUtilidad = baseCosto + (baseCosto * (utilidad / 100));
  //     const conImpuesto = costoMasUtilidad + (costoMasUtilidad * (impuesto / 100));
  //     const conGanancia = conImpuesto + (conImpuesto * (ganancia / 100));
  //     if (producto.costoDolar > 0) {
  //       const numero = await Numero.findOne();
  //       const cotizacion = numero?.Dolar || 1;
  //       producto.precio = parseFloat((conGanancia * cotizacion).toFixed(2));
  //     } else {
  //       producto.precio = parseFloat(conGanancia.toFixed(2));
  //     }
  //     await Producto.findByIdAndUpdate(producto._id, {
  //       costo: producto.costo,
  //       costoDolar: producto.costoDolar,
  //       precio: producto.precio,
  //     });
  //   }
  //   res.status(200).json({ estado: true, mensaje: 'Productos de la marca modificados con éxito' });
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).json({ estado: false, mensaje: 'Error al modificar productos por marca' });
  // }

  const { porcentaje, marca } = req.body;
  const productos = await Producto.find({ marca: marca });
  for await (let producto of productos) {
    producto.costo = (producto.costo + (producto.costo * porcentaje) / 100).toFixed(2);
    const impuesto = producto.costo + (producto.costo * producto.impuesto) / 100;
    const ganancia = (impuesto * producto.ganancia) / 100;
    producto.precio = (impuesto + ganancia).toFixed(2);
    await Producto.findOneAndUpdate({ _id: producto._id }, producto);
  }
  res.send(
    JSON.stringify({
      mensaje: 'Producto Modificados',
      estado: true,
    }),
  );
};

productoCTRL.cambioPreciosPorDolar = async (req, res) => {
  try {
    const { dolar } = req.params;
    const cotizacion = parseFloat(dolar);
    const productos = await Producto.find({ costoDolar: { $gt: 0 } });

    for (let producto of productos) {
      const costoDolar = Number(producto.costoDolar || 0);
      const utilidad = Number(producto.utilidad || 0);
      const impuesto = Number(producto.impuesto || 0);
      const ganancia = Number(producto.ganancia || 0);

      const costoMasUtilidad = costoDolar + (costoDolar * (utilidad / 100));
      const conImpuesto = costoMasUtilidad + (costoMasUtilidad * (impuesto / 100));
      const conGanancia = conImpuesto + (conImpuesto * (ganancia / 100));
      
      producto.precio = parseFloat((conGanancia * cotizacion).toFixed(2));
      await Producto.findByIdAndUpdate(producto._id, { precio: producto.precio });
    }
    console.log('Precios con costo en dólares actualizados correctamente');
    res.status(200).json({ ok: true, msg: 'Precios actualizados por cotización de dólar' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: 'Error al cambiar precios por dólar' });
  }
};

productoCTRL.productosPorMarcas = async (req, res) => {
  let { lista } = req.params;
  lista = JSON.parse(lista);
  let arreglo = [];
  for await (let marca of lista) {
    const productos = await Producto.find({ marca: marca });
    arreglo.push(...productos);
  }
  res.send(arreglo);
};


productoCTRL.putForProvedor = async (req, res) => {
  try {
    const {provedor, porcentaje} = req.body;
    const pct = parseFloat(porcentaje);
    const productos = await Producto.find({provedor: provedor});
    for(const producto of productos){
      if(producto.costoDolar && producto.costoDolar > 0){
        producto.costoDolar = parseFloat((producto.costoDolar + (producto.costoDolar * pct) / 100).toFixed(2));
      }else{
        producto.costo = parseFloat((producto.costo + (producto.costo * pct) / 100).toFixed(2))
      }

      const baseCosto = producto.costoDolar > 0 ? producto.costoDolar : producto.costo;

      const utilidad = Number(producto.utilidad || 0);
      const impuesto = Number(producto.impuesto || 0);
      const ganancia = Number(producto.ganancia || 0);

      const costoMasUtilidad = baseCosto + (baseCosto * (utilidad / 100));
      const conImpuesto = costoMasUtilidad + (costoMasUtilidad * (impuesto / 100));
      const conGanancia = conImpuesto + (conImpuesto * (ganancia / 100));

      if(producto.costoDolar > 0 ){
        const numero = await Numero.findOne();
        const cotizacion = numero?.Dolar || 1;
        producto.precio = parseFloat((conGanancia * cotizacion).toFixed(2));
       }else{
        producto.precio = parseFloat(conGanancia.toFixed(2))
       }
       await Producto.findByIdAndUpdate(producto._id, {
        costo: producto.costo,
        costoDolar: producto.costoDolar,
        precio: producto.precio,
      });
    }
    console.log(`Productos de proveedor ${provedor} modificados`);
    res.status(200).json({ ok: true, msg: 'Productos modificados correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: 'Error al modificar productos por proveedor' });
  }
};

productoCTRL.traerCostoImpuesto = async (req, res) => {
  const { id } = req.params;
  const producto = await Producto.findOne({ _id: id });

  if (producto.costo !== 0) {
    res.status(200).json({
      ok: true,
      costo: producto.costo,
      impuesto: producto.impuesto,
    });
  } else {
    const dolar = (await Numero.findOne()).Dolar;
    res.status(200).json({
      ok: true,
      costo: producto.costoDolar * dolar,
      impuesto: producto.impuesto,
    });
  }
};

productoCTRL.traerImpuesto = async (req, res) => {
  const { id } = req.params;
  const producto = await Producto.findOne({ _id: id });

  res.send(`${producto.impuesto}`);
};

productoCTRL.traerModificados = async (req, res) => {
  const { fecha } = req.params;
  const desde = new Date(fecha + 'T00:00:00.000Z');
  const hasta = new Date(fecha + 'T23:59:59.000Z');
  const productos = await Producto.find({
    $and: [{ ultimaModificacion: { $gte: desde } }, { ultimaModificacion: { $lte: hasta } }],
  });
  res.send(productos);
};

productoCTRL.getProductosPorMarca = async (req, res) => {
  const { marca } = req.params;

  try {
    const productos = await Producto.find({ marca: marca });
    res.json({
      ok: true,
      productos,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: 'Hablar con el administrador',
    });
  }
};

//Modificamos Varios Productos
productoCTRL.modificarVarios = async (req, res) => {
  const productos = req.body;

  try {
    //Creamos un array de operaciones de actualizaion
    const operaciones = productos.map((producto) => ({
      updateOne: {
        filter: { _id: producto._id },
        update: { $set: producto },
      },
    }));

    const resultados = await Producto.bulkWrite(operaciones);

    res.status(200).json({
      ok: true,
      msg: 'Productos Modificados con exito',
      resultados,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    });
  }
};


productoCTRL.activar = async (req, res) => {
  try{
    const { codigo } = req.query;

    const producto = await Producto.findByIdAndUpdate(String(codigo), {activo: true}, {new: true});

    if(!producto) return res.status(404).json({
      ok: false,
      msg: 'Producto no encontrado',
    });

    res.status(200).json({
      ok: true,
      msg: 'Producto activado correctamente',
    });

  }catch(error){
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: 'Error al desactivar el producto',
    });
  }
};

productoCTRL.desactivar = async (req, res) => {
  try{
    const { codigo } = req.query;


    const producto = await Producto.findByIdAndUpdate(String(codigo), {activo: false}, {new: true});

    if(!producto) return res.status(404).json({
      ok: false,
      msg: 'Producto no encontrado',
    });

    res.status(200).json({
      ok: true,
      msg: 'Producto desactivado correctamente',
    });

  }catch(error){
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: 'Error al desactivar el producto',
    });
  }
};

module.exports = productoCTRL;
