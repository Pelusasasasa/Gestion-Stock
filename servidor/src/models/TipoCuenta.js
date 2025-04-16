const { Schema, model } = require("mongoose");

const TipoCuenta = new Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        set: value => value.toUpperCase()
    },
    tipo: {
        type: String,
        enum: ['E', 'I'],
        trim: true,
        required: true
    }
});


module.exports = model('TipoCuenta', TipoCuenta);