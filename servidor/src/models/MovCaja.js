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
        required: true,
        ref: 'Vendedor'
    }
}
);

module.exports = model('MovCaja', MovCaja);