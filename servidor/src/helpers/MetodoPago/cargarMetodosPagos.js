const Cheque = require('../../models/Cheque');
const Tarjeta = require('../../models/Tarjeta');
const MetodoPago = require('../../models/MetodoPago');

exports.cargarMetodosPago = async (comprobante, metodoPagos) => {
    for(let i = 0; i < metodoPagos.length; i++){
        const metodoPagoAux = metodoPagos[i];
        metodoPagoAux.fecha = comprobante.fecha;
        metodoPagoAux.comprobanteId = comprobante._id;
        metodoPagoAux.tipoComprobante = comprobante.tipo_comp;
        metodoPagoAux.nro_comp = comprobante.numero;
        
        const metodoPago = new MetodoPago(metodoPagoAux);
        await metodoPago.save();

        if(metodoPago.tipo === 'tarjeta'){
          
          const tarjeta = new Tarjeta({
            fecha: comprobante.fecha,
            nombre: metodoPagoAux.cliente,
            importe: metodoPago.monto,
            tarjeta: metodoPagoAux.tarjeta,
            tipo: metodoPago.tipoComprobante,
            vendedor: vendedor,
            comprobanteId: comprobante._id,
            tipoComprobante: comprobante.tipo_comp
          })
          await tarjeta.save();
        }

        if(metodoPago.tipo === 'cheque'){
          const cheque = new Cheque({
            f_recibido: comprobante.fecha,
            numero: metodoPagoAux.numero,
            banco: metodoPagoAux.banco,
            f_cheque: metodoPagoAux.fechaVencimiento,
            importe: metodoPagoAux.monto,
            ent_por: comprobante.cliente,
            ent_a: '',
            domicilio: metodoPagoAux.domicilio,
            telefono: metodoPagoAux.telefono,
            vendedor: vendedor,
            tipo: metodoPagoAux.tipoComprobante,
            comprobanteId: comprobante._id,
            tipoComprobante: comprobante.tipo_comp,
            observacion: ''
          })

          await cheque.save();
        }
};
}