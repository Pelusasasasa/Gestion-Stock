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
    vendedor:{
        type:String,
        required:true
    }
});

module.exports = model('MovVendedor',MovVendedor)