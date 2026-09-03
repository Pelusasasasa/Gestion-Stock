const ventaCTRL = {};

const Venta = require('../models/Venta');
const Producto = require('../models/producto');
const Movimiento = require('../models/movProducto');
const CuentaCorriente = require('../models/cuentaCorrComp');
const CuentaHistorica = require('../models/cuentaCorrHisto');
const NroSerie = require('../models/NroSerie');
const Cliente = require('../models/Cliente');
const Remito = require('../models/Remito');

const funcion = require('../assets/js/pdf');
const { cambiarSaldoCliente } = require('../helpers/cambiarSaldoCliente');
const { actualizarNumero } = require('../helpers/actualizarNumero');
const { descontarStock } = require('../helpers/descontarStock');
const { crearMovimientosStock } = require('../helpers/crearMovimientosStock');
const { crearCompensada } = require('../helpers/crearCompensada');
const { crearHistorica } = require('../helpers/crearHistorica');
const { crearMovimientoVendedores } = require('../helpers/crearMovimientoVendedores');
const { cargarMetodosPago } = require('../helpers/MetodoPago/cargarMetodosPagos');
const { cargarFactura } = require('../helpers/afip/facturar');


ventaCTRL.getForId = async (req, res) => {
  const { id, tipoVenta } = req.params;

  try {
    const venta = await Venta.findOne({
      $and: [{ tipoVenta: tipoVenta }, { numero: id }],
    }).populate('vendedor', 'nombre');

    res.status(200).json({
      ok: true,
      venta,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: 'No se pudo obtener la venta, hable con el administrador',
    });
  }
};

ventaCTRL.putForId = async (req, res) => {
  const { id, tipo } = req.params;
  try {
    delete req.body._id;
    const venta = await Venta.findOneAndUpdate({ numero: id, tipo_venta: tipo }, req.body);
    res.status(200).json({
      ok: true,
      venta,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: 'No se pudo actualizar la venta, hable con el administrador',
    });
  }
};

ventaCTRL.cargarVenta = async (req, res) => {
  try {
    const venta = new Venta(req.body);

    const numeroActualizado = await actualizarNumero(venta.tipo_venta);
    if (numeroActualizado.ok) {
      venta.numero = numeroActualizado.numero;
    }

    if (venta.tipo_venta === 'CC') {
      const saldoModficado = await cambiarSaldoCliente(venta.idCliente, venta.precio, false, venta.tipo_comp);

      if (!saldoModficado.ok)
        return res.status(400).json({
          msg: 'Error al modificar el saldo del cliente',
          ok: false,
        });

      const compensada = await crearCompensada(venta);
      if (!compensada)
        return res.status(400).json({
          msg: 'Error al crear la compensada',
          ok: false,
        });

      const historica = await crearHistorica(venta);
      if (!historica)
        return res.status(400).json({
          msg: 'Error al crear la historica',
          ok: false,
        });
    }

    if (venta.tipo_venta !== 'PP' && req.body.esRemito !== true) {
      const stockDescontado = await descontarStock(req.body.listaProductos, venta.vendedor, venta.numero);
      if (!stockDescontado)
        return res.status(400).json({
          ok: false,
          msg: 'Error al descontar el stock',
        });
    }

    const movimientos = await crearMovimientosStock(req.body.listaProductos, venta);
    if (!movimientos)
      return res.status(400).json({
        ok: false,
        msg: 'Error al crear los movimientos',
      });

    await venta.save();
    if (req.body.F) {
      funcion.crearPDF(req.body); //creamos un pdf con la venta
    }

    await crearMovimientoVendedores(`Se hizo una venta al cliente ${venta.cliente}`, venta.vendedor);

    const nuevaVenta = await Venta.findOne({ _id: venta._id }).populate('vendedor', 'nombre');

    console.log(`Venta con el numero: ${venta.numero} Cargada`);
    res.status(201).json({
      ok: true,
      venta: nuevaVenta,
      movimientos,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: 'Error al cargar la venta, hable con el administrador',
    });
  }
};

