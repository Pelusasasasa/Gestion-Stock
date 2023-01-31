const {Schema,model}= require('mongoose');

const Presupuesto = new Schema({
    fecha:{
        type:Date,
        default:Date.now
    },
    cliente:{
        type: String,
        default:"Consumidor Final"
    },
    idCliente:{
        type:String,
        default:"0"
    },
    precio:{
        type:Number,
        required:true
    },
    descuento:{
        type:Number,
        default:0
    },
    tipo_venta:{
        type:String,
        required:true
    },
    tipo_comp:{
        type:String,
        default:"Presupuesto"
    },
    numero:{
        type:Number,
        required:true,
    },
    caja:{
        type:String,
        default:""
    },
    F:{
        type:Boolean,
        default:false
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
    cantIva:{
        type:Number,
        default:0
    }
});

module.exports = model('Presupuesto',Presupuesto);