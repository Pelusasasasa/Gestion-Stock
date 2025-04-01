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
        required: true
    },
    tipo: {
        type: String,
        default: ''
    },
    vendedor: {
        type: String,
        required: true
    },
    pc: {
        type: String,
        default: ''
    }
});

module.exports = model('Tarjeta', Tarjeta);