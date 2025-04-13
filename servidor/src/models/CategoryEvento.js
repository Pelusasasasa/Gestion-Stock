const { Schema, model } = require("mongoose");

const CategoryEvento = new Schema({

    nombre: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        set: value => value.toUpperCase()
    },
    color: {
        type: String,
        default: '#808080',
        set: value => {
            const clean = value.replace('#', '').toUpperCase();
            return `#${clean}`;
        },
        validate: {
            validator: value => /^#[0-9A-F]{6}$/.test(value),
            message: 'El color debe ser un código hexadecimal válido (ej: #E7D40A)'
        }
    }

});

module.exports = model('CategoryEvento', CategoryEvento);