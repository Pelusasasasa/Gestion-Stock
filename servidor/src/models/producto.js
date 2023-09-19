const mongoose = require('mongoose');

const Producto = new mongoose.Schema({
    _id:{
        type: String,
        required:true
    },
    descripcion:{
        type: String,
        required:true,
        trim:true
    },
    marca:{
        type: String,
        default: "",
        trim:true
    },
    rubro:{
        type:String,
        default:"",
        trim:true
    },
    provedor:{
        type:String,
        default:"",
        trim:true
    },
    stock:{
        type: Number,
        required: true
    },
    costo:{
        type: Number,
        required: true
    },
    costoDolar:{
        type: Number,
        required: true
    },
    impuesto:{
        type:Number,
        default: 0
    },
    ganancia:{
        type: Number,
        required:true
    },
    precio:{
        type:Number,
        required:true
    },
    unidad:{
        type:String,
        default:""
    }
},{
    timestamps:true
});

module.exports = mongoose.model('Producto',Producto);