const { Schema, model } = require("mongoose");

const ProductosModificados = new Schema({
    fecha:{
        type:Date,
        default:Date.now
    },
    codigo:{
        type:String,
        required:true
    },
    descripcion:{
        type:String,
        required:true,
    },
    precio:{
        type:Number,
        required:true
    }
});

module.exports = model('ProductosModificados',ProductosModificados);