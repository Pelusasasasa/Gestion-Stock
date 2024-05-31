const mongoose = require('mongoose');

const Producto = new mongoose.Schema({
    _id:{
        type: String,
        required:true,
        set: (value) => value.trim()
    },
    codigoManual:{
        type: Boolean,
        default: false
    },
    costo:{
        type: Number,
        required: true
    },
    costoDolar:{
        type: Number,
        required: true
    },
    descripcion:{
        type: String,
        required:true
    },
    descuento1:{
        type: Number,
        default: 0
    },
    descuento2:{
        type: Number,
        default: 0
    },
    descuento3:{
        type: Number,
        default: 0
    },
    ganancia:{
        type: Number,
        required:true
    },
    impuesto:{
        type:Number,
        default: 0
    },
    marca:{
        type: String,
    },
    oferta:{
        type:Boolean,
        default:false
    },
    provedor:{
        type:String,
        default:""
    },
    precioOferta:{
        type:Number,
        default:0
    },
    precio:{
        type:Number,
        required:true
    },
    rubro:{
        type:String,
        default:""
    },
    stock:{
        type: Number,
        required: true
    },
});

module.exports = mongoose.model('Producto',Producto);