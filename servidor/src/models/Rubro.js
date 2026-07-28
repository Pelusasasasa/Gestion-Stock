const mongoose = require('mongoose');

const Rubro = new mongoose.Schema({
    rubro:{
        type:String,
        required:true,
        unique: true
    },
    numero:{
        type:Number,
        require:true,
        unique: true
    }
});

module.exports = mongoose.model("Rubro",Rubro);