ventaCTRL.realizarVenta = async(req, res) => {
  try {
    const { venta, metodosPagos, productos, facturado, descontarStock = 'true', remitos } = req.body;
    //1. Facturar si factura = true
    if(facturado === "true" || facturado === true){
      const afip = await cargarFactura(venta);
      if(afip.ok){
        venta.afip = afip;

        // Generar PDF
        funcion.crearPDF(venta, productos);
      }else{
        return res.status(400).json({
          ok: false,
          msg: 'No se pudo cargar la factura'
        })
      }
    }

    //2. Actualizar Numero
    const numero = await actualizarNumero(venta.tipo_venta);
    if(!numero.ok)
      return res.status(400).json({
        ok: false,
        msg: 'Error al actualizar el numero, pero si se facturo',
      });

    venta.numero = numero.numero;


    //3. Cargar Venta
    const ventaCargada = new Venta(venta);
    await ventaCargada.save();

    if(!ventaCargada)
      return res.status(400).json({
        ok: false,
        msg: 'Error al cargar la venta, pero si se facturo y se actualizo el numero',
      });


      
      let movimientos = [];
    for(let i = 0; i < productos.length; i++){
          if (!productos[i]._id && !productos[i].codigoAux) continue;
          
          //4. Descontar Stock Si no es presupuesto
          if(venta.tipo_venta !== 'PP' && descontarStock === 'true'){    
            const producto = await Producto.findByIdAndUpdate(
              productos[i]._id,
              {
                $inc: { stock: -productos[i].cantidad }
              },
              { runValidators: true }
            );

            if(!producto)
              return res.status(400).json({
                ok: false,
                msg: 'Error al descontar el stock, pero si se facturo y se actualizo el numero',
              });
          }
        
          //5. Cargar Movimiento de producto
        const movimiento = new Movimiento({
          fecha: ventaCargada.fecha,
          tipo_venta: ventaCargada.tipo_venta,
          cliente: ventaCargada.idCliente,
          nombreCliente: ventaCargada.cliente,
          marca: productos[i].marca,
          codProd: productos[i]._id,
          producto: productos[i].descripcion,
          cantidad: productos[i].cantidad,
          iva: productos[i].impuesto,
          precio: productos[i].precio,
          nro_venta: ventaCargada.numero,
          tipo_comp: ventaCargada.tipo_comp,
          series: productos[i].series
            
        })

        await movimiento.save();
        movimientos.push(movimiento);

        // 6. Cargar series
        if(productos[i].series && productos[i].series.length > 0){
          if(Array.isArray(productos[i].series)){
            for(let s of productos[i].series){
              const serie = new NroSerie({
                fecha: ventaCargada.fecha,
                codigo: productos[i]._id,
                producto: productos[i].descripcion,
                nro_serie: s,
                factura: ventaCargada.tipo_comp,
                vendedor: ventaCargada.vendedor
              });
              await serie.save();
            }
          } else {
            const serie = new NroSerie({
              fecha: ventaCargada.fecha,
              codigo: productos[i]._id,
              producto: productos[i].descripcion,
              nro_serie: productos[i].series,
              factura: ventaCargada.tipo_comp,
              vendedor: ventaCargada.vendedor
            });
            await serie.save();
          }
        }
      };

      //7. Cargar Cuenta Corriente e Historica

      if(ventaCargada.tipo_venta === 'CC'){
        const cuentaCorr = new  CuentaCorriente({
          fecha: ventaCargada.fecha,
          idCliente: ventaCargada.idCliente,
          cliente: ventaCargada.cliente,
          nro_venta: ventaCargada.numero,
          tipo_comp: ventaCargada.tipo_comp,
          importe: ventaCargada.precio,
          pagado: 0,
          saldo: ventaCargada.precio,
          condicion: 'Normal',
          observaciones: '',
          nro_factura: ''
        });

        await  cuentaCorr.save();
        
        const cuentaHistorica = new  CuentaHistorica({
          fecha: ventaCargada.fecha,
          idCliente: ventaCargada.idCliente,
          cliente: ventaCargada.cliente,
          nro_venta: ventaCargada.numero,
          tipo_comp: ventaCargada.tipo_comp,
          debe: ventaCargada.precio,
          haber: 0,
          saldo: ventaCargada.precio,
          condicion: 'Normal',
          observaciones: '',
        });

        await  cuentaHistorica.save();


        const cliente = await Cliente.findByIdAndUpdate(ventaCargada.idCliente, {
          $inc: { saldo: ventaCargada.precio }
        });

        if(!cliente){
          return res.status(400).json({
            ok: false,
            msg: 'Error al actualizar el saldo del cliente, pero si se facturo, actualizo numero, cargo en cuenta corriente y se cargo la venta',
          });
        }
      };

      if(metodosPagos){
        await cargarMetodosPago(ventaCargada, metodosPagos);
      }

    // 8. Si viene remitos lo pasamos como pasado
    if(remitos){

      for(const remito of remitos){
        await Remito.findByIdAndUpdate(remito, {
          pasado: true
        });
      }
    }

      
    const ventaObj = ventaCargada.toObject();
    ventaObj.movimientos = movimientos;

      
    res.status(200).json({
      ok: true,
      venta: ventaObj,
      msg: 'Cargado completo'
    })
  }catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: 'Error al realizar la venta, hable con el administrador',
    });
  }
};

