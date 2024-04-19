const { Schema, model } = require("mongoose");

const Provedor = new Schema({
    numero:{
        type:Number,
        unique:true,
        required:true
    },
    provedor:{
        type:String,
        unique:true,
        required:true
    }
});

module.exports = model('Provedor',Provedor);