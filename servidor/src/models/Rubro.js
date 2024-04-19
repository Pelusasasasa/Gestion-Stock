const mongoose = require('mongoose');

const Rubro = new mongoose.Schema({
    rubro:{
        type:String,
        uniqued:true,
        set: ( value ) => value.toUpperCase(),
        required:true,
    },
    numero:{
        type:Number,
        uniqued:true,
        require:true
    }
});

module.exports = mongoose.model("Rubro",Rubro);