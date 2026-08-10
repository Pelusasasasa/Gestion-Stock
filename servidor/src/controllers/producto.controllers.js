const productoCTRL = {};

const Producto = require('../models/producto');
const Numero = require('../models/Numero');
const movProducto = require('../models/movProducto');
const { crearMovimientoVendedores } = require('../helpers/crearMovimientoVendedores');
const { crearNumeroSeries } = require('../helpers/crearNumeroSeries');

productoCTRL.descontarStock = async (req, res) => {
  const { id } = req.params;
  const { stock, tipo, descripcion, vendedor, series } = req.body;
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
      cantidad: stock,
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
  } else if (condicion === '_id') {
    const re = new RegExp(`^${descripcion}`);
    productos = await Producto.find({
      $or: [{ _id: { $regex: re, $options: 'i' } }, { codigoSecundario: { $regex: re, $options: 'i' } }],
      activo: estaActivo,
    }).populate('marca', ['nombre']);
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
  console.log(producto);
  res.send(`${producto.precio}`);
};

productoCTRL.traerProducto = async (req, res) => {
  const { id } = req.params;
  let producto = [];
  if (id === 'rubro') {
    rubros = await Producto.find({}, { rubro: 1, _id: 0 }).populate('marca', {nombre: 1});
    rubros.forEach((rubro) => {
      producto.push(rubro.rubro);
    });
  } else {
    producto = await Producto.findOne({ _id: id }).populate('marca', {nombre: 1});
  }
  res.send(producto);
};

productoCTRL.traerProductoPorNombre = async (req, res) => {
  const { nombre } = req.params;
  console.log(nombre)
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
  const productos = await Producto.find({}, { _id: 0, marca: 1 });
  let marcas = [];
  productos.filter((ele) => {
    if (!marcas.includes(ele.marca)) {
      marcas.push(ele.marca);
    }
  });
  res.send(marcas);
};

productoCTRL.putMarcas = async (req, res) => {
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
  const { dolar } = req.params;
  const productos = await Producto.find({ costoDolar: { $ne: 0 } });

  for (let producto of productos) {
    const costoIva = parseFloat((producto.costoDolar + (producto.costoDolar * producto.impuesto) / 100) * parseFloat(dolar).toFixed(2));
    producto.precio = ((costoIva * producto.ganancia) / 100 + costoIva).toFixed(2);
    await Producto.findOneAndUpdate({ _id: producto._id }, producto);
  }
  console.log('Cambios el precio de los productos con dolares');
  res.end();
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

productoCTRL.traerProvedores = async (req, res) => {
  let provedores = [];
  const productos = await Producto.find({}, { _id: 1, provedor: 1 });
  productos.forEach((producto) => {
    if (!provedores.includes(producto.provedor)) {
      provedores.push(producto);
    }
  });
  res.send(JSON.stringify(provedores));
};

productoCTRL.putForProvedor = async (req, res) => {
  const { provedor, porcentaje } = req.body;
  const productos = await Producto.find({ provedor: provedor });

  productos.forEach(async (producto) => {
    producto.costo = producto.costo + (producto.costo * porcentaje) / 100;
    const costoMasIva = parseFloat((producto.costo + (producto.costo * producto.impuesto) / 100).toFixed(2));
    producto.precio = (costoMasIva + (costoMasIva * producto.ganancia) / 100).toFixed(2);
    await Producto.findOneAndUpdate({ _id: producto._id }, producto);
  });
  console.log(`Productos de provedor ${provedor} Modificados`);
  res.send('Productos modificados');
};

productoCTRL.traerCostoImpuesto = async (req, res) => {
  const { id } = req.params;
  console.log(id);
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
