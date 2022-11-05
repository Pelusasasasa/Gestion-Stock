const mongoose = require('mongoose');

const Venta = new mongoose.Schema({
    fecha:{
        type:Date,
        default: Date.now
    }
    ,
    cliente:{
        type:String,
        default:"Consumidor Final"
    },
    idCliente:{
        type:String,
        default: "0"
    },
    numero:{
        type:Number,
        required:true
    },
    listaProductos:{
        type:[],
        required:true
    },
    precio:{
        type:Number,
        required:true
    },
    descuento:{
        type:Number,
        default: 0
    },
    tipo_venta:{
        type: String,
        default: "CC"  
    },
    tipo_comp:{
        type:String,
        default:""
    },
    F:{
        type:Boolean,
        default: false
    },
    num_doc:{
        type:String,
        default:""
    },
    condicionIva:{
        type:String,
        default:"Consumidor Final"
    },
    afip:{
        type:Object,
        default:{}
    },
    caja:{
        type:String,
        default:""
    },
    vendedor:{
        type:String,
        default:""
    }
});

module.exports = mongoose.model('Venta',Venta);