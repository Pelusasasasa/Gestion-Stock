const { Schema, Types, model } = require("mongoose");

const Retencion = new Schema({
    fecha: {
        type: Date,
        default: new Date(),
    },
    importe: {
        type: Number,
        required: true,
    },
    nro_comp: {
        type: String,
        required: true,
    },
    reciboId: {
        type: Types.ObjectId,
        ref: 'Recibo',
        required: true
    },
});


module.exports = model('Retencion', Retencion)