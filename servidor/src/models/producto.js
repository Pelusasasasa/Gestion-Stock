const mongoose = require("mongoose");

const Producto = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      trim: true,
      set: (value) => value.toUpperCase(),
    },
    codigoSecundario: {
      type: String,
      trim: true,
      default: "",
      set: (value) => value.toUpperCase(),
    },
    descripcion: {
      type: String,
      required: true,
      trim: true,
    },
    marca: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Marca",
      default: null,
      set: (v) => (v === "" ? null : v )
    },
    rubro: {
      type: String,
      default: "",
      trim: true,
    },
    provedor: {
      type: String,
      default: "",
      trim: true,
    },
    stock: {
      type: Number,
      required: true,
    },

    // Costo
    costo: {
      type: Number,
      required: true,
    },
    costoDolar: {
      type: Number,
      required: true,
    },
    costoDPP: {
      type: Number,
      default: 0
    },
    utilidad: {
      type: Number,
      required: true,
    },
    impuesto: {
      type: Number,
      default: 0,
    },
    ganancia: {
      type: Number,
      required: true,
    },
    precioCF: {
      type: Number,
      default: 0
    },
    precio: {
      type: Number,
      required: true,
    },

    
    unidad: {
      type: String,
      default: "",
    },
    activo: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Producto", Producto);
