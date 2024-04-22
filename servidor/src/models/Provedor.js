const { Schema, model } = require("mongoose");

const Provedor = new Schema({
    numero:{
        type:Number,
        unique:true,
        required:true
    },
    provedor:{
        type:String,
        set: (value) => value.toUpperCase().trim(),
        
        unique:true,
        required:true,
        validate:{
            validator: async function(value) {
                const existe = await this.constructor.findOne({ provedor: value });
                return !existe;
            },
            message: "El nombre del provedor ya existe"
        },
    }
});

module.exports = model('Provedor',Provedor);