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



remitoCTRL.getAll = async (req, res) => {
  const { texto = '', pasado = 'false' } = req.query;

  try {

    let remitos = [];
    const estaPasado = pasado === 'false' ? false : true;

    console.log({texto, pasado, estaPasado})

    if(texto === ''){
      remitos = await Remito.find({pasado: estaPasado}).populate('vendedor', 'nombre').limit(70)
      
    }else{

      remitos = await Remito.find({
        pasado: pasado,
        $or: [
          { cliente: { $regex: texto, $options: 'i' } },
        ]
      }).populate('vendedor', 'nombre')
      .limit(70)
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

remitoCTRL.putPasado = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const remito = await Remito.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          pasado: true,
        },
      },
    );

    console.log(remito);
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
}

module.exports = remitoCTRL;
