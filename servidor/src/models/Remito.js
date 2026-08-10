const {Schema, model, Types} = require('mongoose');

const Remito = new Schema({

    fecha:{
        type: Date,
        default: Date.now
    },
    cliente:{
        type: String,
        required: true,
        set: value => value.toUpperCase().trim()
    },
    idCliente: {
        type: String,
        required: true,
        set: value => value.trim()
    },
    tipo_venta:{
        type: String,
        default: 'RT',
        set: value => value.toUpperCase().trim()
    },
    tipo_comp:{
        type: String,
        default: 'REMITO',
        set: value => value.toUpperCase().trim()
    },
    numero: {
        type: Number,
        unique: true,
        required: true
    },
    observaciones: {
        type: String,
        set: value => value.toUpperCase().trim(),
        default: ""
    },
    caja:{
        type: String,
        default: '',
        set: value => value.toUpperCase().trim()
    },
    vendedor: {
        type: Types.ObjectId,
        ref: 'Vendedor',
        required: true
    },
    pasado: {
        type: Boolean,
        default: false
    },
    activo: {
        type: Boolean,
        default: true
    }

});

module.exports = model('Remito', Remito);