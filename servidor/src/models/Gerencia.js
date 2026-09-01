const {Schema,model}= require('mongoose');

const Gerencia = new Schema({
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
        default:"Gerencia"
    },
    numero:{
        type:Number,
        required:true,
    },
    dolar: {
        type: Number,
        default: 0,
    },
    vendedor: {
        type: Schema.Types.ObjectId,
        ref: 'Vendedor',
        required: true
    },
    activo: {
        type: Boolean,
        default: true,
    },
});

module.exports = model('Gerencia',Gerencia);
