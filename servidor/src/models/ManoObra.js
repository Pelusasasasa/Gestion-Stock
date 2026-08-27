const { Schema, model } = require("mongoose");

const ManoObra = new Schema({
    cliente_id: {
        type: Number,
        ref:'Cliente',
        required: true
    },
    vendedor_id: {
        type: Schema.Types.ObjectId,
        ref: 'Vendedor',
        required: true
    },
    tipo: {
        type: String,
        required: true
    },
    segmento_id: {
        type: Number,
        required: true
    },
    fecha: {
        type: Date,
        required: true
    },
    horas: {
        type: Number,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    estado: {
        type: String,
        required: true,
        default: "PENDIENTE"
    },
    remito_id: {
        type: Number,
    },
    created: {
        type: Date,
        required: true
    },
    activo: {
        type: Boolean,
        required: true
    },
    numero: {
        type: Number,
        required: true
    },
    operarios: [{
        type: Schema.Types.ObjectId,
        ref: 'Vendedor'
    }]
})

module.exports = model('ManoObra', ManoObra)