ventaCTRL.realizarNotaCredito = async(req, res) => {
  try {
    const { venta, productos, metodosPagos, descontarStock = 'true' } = req.body;


    //1. Facturar
      const afip = await cargarFactura(venta, true);
      if(afip.ok){
        venta.afip = afip;

        //Generar PDF
        funcion.crearPDF(venta, productos)
      }else{
        return res.status(400).json({
          ok: false,
          msg: 'No se pudo cargar la factura'
        })
      }
    

    //2. Actualizar Numero
    const numero = await actualizarNumero(venta.tipo_venta);
    if(!numero.ok){
      return res.status(400).json({
        ok: false,
        msg: 'Error al actualizar el numero, pero si se facturo'
      })
    };

    venta.numero = numero.numero;
    venta.precio = venta.precio * -1;

    //3. Cargar Venta
    const ventaCargada = new Venta(venta);
    await ventaCargada.save();

    if(!ventaCargada){
      return res.status(400).json({
        ok: false,
        msg: 'Error al cargar la venta, pero si se facturo y se actualizo el numero'
      });
    };

    let movimientos = [];
    for(let i = 0; i < productos.length; i++){


      if(!productos[i]._id && !productos[i].codigoAux) continue;

      //4. Descontar stock
      if(venta.tipo_venta !== 'PP' && descontarStock === 'true' && productos[i]._id){
        console.log("se desceunta Stock")
        const producto = await Producto.findByIdAndUpdate(
          productos[i]._id,
          {
            $inc: {stock: productos[i].cantidad}
          },
          { runValidators: true}
        )
        if(!producto){
          return res.status(400).json({
            ok: false,
            msg: 'Error al descontar el stock, pero si se facturo y se actualizo el numero'
          })
        };
        };

        // 5. Cargar Movimiento Producto
        const movimiento = new Movimiento({
          fecha: ventaCargada.fecha,
          tipo_venta: ventaCargada.tipo_venta,
          cliente: ventaCargada.idCliente,
          nombrecliente: ventaCargada.cliente,
          marca: productos[i].marca,
          codProd: productos[i]._id,
          producto: productos[i].descripcion,
          cantidad: productos[i].cantidad,
          iva: productos[i].impuesto,
          precio: productos[i].precio * -1,
          nro_venta: ventaCargada.numero,
          tipo_comp: ventaCargada.tipo_comp,
          series: productos[i].series
        });

        await movimiento.save();
        movimientos.push(movimiento);

        // 6. Cargar Series
        if(productos[i].series && productos[i].series.length > 0){
          if(Array.isArray(productos[i].series)){
            for(let s of productos[i].series){
              const serie = new NroSerie({
                fecha: ventaCargada.fecha,
                codigo: productos[i]._id,
                producto: productos[i].descripcion,
                nro_serie: s,
                factura: ventaCargada.tipo_comp,
                vendedor: ventaCargada.vendedor
              });
              await serie.save();
            }
          } else {
            const serie = new NroSerie({
              fecha: ventaCargada.fecha,
              codigo: productos[i]._id,
              producto: productos[i].descripcion,
              nro_serie: productos[i].series,
              factura: ventaCargada.tipo_comp,
              vendedor: ventaCargada.vendedor
            });
            await serie.save();
          }
        };
      
    };


    // 7. Cargar Cuenta Corriente e Historica
    if(ventaCargada.tipo_venta === 'CC'){
      const cuentaCorr = new CuentaCorriente({
        fecha: ventaCargada.fecha,
        idCliente: ventaCargada.idCliente,
        cliente: ventaCargada.cliente,
        nro_venta: ventaCargada.numero,
        tipo_comp: ventaCargada.tipo_comp,
        importe: ventaCargada.precio * -1,
        pagado: 0,
        saldo: ventaCargada.precio * -1,
        codicion: 'Normal',
        observaciones: '',
        nro_factura: ''
      });

      await cuentaCorr.save();

      const cuentaHistorica = new CuentaHistorica({
        fecha: ventaCargada.fecha,
        idCliente: ventaCargada.idCliente,
        cliente: ventaCargada.cliente,
        nro_venta: ventaCargada.numero,
        tipo_comp: ventaCargada.tipo_comp,
        debe: ventaCargada.precio * -1,
        haber: 0,
        saldo: ventaCargada.precio * -1,
        condicion: 'Normal',
        observaciones: ventaCargada.observaciones
      });

      await cuentaHistorica.save();

      const cliente = await Cliente.findByIdAndUpdate(ventaCargada.idCliente, {
        $inc: {saldo: -ventaCargada.precio}
      });

      if(!cliente){
        return res.status(400).json({
          ok: false,
          msg: 'Error al actualizar el saldo del cleinte, pero si se facuro, actulizo numero, cargo en cuenta corriente'
        });
      }
    };

    if(metodosPagos){
      await cargarMetodosPago(ventaCargada, metodosPagos);
    };

    const ventaObj = ventaCargada.toObject();
    ventaObj.movimientos = movimientos;

      
    res.status(200).json({
      ok: true,
      venta: ventaObj,
      msg: 'Cargado completo'
    })
  }catch(error){
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: 'Error al realizar la venta, hable con el administrador',
    });
  }
};

