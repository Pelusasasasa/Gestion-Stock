const mongoose = require('mongoose');

const Historica = new mongoose.Schema({
    idCliente:{
        type:String,
        required:[true,"El id de Cliente es Obligatorio"]
    },
    cliente:{
        type:String,
        required: [true,"El cliente es Obligatorio"],
        set:(value) => value.toUpperCase()
    },
    nro_venta:{
        type:Number,
        required:[true,"El numero de comprobante es Obligatorio"],
    },
    tipo_comp:{
        type:String,
        require:[true,"El tipo de comprobante es Obligatorio"],
    },
    debe:{
        type:Number,
        required:[true,"Atributo debe es obligatorio"]
    },
    haber:{
        type:Number,
        required:[true,"Atributo haber es obligatorio"]
    },
    saldo:{
        type:Number,
        required:[true,"Atributo saldo es obligatorio"]
    },
    fecha:{
        type:Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Historica",Historica);