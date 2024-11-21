const mongoose = require('mongoose');

const Rubro = new mongoose.Schema({
    rubro:{
        type:String,
        required:true,
    },
    numero:{
        type:Number,
        require:true
    }
});

module.exports = mongoose.model("Rubro",Rubro);