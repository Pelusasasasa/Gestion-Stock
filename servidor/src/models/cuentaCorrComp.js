const mongoose = require('mongoose');

const CuentaCompensada = new mongoose.Schema({
    _id:{
        type:Number,
        required:true
    },
    idCliente:{
        type:String,
        required:true
    },
    cliente:{
        type:String,
        required:true
    },
    nro_venta:{
        type:Number,
        required:true
    },
    tipo_comp:{
        type:String,
        require:true,
    },
    importe:{
        type:Number,
        required:true
    },
    pagado:{
        type:Number,
        default:0
    },
    fecha:{
        type:Date,
        default: Date.now
    },
    saldo:{
        type: Number,
        required: true
    },
});

module.exports = mongoose.model("CuentaCompensada",CuentaCompensada);