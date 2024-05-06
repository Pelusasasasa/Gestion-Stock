const {Schema, model} = require('mongoose');


const Servicio = new Schema({
    fecha:{
        type:Date,
        default: Date.now
    },
    idCliente:{
        type:String,
        default: ""
    },
    cliente:{
        type:String,
        default:""
    },
    direccion:{
        type:String,
        default:""
    },
    telefono:{
        type:String,
        default:""
    },
    codProd:{
        type:String,
        default:"0000"
    },
    producto:{
        type:String,
        require:true
    },
    modelo:{
        type:String,
        default:""
    },
    marca:{
        type:String,
        default:""
    },
    serie:{
        type:String,
        default:""
    },
    detalles:{
        type:String,
        default:""
    },
    total:{
        type:Number,
        default:0
    },
    fechaEgreso:{
        type:Date,
    },
    vendedor:{
        type:String,
        require: true
    },
    estado:{
        type: Number,
        default: 0
    }
});

module.exports = model('Servicio',Servicio)