const mongoose = require('mongoose');

const Cuenta = new mongoose.Schema({
    cuenta: {
        type: String,
        required: true,
        unique: true
    },
    idCuenta: {
        type: String,
        required: true,
        unique: true
    },
    tipo: {
        type: String,
        required: true
    }
},{
    timestamps: true
});


module.exports = mongoose.model('Cuenta', Cuenta);