const mongoose = require('mongoose');

const movProducto = new mongoose.Schema({
    fecha:{
        type:Date,
        default: Date.now
    },
    tipo_venta:{
        type:"String"
    },
    cliente:{
        type:String,
        default:""
    },
    nombreCliente: {
        type: String,
        default: ''
    },
    marca:{
        type:String,
        default:""
    },
    codProd:{
        type:String,
        default:""
    },
    producto:{
        type:String
    },
    cantidad:{
        type:Number,
        required:true
    },
    iva:{
        type:Number,
        required:true
    },
    precio:{
        type:Number,
        required:true
    },
    nro_venta:{
        type:String,
        required:true
    },
    tipo_comp:{
        type:String,
        default:"Comprobante"
    },
    series:{
        type:Array,
        default:[]
    },
    // false cuando el comprobante no toco el stock (ej: venta que viene de remitos ya descontados)
    descuentaStock:{
        type:Boolean,
        default:true
    },
    cantidadDescontada: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('MovProducto',movProducto);