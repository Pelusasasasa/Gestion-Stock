const mongoose = require('mongoose');
const {Schema,model} = mongoose;

const Vendedor = new Schema({
    nombre:{
        type:String,
        require:true
    },
    codigo:{
        type:String,
        require:true
    },
    permiso:{
        type:Number,
        default:3
    }
})

module.exports = model('Vendedor',Vendedor)