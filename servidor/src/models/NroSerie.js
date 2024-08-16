const { Schema, model } = require("mongoose");

const NroSerie = new Schema({

    fecha:{
        type: Date,
        default: Date.now
    },
    codigo:{
        type: String,
        required: true
    },
    producto:{
        type: String,
        required: true,
        set: value => value.toUpperCase() // Convertir a mayúsculas
    },
    marca:{
        type:String,
        required: true,
        set: value => value.toUpperCase() // Convertir a mayúsculas
    },
    nro_serie:{
        type: String,
        required: true
    },
    provedor:{
        type: String,
        required: true,
        set: value => value.toUpperCase() // Convertir a mayúsculas
    }
});

module.exports = model('NroSerie', NroSerie);