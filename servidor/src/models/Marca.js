const { Schema, model, default: mongoose } = require("mongoose");

const Marca = new Schema({
    codigo: {
        type: String,
        required: true,
        unique: true,
        set: value => value.toUpperCase().trim()
    },
    nombre: {
        type: String,
        required: true,
        set: value => value.toUpperCase().trim()
    }
});


module.exports = mongoose.models.Marca || model('Marca', Marca);