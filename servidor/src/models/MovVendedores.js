const {Schema,model} = require('mongoose');

const MovVendedor = new Schema({
    fecha:{
        type:Date,
        default:Date.now
    },
    descripcion:{
        type:String,
        required:true
    },
    tipo:{
        type:String,
        default: ''
    },
    vendedor:{
        type:String,
        required:true
    }
});

module.exports = model('MovVendedor',MovVendedor)