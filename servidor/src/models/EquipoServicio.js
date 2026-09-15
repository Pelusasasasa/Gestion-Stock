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
        default: ""
    },
    serie: {
        type: String,
        default: ''
    },
    estado: {
        type: String,
        default: 'Pendiente'
    }
});

module.exports = model('EquipoServicio', EquipoServicio);