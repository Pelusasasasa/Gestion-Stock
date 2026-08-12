const reciboCTRL = {};

const { actualizarCompensadas } = require('../helpers/actualizarCompensadas');
const { actualizarNumero } = require('../helpers/actualizarNumero');
const { cambiarSaldoCliente } = require('../helpers/cambiarSaldoCliente');
const { cargarMovsRecibos } = require('../helpers/cargarMovsRecibos');
const { crearHistorica } = require('../helpers/crearHistorica');
const Cheque = require('../models/Cheque');
const Recibo = require('../models/Recibo');
const Retencion = require('../models/Retencion');
const Tarjeta = require('../models/Tarjeta');
const MetodoPago = require('../models/MetodoPago');
const Compensada = require('../models/cuentaCorrComp')
const Historica = require("../models/cuentaCorrHisto");

reciboCTRL.cargarRecibo = async (req, res) => {
  try {
    const nuevoRecibo = new Recibo(req.body);

    const numeroActualizado = await actualizarNumero(nuevoRecibo.tipo_venta);
    if (numeroActualizado.ok) {
      nuevoRecibo.numero = numeroActualizado.numero;
    } else {
      return res.status(400).json({
        ok: false,
        msg: 'Error al actualizar el numero del recibo',
      });
    }

    const saldoModificado = await cambiarSaldoCliente(nuevoRecibo.idCliente, nuevoRecibo.precio, true);
    if (!saldoModificado.ok) {
      return res.status(400).json({
        ok: false,
        msg: 'Error al modificar el saldo del cliente',
      });
    }
    const historica = await crearHistorica(nuevoRecibo);
    if (!historica) {
      return res.status(400).json({
        ok: false,
        msg: 'Error al crear la historica',
      });
    }

    const compensadasModificadas = await actualizarCompensadas(req.body.compensadas, nuevoRecibo);

    if (!compensadasModificadas.ok)
      return res.status(400).json({
        ok: false,
        msg: 'Error al modificar las compensadas',
      });

    const movsRecibos = await cargarMovsRecibos(compensadasModificadas.compensadas, numeroActualizado.numero);
    if (!movsRecibos.ok)
      return res.status(400).json({
        ok: false,
        msg: 'Error al cargar los movimientos de los recibos',
      });
    await nuevoRecibo.save();
    res.status(201).json({
      ok: true,
      recibo: nuevoRecibo,
      movsRecibos: movsRecibos.movs,
      cliente: saldoModificado.cliente,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: 'No se pudo realizar el recibo, hable con el administrador',
    });
  }
};

reciboCTRL.realizarRecibo = async (req, res) => {
  try {
    const { fecha, cliente, idCliente, precio, tipo_comp, tipo_venta, valorRecibido = 'EFECTIVO', vendedor  } = req.body;
    const { retenciones, metodoPagos, compensadas} = req.query;

    // 1. Actualizamos el numero
    const numero = await actualizarNumero(tipo_venta);
    if (!numero.ok) {
      return res.status(400).json({
        ok: false,
        msg: 'Error al actualizar el numero del recibo',
      });
    }    
    req.body.numero = numero.numero;

    // 2. Cargamos el Recibo
    const recibo = new Recibo({
      fecha, cliente, idCliente, precio, tipo_comp, tipo_venta, 
      valorRecibido, numero: req.body.numero, vendedor
    });

    await recibo.save();

    //3. Cargamos la retencion si existe
    if(retenciones){
      for(let i = 0; i < retenciones.length; i++){
        const retencionAux = retenciones[i];
        retencionAux.fecha = recibo.fecha;
        retencionAux.reciboId = recibo._id;
        retencionAux.nro_comp = recibo.numero;
        const retencion = new Retencion(retencionAux);
        await retencion.save();
      }
    }

    // 4. Cargamos los metodos de pago
    
    if(metodoPagos){
      for(let i = 0; i < metodoPagos.length; i++){
        const metodoPagoAux = metodoPagos[i];
        metodoPagoAux.fecha = recibo.fecha;
        metodoPagoAux.comprobanteId = recibo._id;
        metodoPagoAux.tipoComprobante = recibo.tipo_comp;
        metodoPagoAux.nro_comp = recibo.numero;
        
        const metodoPago = new MetodoPago(metodoPagoAux);
        await metodoPago.save();

        if(metodoPago.tipo === 'tarjeta'){
          
          const tarjeta = new Tarjeta({
            fecha: recibo.fecha,
            nombre: metodoPagoAux.cliente,
            importe: metodoPago.monto,
            tarjeta: metodoPagoAux.tarjeta,
            tipo: metodoPago.tipoComprobante,
            vendedor: vendedor,
            comprobanteId: recibo._id,
            tipoComprobante: recibo.tipo_comp
          })
          await tarjeta.save();
        }

        if(metodoPago.tipo === 'cheque'){
          const cheque = new Cheque({
            f_recibido: recibo.fecha,
            numero: metodoPagoAux.numero,
            banco: metodoPagoAux.banco,
            f_cheque: metodoPagoAux.fechaVencimiento,
            importe: metodoPagoAux.monto,
            ent_por: recibo.cliente,
            ent_a: '',
            domicilio: metodoPagoAux.domicilio,
            telefono: metodoPagoAux.telefono,
            vendedor: vendedor,
            tipo: metodoPagoAux.tipoComprobante,
            comprobanteId: recibo._id,
            tipoComprobante: recibo.tipo_comp,
            observacion: ''
          })

          await cheque.save();
        }
      }
    }

    // 5. Modificamos las compensadas
    for(let i = 0; i < compensadas.length; i++){
      const item = compensadas[i];
      if (item.importe < 0 || item.tipo_comp === 'NC' || typeof item._id === 'string' && item._id.startsWith('saldo_favor_')) {
        const nuevaCompensadaAkit = new Compensada({
          fecha: recibo.fecha,
          idCliente: recibo.idCliente,
          cliente: recibo.cliente,
          tipo_comp: item.tipo_comp || 'NC',
          nro_venta: recibo.numero,
          importe: item.importe,
          pagado: 0,
          saldo: item.saldo,
          comprobanteId: recibo._id
        });
        console.log('NUEVA COMPENSADA AGREGADA A LA BASE DE DATOS', nuevaCompensadaAkit)
        await nuevaCompensadaAkit.save();
        compensadas[i] = nuevaCompensadaAkit;
      } else {
        await Compensada.findByIdAndUpdate(item._id, {
          pagado: item.pagado,
          saldo: item.saldo,
        });
      }
    }

    // 6. Actualizamos el saldo del cliente
    const saldoModificado = await cambiarSaldoCliente(recibo.idCliente, recibo.precio, true);
    if (!saldoModificado.ok) {
      return res.status(400).json({
        ok: false,
        msg: 'Error al modificar el saldo del cliente',
      });
    }

    // 7. Creamos la historica
      const historica = new Historica({
        fecha: recibo.fecha,
        cliente: recibo.cliente,
        idCliente: recibo.idCliente,
        nro_venta: recibo.numero,
        tipo_comp: recibo.tipo_comp,
        debe: 0,
        haber: recibo.precio,
        saldo: saldoModificado.cliente.saldo,
        condicion: recibo.valorRecibido,
        observaciones: '',
      });
      await historica.save();

      // 8.Cargamos mov Recibos
      const movsRecibos = await cargarMovsRecibos(compensadas, numero.numero);
      if (!movsRecibos.ok) {
        return res.status(400).json({
          ok: false,
          msg: 'Error al cargar los movimientos de los recibos',
        });
      }
      
      ;
      return res.status(201).json({
        ok: true,
        recibo,
        saldoModificado: saldoModificado.cliente,
        historica,
        movsRecibos
      })
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: 'No se pudo realizar el recibo, hable con el administrador',
    });
  }
}

