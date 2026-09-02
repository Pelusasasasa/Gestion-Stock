const { Schema, Types, model } = require("mongoose");

const MetodoPago = new Schema({
    fecha: {
        type: Date,
        default: new Date(),
    },
    monto: {
        type: Number,
        required: true,
    },
    tipo: {
        type: String,
        required: true,
        trim: true,
    },
    nro_comp: {
        type: Number,
        required: true,
    },
    comprobanteId: {
        type: Types.ObjectId,
        required: true,
        refPath: 'tipoComprobante'
    },
    tipoComprobante: {
        type: String,
        required: true,
        enum: ['Recibo', 'Presupuesto', 'CuentaCorriente', 'Contado', 'Factura A', 'Factura B', 'Credito A', 'Credito B'],
        default: 'Recibo'
    }
});


module.exports = model('MetodoPago', MetodoPago)