const { Schema, model } = require("mongoose");

const Valor = new Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        set: value => value?.toUpperCase(),
    },
    importe: {
        type: Number,
        default: 0
    },
    icon: {
        type: { String },
        default: 'icon'
    },
    vendedor: {
        type: String,
        required: true,
        set: value => value?.toUpperCase(),
    },
    pc: {
        type: String,
        default: ''
    }
}, {
    timestamps: true,
});


module.exports = model('Valor', Valor);