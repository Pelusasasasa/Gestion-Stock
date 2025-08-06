const mongoose = require('mongoose');

const Cliente = new mongoose.Schema({
    _id:{
        type: Number,
        required: true,
        unique: true
    },
    nombre:{
        type:String,
        trim: true,
        required:true,
        set: (value) => value.toUpperCase()
    },
    cuit:{
        type:String,
        default:""
    },
    telefono:{
        type:String,
        trim: true,
        default:""
    },
    direccion:{
        type:String,
        default:"",
        set: (value) => value.toUpperCase()
    },
    localidad:{
        type:String,
        default:"",
        set: (value) => value.toUpperCase()
    },
    email: {
        type: String,
        default: "",
        set: (value) => value.toLowerCase()
    },
    saldo:{
        type: Number,
        default: 0
    },
    condicionFacturacion:{
        type:Number,
        default: 1
    },
    condicionIva:{
        type:String,
        default:"Consumidor Final"
    },
    tipoCuenta: {
        type: String,
        enum: ['NORMAL', 'INSTALADOR']
    },
    activo: {
        type: Boolean,
        default: true
    },
    observaciones:{
        type:String,
        default:"",
        set: (value) => value.toUpperCase()
    }
});

module.exports = mongoose.model('Cliente',Cliente);