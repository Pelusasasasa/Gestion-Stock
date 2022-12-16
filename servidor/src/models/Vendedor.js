const {Schema,model} = require('mongoose');

const Vendedor = new Schema({
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

module.exports = model('Vendedor',Vendedor);