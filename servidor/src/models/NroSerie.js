const { Schema, model, Types } = require("mongoose");

const NroSerie = new Schema({

    fecha:{
        type: Date,
        default: Date.now
    },
    codigo:{
        type: String,
        required: true
    },
    producto:{
        type: String,
        required: true,
        set: value => value.toUpperCase() // Convertir a mayúsculas
    },
    nro_serie:{
        type: String
    },
    factura: {
        type: String,
        default: "",
        set: value => value.toUpperCase() // Convertir a mayúsculas
    },
    provedor: {
        type: Schema.Types.ObjectId,
        ref: 'Provedor'
    },
    comprobanteId: {
            type: Types.ObjectId,
            refPath: 'tipoComprobante'
        },
    tipoComprobante: {
        type: String,
        default: 'Contado'
    },
    vendedor:{
        type: Schema.Types.ObjectId,
        ref: 'Vendedor',
        required: true,
    }
});

module.exports = model('NroSerie', NroSerie);