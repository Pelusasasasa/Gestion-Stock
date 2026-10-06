const { Schema, model } = require("mongoose");

const EquipoServicio = new Schema({
    numero: {
        type: Number,
        required: true
    },
    equipo: {
        type: String,
        required: true,
        trim: true
    },
    marca: {
        type: Schema.Types.ObjectId,
        ref: "Marca",
        default: null
    },
    serie: {
        type: String,
        default: ''
    },
    estado: {
        type: String,
        default: 'Pendiente'
    },
    observaciones: {
        type: String,
        default: ''
    }
});

module.exports = model('EquipoServicio', EquipoServicio);