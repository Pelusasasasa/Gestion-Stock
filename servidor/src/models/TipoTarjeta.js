const { Schema, model } = require('mongoose');

const TipoTarjeta = new Schema({

    nombre: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        set: value => value.toUpperCase()
    }

});


module.exports = model('TipoTarjeta', TipoTarjeta);