const {Schema,model} = require('mongoose');


const Cancelado = new Schema({
    fecha:{
        type:Date,
        default:Date.now()
    },
    cliente:{
        type:String,
        required:true,
        set: ( valor )  => valor.toUpperCase(),
        
    },
    precio:{
        type:Number,
        required:true,
        set: ( valor ) => valor.toFixed(2),
    },
    tipo_comp:{
        type:String,
        required:true
    },
    vendedor:{
        type:String,
        required:true,
        set: ( valor ) => valor.toUpperCase(),
    },
    caja:{
        type:String,
        required:true
    }
});

module.exports = model('Cancelado',Cancelado);