const {Schema,model} = require('mongoose');

const MovRecibo = new Schema({
    fecha:{
        type:Date,
        required:true
    },
    idCliente:{
        type:String,
        required:true,
        trim:true,
    },
    cliente:{
        type:String,
        required:true,
        trim:true,
        uppercase:true
    },
    numero:{
        type:String,
        required:true,
        trim:true
    },
    numeroRecibo:{
        type:String,
        required:true,
        trim:true
    },
    tipo:{
        type:String,
        required:true
    },
    tipo_comp:{
        type:String,
        default:"Recibo",
    },
    importe:{
        type:Number,
        required:true,
    },
    precio:{
        type:Number,
        required:true
    },
    saldo:{
        type:Number,
        required:true
    },
    vendedor:{
        type:String,
        default:"",
        trim:true
    }
});

module.exports = model('MovRecibo',MovRecibo);