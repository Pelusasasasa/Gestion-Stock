const { Schema, model } = require("mongoose");

const Servicio = new Schema({
  fecha: {
    type: Date,
    default: Date.now,
  },
  numero: {
    type: Number,
    required: true,
    unique: true,
  },
  datosClientes: {
    type: Object,
    required: true,
  },
  activo: {
    type: Boolean,
    default: true,
  },
  vendedor: {
    type: Schema.Types.ObjectId,
    ref: "Vendedor",
    required: true,
  },
  sugerencias: {
    type: String,
    default: "",
    trim: true,
  },
  historial: {
    type: Array,
    default: [],
  },
});

module.exports = model("Servicio", Servicio);
