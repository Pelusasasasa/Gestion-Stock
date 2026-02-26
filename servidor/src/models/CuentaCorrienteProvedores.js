const { Schema, Types, model } = require('mongoose');

const cuentaCorrienteProvedoresSchema = new Schema({
  fecha: {
    type: Date,
    default: Date.now(),
  },
  facturaAsoc: {
    type: Types.ObjectId,
    ref: 'FacturaProvedor',
  },
  provedorId: {
    type: Types.ObjectId,
    ref: 'Provedor',
    require: true,
  },
  debe: {
    type: Number,
    default: 0,
  },
  haber: {
    type: Number,
    default: 0,
  },
  saldo: {
    type: Number,
    default: 0,
  },
  tipo: {
    type: Types.ObjectId,
    ref: 'TipoCuenta',
    require: true,
  },
  observaciones: {
    type: String,
    default: '',
  },
});

module.exports = model('CuentaCorrienteProvedores', cuentaCorrienteProvedoresSchema);
