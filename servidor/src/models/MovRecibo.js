const {Schema, model} = require('mongoose');

const MovRecibo = new Schema({
    fecha:{
        type:Date,
        default:Date.now
    },
    tipo:{
        type:String,
        required:true,
        trim:true
    },
    codigo:{
        type:String,
        required:true,
        trim:true
    },
    cliente:{
        type:String,
        required:true,
        trim:true,
        set:(value) => value.toUpperCase()
        
    },
    nro_comp:{
        type:String,
        required:true,
        trim:true
    },
    numero:{
        type:Number,
        required:true,
    },
    importe:{
        type:Number,
        required:true,
    },
    pagado:{
        type:Number,
        required:true
    },
    saldo:{
        type:Number,
        required:true
    }
});


module.exports = model('MovRecibo',MovRecibo);