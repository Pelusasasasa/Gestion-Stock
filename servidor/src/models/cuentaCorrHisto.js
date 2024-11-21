const mongoose = require('mongoose');

const Historica = new mongoose.Schema({
    _id:{
        type: Number,
        required:true
    },
    idCliente:{
        type:String,
        required:true
    },
    cliente:{
        type:String,
        required: true
    },
    nro_venta:{
        type:Number,
        required:true,
    },
    tipo_comp:{
        type:String,
        require:true,
    },
    condicion:{
        type:String,
        default:"Normal"
    },
    debe:{
        type:Number,
        default: 0
    },
    haber:{
        type:Number,
        default: 0
    },
    saldo:{
        type:Number,
        required:true
    },
    fecha:{
        type:Date,
        default: Date.now
    },
    observaciones:{
        type:String,
        default:"",
        set: (value) => value.toUpperCase()
        
    }
});

module.exports = mongoose.model("Historica",Historica);