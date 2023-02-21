const mongoose = require('mongoose');

const Vendedor = new mongoose.Schema({
    codigo:{
        type:String,
        required:true
    },
    nombre:{
        type:String,
        require:true
    },
    permiso:{
        type:Number,
        default:2
    }
});

module.exports = mongoose.model('Vendedor',Vendedor);
