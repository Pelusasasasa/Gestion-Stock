const { Schema, model } = require("mongoose")

const MovCaja = new Schema({
    fecha: {
        type: Date,
        required: true,
    },
    descripcion: {
        type: String,
        trim: true,
        default: '',
        set: value => value.toUpperCase(),
    },
    puntoVenta: {
        type: String,
        default: '0000',
        trim: true,
        set: value => value.padStart(4, '0')
    },
    numero: {
        type: String,
        default: '00000000',
        trim: true,
        set: value => value.padStart(8, '0')
    },

    tipo: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'TipoCuenta'
    },
    importe: {
        type: Number,
        required: true,
    },
    vendedor: {
        type: Schema.Types.ObjectId,
        // required: true,
        ref: 'Vendedor'
    }
}
);

module.exports = model('MovCaja', MovCaja);