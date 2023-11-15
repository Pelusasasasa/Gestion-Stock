const mongoose = require('mongoose');

const Recibo = new mongoose.Schema({
    fecha:{
        type:Date,
        default: Date.now
    },
    cliente:{
        type:String,
        required:[true,"Cliente obligatorio en el Recibo"]
    },
    idCliente:{
        type:String,
        required:[true,"idCliente obligatorio en el Recibo"]
    },
    numero:{
        type:Number,
        required:[true,"numero obligatorio en el Recibo"]
    },
    precio:{
        type: Number,
        required:[true,"Precio obligatorio en el Recibo"]
    },
    descuento:{
        type:Number,
        default:0
    },
    tipo_comp:{
        type:String,
        required:[true,"Tipo Comprobante es Obligatorio"]
    },
    tipo_venta:{
        type:String,
            required:[true,"Tipo Venta es Obligatorio"]
    },
    vendedor:{
        type:String,
        default:""
    },
    caja:{
        type:String,
        default:""
    }
});

module.exports = mongoose.model("Recibo",Recibo);