const {Schema , model} = require('mongoose');


const Remito = new Schema({
    fecha:{
        type:Date,
        default: Date.now
    },
    numero:{
        type:String,
        required:true
    },
    idCliente:{
        type:String,
        required:true
    },
    cliente:{
        type:String,
        default: "Consumidor Final"
    },
    tipo_comp:{
        type:String,
        default:"Remito"
    },
    caja:{
        type:String,
        default:""
    },
    vendedor:{
        type:String,
        default:""
    }

});

module.exports = model('Remito',Remito);