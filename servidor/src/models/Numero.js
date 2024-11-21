const mongoose = require('mongoose');

const Numero = new mongoose.Schema({
    "Cuenta Corriente":Number,
    "Contado":Number,
    "Recibo":Number,
    "Presupuesto":Number,
    "Remito":{
        type: Number,
        default: 0
    },
    "Dolar":Number,
    "Servicio": {
        type:Number,
        default:0
    }
});


module.exports = mongoose.model('Numero',Numero)