const { Schema, model, Types } = require('mongoose');


const Tarjeta = new Schema({
    fecha: {
        type: Date,
        default: new Date()
    },
    nombre: {
        type: String,
        default: '',
        trim: true,
        set: value => value.toUpperCase()
    },
    importe: {
        type: Number,
        required: true,
    },
    tarjeta: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'TipoTarjeta'
    },
    tipo: {
        type: String,
        default: '',
        set: value => value.toUpperCase()
    },
    vendedor: {
        type: Schema.Types.ObjectId,
        ref: 'Vendedor'
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

module.exports = model('Tarjeta', Tarjeta);