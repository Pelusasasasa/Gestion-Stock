const {Schema, model} = require('mongoose');


const Servicio = new Schema({
    fecha:{
        type:Date,
        default: Date.now
    },
    numero:{
        type:Number,
        required:true,
        unique:true
    },
    idCliente:{
        type: Schema.Types.Number,
        ref: 'Cliente',
        required:true
    },
    cliente:{
        type:String,
        required:[true, 'El nombre del Cliente es Obligatorio'],
        set: (value) => value.toUpperCase().trim(),
    },
    codProd:{
        type: Schema.Types.String,
        ref: 'Producto',
        required:true
    },
    producto:{
        type:String,
        set: (value) => value.toUpperCase().trim(),
    },
    modelo: {
        type: String,
        default: ''
    },
    serie: {
        type: 'String',
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
        type: Schema.Types.ObjectId,
        ref: 'Vendedor',
        required: true
    },
    estado:{
        type: Number,
        default: 0
    }
});

module.exports = model('Servicio',Servicio)