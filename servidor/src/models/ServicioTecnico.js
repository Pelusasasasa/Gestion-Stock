const {Schema, model} = require('mongoose');


const Servicio = new Schema({
    numero:{
        type:Number,
        required:true,
        unique:true
    },
    fecha:{
        type:Date,
        default: Date.now
    },
    idCliente:{
        type:String,
        required:true
    },
    cliente:{
        type:String,
        required:[true, 'El nombre del Cliente es Obligatorio'],
        set: (value) => value.toUpperCase().trim(),
    },
    direccion:{
        type:String,
        set: (value) => value.toUpperCase().trim(),
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
        set: (value) => value.toUpperCase().trim(),
        required:true
    },
    modelo:{
        type:String,
        set: (value) => value.toUpperCase().trim(),
        default:""
    },
    marca:{
        type:String,
        set: (value) => value.toUpperCase().trim(),
        default:""
    },
    serie:{
        type:String,
        set: (value) => value.toUpperCase().trim(),
        required:true
    },
    problemas:{
        type:String,
        set: (value) => value.toUpperCase().trim(),
        default:""
    },
    detalles:{
        type:String,
        set: (value) => value.toUpperCase().trim(),
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
        required: true
    },
    estado:{
        type: Number,
        default: 0
    }
});

module.exports = model('Servicio',Servicio)