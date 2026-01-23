const { Schema, model } = require("mongoose");

const SaldoMensual = new Schema({
  mes: {
    type: Number,
    required: true,
  },
  anio: {
    type: Number,
    required: true,
  },
  saldo: {
    type: Number,
    required: true,
  },
});

module.exports = model("SaldoMensual", SaldoMensual);
