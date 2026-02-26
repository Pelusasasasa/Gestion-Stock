const { Schema, model } = require('mongoose');

const FacturaProvedor = new Schema({
  fecha_comp: {
    type: Date,
    default: Date.now,
  },
  fecha_input: {
    type: Date,
    default: Date.now,
  },
  puntoVenta: {
    type: String,
    required: true,
    set: (value) => value.padStart(4, '0'),
  },
  numero: {
    type: String,
    required: true,
    set: (value) => value.padStart(8, '0'),
  },
  tipo: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'TipoCuenta',
  },
  provedorId: {
    type: Schema.Types.ObjectId,
    ref: 'Provedor',
    required: true,
  },
  netoNoGravado: {
    type: Number,
    default: 0,
  },
  netoGravado: {
    type: Number,
    default: 0,
  },
  tasaIva: {
    type: Number,
    default: 21,
  },
  iva: {
    type: Number,
    default: 0,
  },
  persepcion_bruto: {
    type: Number,
    default: 0,
  },
  persepcion_iva: {
    type: Number,
    default: 0,
  },
  retencion_bruto: {
    type: Number,
    default: 0,
  },
  retencion_iva: {
    type: Number,
    default: 0,
  },
  subTotal: {
    type: Number,
    default: 0,
  },
  descuento: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    default: 0,
  },
  tipo_pago: {
    type: String,
    enum: ['CONTADO', 'CUENTA CORRIENTE'],
    default: 'CONTADO',
  },
  dolar: {
    type: Boolean,
    default: false,
  },
  dolarTomado: {
    type: Number,
    default: 0,
  },
  observaciones: {
    type: String,
    default: '',
  },
  detallesPago: {
    type: [],
    default: [],
  },
});

module.exports = model('FacturaProvedor', FacturaProvedor);
