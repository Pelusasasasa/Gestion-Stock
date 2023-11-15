const mongoose = require('mongoose');

const Venta = new mongoose.Schema({
    fecha:{
        type:Date,
        default: Date.now
    },
    cliente:{
        type:String,
        required:[true,"Cliente es Obligatorio en Venta"]
    },
    idCliente:{
        type:String,
        required:[true,"IdCliente es Obligatorio en Venta"]
    },
    numero:{
        type:Number,
        required:[true,"Numero de vneta Obligatorio en Venta"]
    },
    listaProductos:{
        type:[],
        required:true
    },
    precio:{
        type:Number,
        required:[true,"Precio es Obligatorio en Venta"]
    },
    descuento:{
        type:Number,
        default: 0
    },
    tipo_venta:{
        type: String,
        default: "CD"  
    },
    tipo_comp:{
        type:String,
        required: [true,"Tipo Comprobante es Obligatorio"]
    },
    F:{
        type:Boolean,
        default: false
    },
    caja:{
        type:String,
        default: ""
    },
    condicionIva:{
        type:String,
        default:"Consumidor Final"
    },
    afip:{
        type:Object,
        default:{}
    },

    //Para la afip
    num_doc:{
        type:String,
        default:""
    },
    cod_comp:{
        type:Number,
        default:0
    },
    cod_doc:{
        type:Number,
        default:0
    },
    condicionIva:{
        type:String,
        default:"Consumidor Final"
    },
    iva21:{
        type:Number,
        default:0
    },
    iva105:{
        type:Number,
        default:0
    },
    gravado21:{
        type:Number,
        default:0
    },
    gravado105:{
        type:Number,
        default:0
    },
    gravado0:{
        type:Number,
        default:0
    },
    iva0:{
        type:Number,
        default:0
    },
    cantIva:{
        type:Number,
        default:0
    }

});

module.exports = mongoose.model('Venta',Venta);