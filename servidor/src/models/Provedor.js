const { Schema, model } = require("mongoose");

const Provedor = new Schema({
    
    nombre:{
        type: String,
        required: true,
        set: ( value ) => value.toUpperCase()
    },
    cuit:{
        type: String,
        required: true
    },
    domicilio:{
        type: String,
        default: '',
        set: ( value ) => value.toUpperCase()
    },
    localidad:{
        type: String,
        default: '',
        set: ( value ) => value.toUpperCase()
    },
    codPostal:{
        type: String,
        default: '',
        set: ( value ) => value.toUpperCase()
    },
    provincia:{
        type: String,
        default: '',
        set: ( value ) => value.toUpperCase()
    },
    telefono:{
        type: String,
        default: '',
        set: ( value ) => value.toUpperCase()
    },
    mail:{
        type: String,
        default: '',
        set: ( value ) => value.toUpperCase()
    },
    saldo:{
        type: Number,
        default: 0
    },
    // numero:{
    //     type: Number,
    //     default: 0
    // },
    // provedor:{
    //     type: Number,
    //     default: 0
    // }
});


module.exports = model('Provedor', Provedor);