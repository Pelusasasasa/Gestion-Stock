const mongoose = require('mongoose');

const Pedido =  new mongoose.Schema({
    producto:{
        type:String,
        require:true
    },
    codigo:{
        type:String,
        default:""
    },
    fecha:{
        type:Date,
        default: Date.now
    },
    cantidad:{
        type:Number,
        default:0
    },
    cliente:{
        type:String,
        default:""
    },
    telefono:{
        type:String,
        default:""
    },
    stock:{
        type:Number,
        default:0
    },
    estadoPedido:{
        type:String,
        default:"SIN PEDIR"
    },
    observaciones:{
        type:String,
        default:""
    },
    vendedor:{
        type:String,
        default:""
    }
});

module.exports = mongoose.model('Pedido',Pedido);
