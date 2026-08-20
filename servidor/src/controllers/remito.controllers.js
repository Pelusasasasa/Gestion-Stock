const remitoCTRL = {};

const { actualizarNumero } = require('../helpers/actualizarNumero');
const { crearMovimientosStock } = require('../helpers/crearMovimientosStock');
const { crearMovimientoVendedores } = require('../helpers/crearMovimientoVendedores');
const { descontarStock } = require('../helpers/descontarStock');

const Movimiento = require('../models/movProducto');
const Producto = require('../models/producto');
const Remito = require('../models/Remito');
const ManoObra = require('../models/ManoObra');
const Cliente = require('../models/Cliente');
const NroSerie = require('../models/NroSerie')



remitoCTRL.getAll = async (req, res) => {
  const { texto = '', pasado = 'false', activo = 'true' } = req.query;


  try {

    let remitos = [];
    const estaPasado = pasado === 'false' ? false : true;
    const estaActivo = activo === 'false' ? false : true;


    if(texto === ''){
      remitos = await Remito.find({pasado: false, activo: estaActivo}).populate('vendedor', 'nombre').sort({$natural: -1})
      
    }else{

      remitos = await Remito.find({
        pasado: false,
        activo: estaActivo,
        $or: [
          { cliente: { $regex: texto, $options: 'i' } },
        ]
      }).populate('vendedor', 'nombre').sort({$natural: -1})
      
    }

    const datosClientes = await Cliente.find({ _id: { $in: remitos.map((remito) => remito.idCliente) } });

    remitos = await Promise.all(
      remitos.map(async (remito) => {
        const cliente = datosClientes.find((cliente) => cliente._id.toString() === remito.idCliente?.toString());
        const movimientos = await Movimiento.find({
          tipo_venta: 'RT',
          nro_venta: remito.numero,
        });

        return { ...remito.toObject(), datosClientes: cliente, movimientos };
      })
    );

    res.status(200).json({
      ok: true,
      remitos,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: 'No se pudo obtener los remitos, hable con el administrador',
    });
  }
}

remitoCTRL.getforid = async (req, res) => {
  const { id } = req.params;

  try {
    const remito = await Remito.findById(id).populate('vendedor', 'nombre');

    res.status(200).json({
      remito,
      ok: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: 'No se pudo obtener el remito, hable con el administrador',
    });
  }
};

remitoCTRL.postOne = async (req, res) => {
  try {
    const remito = new Remito(req.body);

    const numeroActualizado = await actualizarNumero(remito.tipo_venta);
    if (numeroActualizado.ok) {
      remito.numero = numeroActualizado.numero;
    }

    const stockDescontado = await descontarStock(req.body.listaProductos, remito.vendedor, remito.numero);
    if (!stockDescontado)
      return res.status(400).json({
        ok: false,
        msg: 'Error al descontar el stock',
      });

    const movimientos = await crearMovimientosStock(req.body.listaProductos, remito);
    if (!movimientos)
      return res.status(400).json({
        ok: false,
        msg: 'Error al crear los movimientos',
      });

    await remito.save();

    await crearMovimientoVendedores(`Se hizo un remito al cliente ${remito.cliente}`, remito.vendedor);

    const nuevoRemito = await Remito.findOne({ _id: remito._id }).populate('vendedor', 'nombre');

    res.status(201).json({
      ok: true,
      venta: nuevoRemito,
      movimientos,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: 'Error al cargar el remito, hable con el administrador',
    });
  }
};