ventaCTRL.VentasDia = async (req, res) => {
  const { fecha } = req.params;
  try {
    const fechaBase = new Date(`${fecha}T00:00:00-03:00`);
    const inicioDia = new Date(fechaBase);
    const finDia = new Date(fechaBase);
    finDia.setHours(23, 59, 59, 999);

    const ventas = await Venta.find({
      $and: [{ fecha: { $gte: inicioDia } }, { fecha: { $lte: finDia } }],
    }).populate('vendedor', 'nombre');


    res.send(ventas);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: 'No se pudieron obtener las ventas, hable con el administrador',
    });
  }
};

ventaCTRL.ventasMes = async (req, res) => {
  try {
    const { fecha } = req.params;
    let mes = parseFloat(fecha);
    mes = mes > 12 ? 1 : mes;
    let hoy = new Date();
    let fechaConMes = new Date(`${hoy.getFullYear()}-${mes}-1`);
    let fechaConMesSig = new Date(`${mes === 12 ? hoy.getFullYear() + 1 : hoy.getFullYear()}-${mes === 12 ? 1 : mes + 1}-1`);

    const ventas = await Venta.find({
      $and: [{ fecha: { $gte: new Date(fechaConMes) } }, { fecha: { $lte: new Date(fechaConMesSig) } }],
    }).populate('vendedor', 'nombre');

    res.status(200).json({
      ok: true,
      ventas,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: 'No se pudieron obtener las ventas, hable con el administrador',
    });
  }
};

ventaCTRL.ventaAnio = async (req, res) => {
  const { fecha } = req.params;
  const hoy = new Date();
  const esteAnio = new Date(`${fecha}-1-1`);
  const anioSig = new Date(`${parseFloat(fecha) + 1}-1-1`);
  const ventas = await Venta.find({
    $and: [{ fecha: { $gte: esteAnio } }, { fecha: { $lte: anioSig } }],
  });
  res.send(ventas);
};

