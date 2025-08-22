const { Schema, model } = require("mongoose");

const EquipoServicio = new Schema({
    numero: {
        type: Number,
        required: true
    },
    equipo: {
        type: String,
        required: true,
    },
    modelo: {
        type: String,
        default: ''
    },
    serie: {
        type: String,
        default: ''
    },
});

module.exports = model('EquipoServicio', EquipoServicio);