remitoCTRL.realizarRemito = async(req, res) => {
  try{
    const { remito } = req.body;
    const {productos} = req.query;

    // 1. Actualizar numero
    const numero = await actualizarNumero(remito.tipo_venta);
    if(!numero.ok)
      return res.status(400).json({
        ok:false,
        msg: 'Error al actualizar el numero'
      })
    
    remito.numero = numero.numero;

    // 2. Cargar Remito

    const remitoCargado = new Remito(remito);
    await remitoCargado.save();

    if(!remitoCargado)
      return res.status(400).json({
        ok:false,
        msg: 'Error al cargar el remito, pero si se actualizo el numero'
      })

      let movimientos = [];
      for(let i = 0; i < productos.length; i++){
        
        if(!productos[i]._id) continue;
        // 3.Descontar Stock
        const producto = await Producto.findByIdAndUpdate(
          productos[i]._id,
          {
            $inc: {stock: -productos[i].cantidad}
          },
          {runValidators: true}
        )

      if(!producto)
        return res.status(400).json({
          ok:false,
          msg: 'Error al descontar el stock, pero si se actualizo el numero y se cargo el remito'
        })
        
        // 4.Cargar Mov Producto
        const movimiento = new Movimiento({
          fecha: remitoCargado.fecha,
          tipo_venta: remitoCargado.tipo_venta,
          cliente: remitoCargado.idCliente,
          nombreCliente: remitoCargado.cliente,
          marca: productos[i].marca,
          codProd: productos[i]._id,
          producto: productos[i].descripcion,
          cantidad: productos[i].cantidad,
          iva: productos[i].impuesto,
          precio: productos[i].precio,
          nro_venta: remitoCargado.numero,
          tipo_comp: remitoCargado.tipo_comp,
          series: productos[i].series
        });

        await movimiento.save();
        movimientos.push(movimiento);

        if(!movimiento)
          return res.status(400).json({
            ok:false,
            msg: 'Error al cargar el movimiento, pero si se actualizo el numero y se cargo el remito y se descontó el stock'
          });
          console.log(productos[i].series)

        // 5. Cargar series
        if(productos[i].series){
          const serie = new NroSerie({
            fecha: remito.fecha,
            codigo: productos[i]._id,
            producto: productos[i].descripcion,
            nro_serie: productos[i].series,
            factura: remito.tipo_comp,
            vendedor: remito.vendedor
          });

          await serie.save();
          if(!serie){
            console.error('Error al guardar la serie');
            return res.status(400).json({
              ok:false,
              msg: 'Error al guardar la serie, pero si se actualizo el numero y se cargo el remito y se descontó el stock y se cargó el movimiento'
            })
          }
        }

    };  

    const remitoObj = remitoCargado.toObject();
    remitoObj.movimientos = movimientos;      

    res.status(200).json({
      ok: true,
      remito: remitoObj,
      msg: 'Remito cargado correctamente'
    });
  }catch(error){
    console.error(error);
    return res.status(500).json({
      ok:false,
      msg: 'No se pudo cargar el remito'
    })
  }
};

remitoCTRL.putPasado = async (req, res) => {
  const { id } = req.params;
  
  try {
    const remito = await Remito.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          pasado: true,
        },
      },
    );

    if (!remito)
      return res.status(400).json({
        ok: false,
        msg: 'No se pudo actualizar el remito',
      });

    res.status(200).json({
      ok: true,
      remito,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: 'Error al actualizar el remito, hable con el administrador',
    });
  }
};

remitoCTRL.patchObservaciones = async (req, res) => {
  const { id } = req.params;

  try {
    const remito = await Remito.findByIdAndUpdate(id, { observaciones: req.body.observaciones }, { new: true });

    if (!remito)
      return res.status(404).json({
        ok: false,
        msg: 'Remito no encontrado',
      });

    res.status(200).json({
      ok: true,
      remito,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: 'No se pudo modifcar las observaciones del remit, hable con el administrador',
    });
  }
};

remitoCTRL.cargarRemitoManoObra = async(req, res) => {
  try {
    const {remito, movimientos} = req.body;
    

    const nuevoRemito = new Remito(remito);

    const numeroActualizado = await actualizarNumero(remito.tipo_venta);
    if (numeroActualizado.ok) {
      nuevoRemito.numero = numeroActualizado.numero;
    }

    await nuevoRemito.save();


    for (const mov of movimientos) {
      const producto = await Producto.findOne({ _id: mov.codProd.toString() });

      if (!producto) {
        return res.status(404).json({
          ok: false,
          msg: `No se encontró el producto con ID ${mov.codProd}`
        });
      }

      await ManoObra.findByIdAndUpdate(mov.manoObra, { activo: false, estado: 'Remitado' });

      const nuevoMovimiento = new Movimiento({
          fecha: nuevoRemito.fecha,
          tipo_venta: 'RT',
          cliente: nuevoRemito.idCliente,
          nombreCliente: nuevoRemito.cliente,
          marca: producto.marca,
          codProd: mov.codProd,
          producto: producto.descripcion,
          rubro: producto.rubro,
          cantidad: mov.cantidad,
          iva: producto.impuesto,
          precio: producto.precio,
          nro_venta: nuevoRemito.numero,
          tipo_comp: 'REMITO'
      });

      await nuevoMovimiento.save();
    }


    res.status(200).json({
      ok: true,
      msg: 'Remito Cargado Correctamente'
    })

    
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: 'Error en el servidor'
    })
  }
};

remitoCTRL.getItemsRemitos = async(req, res) => {
  const { listaRemitos } = req.query;

  try {
    const todosLosMovimientos = listaRemitos.flatMap(remito => remito.movimientos);

  let productos = [];
  for(const item of todosLosMovimientos){
    const producto = await Producto.findById(item.codProd);
    if(producto){
      productos.push({
        _id: producto._id,
        descripcion: producto.descripcion,
        precio: producto.precio,
        cantidad: 1,
        impuesto: producto.impuesto,
        marca: producto.marca,
        productoOriginal: producto,
        
      });
    }
  }

    return res.status(200).json({
      ok: true,
      productos,
      msg: 'Productos cargados correctamente'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: 'Error en el servidor'
    })
  }
}

module.exports = remitoCTRL;
