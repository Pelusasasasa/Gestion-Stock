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
        default: Date.now()
    }
});


module.exports = model('ServicioHistorial', ServicioHistorial);