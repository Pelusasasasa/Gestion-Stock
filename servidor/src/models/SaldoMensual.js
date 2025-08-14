const {Schema, model} = require('mongoose');


const SaldoMensual = new Schema({

    mes: {
        type: String,
        required: true,
        unique: true
    },
    saldo: {
        type: String,
        required: true
    }
});


module.exports = model('SaldoMensual', SaldoMensual);