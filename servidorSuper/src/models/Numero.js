const mongoose = require('mongoose');

const Numero = new mongoose.Schema({
    "Cuenta Corriente":Number,
    "Contado":Number,
    "Recibo":Number,
    "Remito":Number,
    "Dolar":Number
});


module.exports = mongoose.model('Numero',Numero)