reciboCTRL.recibosDia = async (req, res) => {
  const { fecha } = req.params;
  const fechaBase = new Date(`${fecha}T00:00:00-03:00`);
  const inicioDia = new Date(fechaBase);
  const finDia = new Date(fechaBase);
  finDia.setHours(23, 59, 59, 999);

  const recibos = await Recibo.find({
    $and: [{ fecha: { $gte: inicioDia } }, { fecha: { $lte: finDia } }],
  });
  res.send(recibos);
};

reciboCTRL.recibosMes = async (req, res) => {
  const { fecha } = req.params;
  let mes = parseFloat(fecha);
  let hoy = new Date();
  mes = mes > 12 ? 1 : mes;

  let fechaConMes = new Date(`${hoy.getFullYear()}-${mes}-1`);
  let fechaConMesSig = new Date(`${mes === 12 ? hoy.getFullYear() + 1 : hoy.getFullYear()}-${mes === 12 ? 1 : mes + 1}-1`);
  const recibos = await Recibo.find({
    $and: [{ fecha: { $gte: fechaConMes } }, { fecha: { $lte: fechaConMesSig } }],
  });
  res.send(recibos);
};

reciboCTRL.recibosAnio = async (req, res) => {
  const { fecha } = req.params;
  const hoy = new Date();
  const esteAnio = new Date(`${fecha}-1-1`);
  const anioSig = new Date(`${parseFloat(fecha) + 1}-1-1`);
  const recibos = await Recibo.find({
    $and: [{ fecha: { $gte: esteAnio } }, { fecha: { $lte: anioSig } }],
  });
  res.send(recibos);
};

reciboCTRL.getForNumber = async (req, res) => {
  const { number } = req.params;
  let retorno = {};

  const recibo = await Recibo.findOne({ numero: number });

  // Buscar retención asociada, si existe
  let retencion = await Retencion.find({ reciboId: recibo?._id });

  let cheques = await Cheque.find({ comprobanteId: recibo?.id });
  let tarjetas = await Tarjeta.find({ comprobanteId: recibo?.id }).populate('tarjeta', { nombre: 1 });

  // Armar respuesta combinada con la info del recibo y la retención (si hay)
  retorno = {
    ...recibo?._doc,
    ...(cheques && cheques.length > 0 ? { cheques } : {}),
    ...(tarjetas && tarjetas.length > 0 ? { tarjetas } : {}),
    ...(retencion ? { retencion } : {}),
  };

  res.send(retorno);
};

reciboCTRL.putRecibo = async (req, res) => {
  const { number } = req.params;
  const recibo = req.body;
  const reciboActualizado = await Recibo.findByIdAndUpdate(number, recibo, { new: true });
  res.status(200).json({
    ok: true,
    recibo: reciboActualizado,
  });
};

module.exports = reciboCTRL;