ventaCTRL.deleteForId = async (req, res) => {
  const { id } = req.params;
  try {
    const venta = await Venta.findByIdAndDelete(id);

    if (!venta)
      return res.status(404).json({
        ok: false,
        msg: 'Venta no encontrada',
      });

    const movCreado = await crearMovimientoVendedores(`Elimino la venta con numero ${venta.numero}`, req.query.vendedor);
    if (!movCreado)
      return res.status(500).json({
        ok: false,
        msg: 'No se pudo crear el movimiento de vendedor, Hable con el administrador',
      });

    res.status(200).json({
      ok: true,
      msg: `Venta ${venta.numero} eliminada`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: 'No se pudo eliminar la venta, hable con el administrador',
    });
  }
};

ventaCTRL.getForNumberAndType = async (req, res) => {
  const { numero, tipo } = req.params;
  const venta = await Venta.findOne({ numero: numero, tipo_venta: tipo });
  res.send(venta);
};

ventaCTRL.getbetweenDate = async (req, res) => {
  const { desde, hasta } = req.params;
  const aux = hasta.split('-', 3);
  let finDia = new Date(aux[0], aux[1] - 1, aux[2], 20, 59, 59, 0);
  const ventas = await Venta.find({
    $and: [{ fecha: { $gte: desde } }, { fecha: { $lte: finDia } }, { tipo_comp: { $ne: 'Comprobante' } }],
  });
  res.send(ventas);
};

ventaCTRL.getPorFactura = async (req, res) => {
  try {
    const { factura, tipo } = req.params;
    const venta = await Venta.findOne({
      $and: [{ 'afip.numero': parseInt(factura) }, { tipo_comp: tipo }],
    });

    if (!venta)
      return res.status(404).json({
        ok: false,
        msg: 'Factura no encontrada',
      });

    res.status(200).json({
      ok: true,
      venta,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: 'error al obtener la factura hable con el administrador',
    });
  }
};

ventaCTRL.ventasFacturadas = async(req, res) => {
  const { desde, hasta }= req.query;
  const desdeDate = new Date(`${desde}T00:00:00.000-03:00`);
  const hastaDate = new Date(`${hasta}T23:59:59.999-03:00`);
  try {
    const ventas = await Venta.find({
      $and: [{ fecha: { $gte: desdeDate } }, { fecha: { $lte: hastaDate } }, { F: true }, {tipo_comp: {$ne: "Contado"}}],
    }).populate('vendedor', 'nombre').sort({$natural: -1}).lean();
    if(!ventas){
      return res.status(404).json({
        ok: false,
        msg: 'No hsay ventas facturadas',
      });
    }

    const filtros = ventas.map(g => ({ nro_venta: g.numero.toString(), tipo_venta: g.tipo_venta }));
    const movimientos = await Movimiento.find({ $or: filtros }).lean();
    
    const ventasConMovimientos = ventas.map(venta => ({
        ...venta,
        movimientos: movimientos.filter(m =>
            m.nro_venta === venta.numero.toString() && m.tipo_venta === venta.tipo_venta
        )
    }));

    res.status(200).json({
      ok: true,
      ventas: ventasConMovimientos,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: 'No se pudo obtener las ventas facturadas, hable con el administrador',
    });
  }
}

ventaCTRL.recrearPdf = async (req, res) => {
  const { id } = req.params;
  
  try{
    const venta = await Venta.findById(id).populate('vendedor', 'nombre');
    if(!venta || !venta.afip.puntoVenta){
      return res.status(404).json({
        ok: false,
        msg: 'Venta no encontrada',
      });
    }

    const movs = await Movimiento.find({ $and: [{ nro_venta: venta.numero.toString() }, { tipo_venta: venta.tipo_venta }] }).lean();

    const productos = []

    for(const mov of movs){
      const prod = {};
      prod._id = mov.codProd;
      prod.descripcion = mov.producto;
      prod.cantidad = mov.cantidad;
      prod.precio = mov.precio;
      prod.impuesto = mov.iva;
      prod.productoOriginal = await Producto.findById(mov.codProd);
      productos.push(prod);
    } 
    
    

    await funcion.crearPDF(venta, productos);
    
    res.status(200).json({
      ok: true,
      msg: 'PDF recreado correctamente',
    });
  }catch(error){
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: 'No se pudo recrear el PDF, hable con el administrador',
    });
  }
  
}

module.exports = ventaCTRL;
