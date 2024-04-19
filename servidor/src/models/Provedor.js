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
        set: (value) => value.toUpperCase(),
        required:true
    }
});

module.exports = model('Provedor',Provedor);