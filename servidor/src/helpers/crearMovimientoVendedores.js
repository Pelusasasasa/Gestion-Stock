const MovVendedores = require("../models/MovVendedores");

exports.crearMovimientoVendedores = async(descripcion, vendedor, tipo = '') => {
    try {
        const movimiento = {};

        movimiento.descripcion = descripcion;
        movimiento.vendedor = vendedor;
        movimiento.tipo = tipo;

        const nuevoMovimiento = await new MovVendedores(movimiento);
        nuevoMovimiento.save();
        
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }

};