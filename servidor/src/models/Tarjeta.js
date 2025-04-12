const { Schema, model } = require('mongoose');


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
        type: String,
        required: true,
        set: value => value.toUpperCase()
    },
    pc: {
        type: String,
        default: ''
    }
});

module.exports = model('Tarjeta', Tarjeta);