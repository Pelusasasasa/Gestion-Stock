const { Schema, model } = require("mongoose");

const Marca = new Schema({
    numero:{
        type:Number,
        unique:true,
        required:true
    },
    marca:{
        type:String,
        unique:true,
        set: (value) => value.toUpperCase(),
        required:true
    }
});

module.exports = model('Marca',Marca);