const { Schema, model } = require('mongoose');

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
        required: true
    },
    f_cheque:{
        type: Date,
        default: Date.now
    },
    importe: {
        type: Number,
        default: 0
    },
    ent_por: {
        type: String,
        default: ""
    },
    ent_a: {
        type: String,
        default: ""
    },
    domicilio: {
        type: String,
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
        type: String,
        trim: true,
        default: ""
    },
    pc: {
        type: String,
        trim: true,
        default: ""
    }
});

module.exports = model('Cheque', Cheque);