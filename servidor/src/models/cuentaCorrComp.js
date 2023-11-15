const mongoose = require('mongoose');

const CuentaCompensada = new mongoose.Schema({
    fecha:{
        type:Date,
        default: Date.now
    },
    idCliente:{
        type:String,
        required:[true,"El IdCliente es obligatorio en Compensada"]
    },
    cliente:{
        type:String,
        required:[true,'El Cliente es obligatorio en Compensada']
    },
    nro_venta:{
        type:Number,
        required:[true,'El nro_venta es obligatorio en Compensada']
    },
    tipo_comp:{
        type:String,
        require:[true,'El tipo de Comprobante es obligatorio en Compensada'],
    },
    importe:{
        type:Number,
        required:[true,'El importe es obligatorio en Compensada']
    },
    pagado:{
        type:Number,
        default:0
    },
    saldo:{
        type: Number,
        required: [true,'El saldo es obligatorio en Compensada']
    },
});

module.exports = mongoose.model("CuentaCompensada",CuentaCompensada);