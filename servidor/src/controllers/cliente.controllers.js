const clienteCTRL = {};
const {
  crearMovimientoVendedores,
} = require("../helpers/crearMovimientoVendedores");
const Clientes = require("../models/Cliente");

clienteCTRL.getsClientes = async (req, res) => {
  const { nombre } = req.params;
  const { desactivado = 'false' } = req.query;

  const estaActivo = desactivado === 'false';

  try {
    if (!nombre || nombre === "NADA") {
    const clientes = await Clientes.find({activo: estaActivo}).sort({ nombre: 1 }).limit(70);
    
      return res.status(200).json({
        ok: true,
        clientes
      })
  };

  const textoLimpio = nombre.trim();
  const textoEscapado = textoLimpio.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

  const orConditions = [
    {nombre: {$regex: textoEscapado, $options: 'i'}},
    { cuit: {$regex: textoEscapado, $options: 'i'}},
    { telefono: {$regex: textoEscapado, $options: 'i'}}
  ]

  if(!isNaN(textoLimpio) && Number(textoLimpio) > 0) {
    orConditions.push({ _id: Number(textoLimpio  )})
  }

  const clientes = await Clientes.find({
    activo: estaActivo,
    $or: orConditions,
  })
  .sort({ nombre: 1 })
  .limit(100);

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
  try {
    const ultimoCliente = await Clientes.findOne().sort({_id: -1}).select('_id');
    const id = ultimoCliente ? ultimoCliente._id  : 0;
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
    const { _id, nombre, cuit, telefono, direccion, localidad, email,condicionFacturacion, condicionIva, tipoCuenta, observaciones} = req.body;

    if(!nombre)return res.status(400).json({
      ok: false,
      msg: 'El nombre del cliente es obligatorio'
    })

    const cliente = new Clientes({
      _id: Number(_id),
      nombre, cuit, telefono, direccion, localidad, email,
      condicionFacturacion, condicionIva, tipoCuenta, observaciones
    });
    await cliente.save();

    if (!cliente)
      return res.status(404).json({
        ok: false,
        msg: "No se pudo cargar el cliente",
      });

    const movCreado = await crearMovimientoVendedores(`Alta de Cliente ${cliente.nombre}`,req.body.vendedor ?? 'CARLA');
    if(!req.body.vendedor){
      console.error('Error al cargar movimiento vendedor al cargar el cliente')
    }

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
    delete req.body.saldo;
    delete req.body._id;

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
      req.body.vendedor ?? 'CARLA',
    );
    if (!movCreado){
      console.error('Error al cargar movimiento vendedor al modificar el cliente')
    }

    console.log(`Cliente ${cliente.nombre} Modificado`);
    res.status(200).json({
      ok: true,
      cliente,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
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
      req.query.vendedor,
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

clienteCTRL.desactivarCliente = async(req, res) => {
  try {
      const { id } = req.params;

      const clienteDesactivado = await Clientes.findByIdAndUpdate(id, {activo: false}, {new: true});

      if(!clienteDesactivado){
        return res.status(400).json({
          ok: false,
          msg: 'Cliente no encontrado'
        })
      }

      console.log('Cliente desactivado correctamente')
      return res.status(200).json({
        ok: true,
        clienteDesactivado,
        msg: 'Cliente desactivado correctamente'
      })
  } catch (error) {
      console.error(error);
      return res.status(500).json({
        ok: false,
        msg: 'Error al desactivar el cliente, hable con el administrador'
      })
  }
};

clienteCTRL.activarCliente = async(req, res) => {
  try {
      const { id } = req.params;

      const clienteActivado = await Clientes.findByIdAndUpdate(id, {activo: true}, {new: true});

      if(!clienteActivado){
        return res.status(400).json({
          ok: false,
          msg: 'Cliente no encontrado'
        })
      }

      console.log('Cliente activado correctamente')
      return res.status(200).json({
        ok: true,
        clienteActivado,
        msg: 'Cliente activado correctamente'
      })
  } catch (error) {
      console.error(error);
      return res.status(500).json({
        ok: false,
        msg: 'Error al activar el cliente, hable con el administrador'
      })
  }
};

clienteCTRL.traerClienteConSaldo = async (req, res) => {
  const clientes = await Clientes.find({ saldo: { $not: { $eq: 0 } } });
  res.send(clientes);
};

clienteCTRL.traerClientesConDeudas = async (req, res) => {
  try {
    const { soloActivos = 'false'} = req.query;

    const filtros = {
      saldo: { $exists: true},
      $or: [
        { saldo: { $gt: 0.009}},
        { saldo: { $lt: -0.009}},
      ],
    };

    if( soloActivos === 'true' ){
      filtros.activo = true;
    };


    const clientes = await Clientes.find(filtros).sort({saldo: -1}).lean();

    // Metricas
    let totalDeuda = 0;
    let totalAFavor = 0;

    for (const cliente of clientes){
      if (cliente.saldo > 0) totalDeuda += cliente.saldo;
      else totalAFavor += Math.abs(cliente.saldo);
    };

    return res.status(200).json({
      ok: true,
      totalDeuda: Number(totalDeuda.toFixed(2)),
      totalAFavor: Number(totalAFavor.toFixed(2)),
      totalNeto: Number((totalDeuda - totalAFavor).toFixed(2)),
      clientes
    })

  }catch(error){
    console.error(error)
    return res.status(500).json({
      ok: false,
      msg: 'No se pudieron obtener los saldos, hable con el administrador'
    })
  }
}

module.exports = clienteCTRL;
