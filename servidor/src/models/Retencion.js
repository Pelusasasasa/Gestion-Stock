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
    descripcion: {
        type: String,
        required: true,
        trim: true,
        enum: ['Retenciones Imp a las Ganancias', 'Retencones IIBB - ATER Contribuyente']
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