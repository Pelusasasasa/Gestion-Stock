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
    numeroSerie:{
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
        default:""
    },
    caja:{
        type:String,
        default:""
    },
    retiro:{
        type:String,
        default:"RESIDENCIA"
    },
    codigoRMA:{
        type:String,
        default:""
    }
});

module.exports = model('Servicio',Servicio)