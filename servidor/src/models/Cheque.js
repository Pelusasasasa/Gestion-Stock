const { Schema, model, Types } = require('mongoose');

const Cheque = new Schema({
    f_recibido: {
        type: Date,
        default: Date.now
    },
    numero: {
        type: String,
        required: true,
        trim: true
    },
    banco: {
        type: String,
        required: true,
        set: value => value.toUpperCase(),
        trim: true
    },
    f_cheque: {
        type: Date,
        default: Date.now
    },
    importe: {
        type: Number,
        default: 0
    },
    ent_por: {
        type: String,
        set: value => value.toUpperCase(),
        trim: true,
        default: ""
    },
    ent_a: {
        type: String,
        set: value => value.toUpperCase(),
        trim: true,
        default: ""
    },
    domicilio: {
        type: String,
        set: value => value.toUpperCase(),
        trim: true,
        default: ""
    },
    telefono: {
        type: String,
        default: ""
    },
    tipo: {
        type: String,
        default: ""
    },
    fechaPago: {
        type: String,
    },
    vendedor: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    observacion: {
        type: String,
        trim: true,
        default: ''
    },
    comprobanteId: {
            type: Types.ObjectId,
            required: true,
            refPath: 'tipoComprobante'
        },
    tipoComprobante: {
        type: String,
        required: true,
        enum: ['Recibo', 'Presupuesto', 'Venta'],
        default: 'Recibo'
    }
});

module.exports = model('Cheque', Cheque);