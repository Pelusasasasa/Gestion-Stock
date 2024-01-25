const mongoose = require('mongoose');

const Producto = new mongoose.Schema({
    _id:{
        type: String,
        required:true
    },
    codigoManual:{
        type: Boolean,
        default: false
    },
    descripcion:{
        type: String,
        required:true
    },
    marca:{
        type: String,
    },
    rubro:{
        type:String,
        default:""
    },
    provedor:{
        type:String,
        default:""
    },
    stock:{
        type: Number,
        required: true
    },
    costo:{
        type: Number,
        required: true
    },
    costoDolar:{
        type: Number,
        required: true
    },
    impuesto:{
        type:Number,
        default: 0
    },
    ganancia:{
        type: Number,
        required:true
    },
    precio:{
        type:Number,
        required:true
    },
    oferta:{
        type:Boolean,
        default:false
    },
    precioOferta:{
        type:Number,
        default:0
    },
    precioTarjeta:{
        type:Number,
        default:0
    }


});

module.exports = mongoose.model('Producto',Producto);