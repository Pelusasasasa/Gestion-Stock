const {Schema,model} = require('mongoose');

const Pedido = new Schema({
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
        default:"Sin Pedir"
    },
    observaciones:{
        type:String,
        default:""
    }
});

module.exports = model('Pedido',Pedido);
