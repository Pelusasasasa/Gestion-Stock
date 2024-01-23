const {Schema,model} = require('mongoose');


const Cancelado = new Schema({
    fecha:{
        type:Date,
        default:Date.now()
    },
    idCliente:{
        type:String,
        required:true,
    },
    cliente:{
        type:String,
        required:true,
        set: ( valor )  => valor.toUpperCase(),
        
    },
    condicionIva:{
        type:String,
        required:true,
    },
    cod_doc:{
        type:Number,
        required:true,
    },
    num_doc:{
        type:String,
        required:true,
    },
    cod_comp:{
        type:Number,
        required:true
    },
    numero:{
        type:Number,
        required:true
    },
    precio:{
        type:Number,
        required:true,
        set: ( valor ) => valor.toFixed(2),
    },
    descuento:{
        type:Number,
        required:true,
        set: ( valor ) => valor.toFixed(2)
    },
    tipo_comp:{
        type:String,
        required:true
    },
    tipo_venta:{
        type:String,
        required:true,
    },
    vendedor:{
        type:String,
        required:true,
        set: ( valor ) => valor.toUpperCase(),
    },
    caja:{
        type:String,
        required:true
    },

    gravado21:{
        type:Number,
        required:true,
    },
    gravado105:{
        type:Number,
        required:true,
    },
    iva21:{
        type:Number,
        required:true,
    },
    iva105:{
        type:Number,
        required:true,
    },
    cantIva:{
        type:Number,
        required:true,
    },
});

module.exports = model('Cancelado',Cancelado);