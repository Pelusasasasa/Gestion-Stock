const mongoose = require('mongoose');

const Numero = new mongoose.Schema({
    "Cuenta Corriente":Number,
    "Contado":Number,
    "Recibo":Number
});


module.exports = mongoose.model('Numero',Numero)