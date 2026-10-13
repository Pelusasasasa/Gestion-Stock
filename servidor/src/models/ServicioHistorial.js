const { Schema, model } = require("mongoose");

const ServicioHistorial = new Schema({
    numero: {
        type: Number,
        required: true
    },
    equipo: {
        type: String,
        required: true
    },
    estado: {
        type: String,
        required: true,
        trim: true
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    estadoAnterior: {
        type: String,
        default: '',
        trim: true
    },
    observaciones: {
        type: String,
        trim: true
    },
    vendedor: {
        type: Schema.Types.ObjectId,
        required: true
    }
});


module.exports = model('ServicioHistorial', ServicioHistorial);