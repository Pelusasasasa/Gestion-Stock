const mongoose = require('mongoose');

const Gasto = new mongoose.Schema({
    fecha:{
        type:Date,
        default:Date.now
    },
    descripcion:{
        type:String,
        default:""
    },
    importe:{
        type:Number,
        default:0
    },
    vendedor:{
        type:String,
        default:""
    },
    caja:{
        type:String,
        default:""
    }
});


module.exports = mongoose.model('Gasto',Gasto)