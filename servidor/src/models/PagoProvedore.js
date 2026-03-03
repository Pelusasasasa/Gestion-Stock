const { Schema, Types, model } = require('mongoose');

const PagoProvedor = new Schema({
  fecha: {
    type: Date,
    default: Date.now,
  },
  provedorId: {
    type: Types.ObjectId,
    ref: 'Provedor',
    required: true,
  },
  importe: {
    type: Number,
    required: true,
  },
  mediosPagos: {
    type: Array,
    required: true,
  },
  numero: {
    type: Number,
    required: true,
  },
  observaciones: {
    type: String,
    required: false,
  },
});

module.exports = model('PagoProvedor', PagoProvedor);
