const {Schema, model, Types} = require('mongoose');

const Recibo = new Schema({
    fecha:{
        type:Date,
        default: Date.now
    },
    cliente:{
        type: String,
        required:true
    },
    idCliente:{
        type: Schema.Types.Number,
        ref: 'Cliente',
        required:true
    },
    numero:{
        type:Number,
        required:true
    },
    precio:{
        type: Number,
        required:true
    },
    descuento:{
        type:Number,
        default:0
    },
    tipo_comp:{
        type:String,
        default: "Recibo"
    },
    tipo_venta:{
        type:String,
        default:"RB"
    },
    valorRecibido:{
        type:String,
        required:true
    },
    vendedor: {
        type: Types.ObjectId,
        ref: 'Vendedor',
        required: true
    }

});

module.exports = model("Recibo",Recibo);