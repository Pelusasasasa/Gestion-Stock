const MovVendedores = require("../models/MovVendedores");

exports.crearMovimientoVendedores = async(descripcion, vendedor) => {

    try {
        const movimiento = {};

        movimiento.descripcion = descripcion;
        movimiento.vendedor = vendedor;

        const nuevoMovimiento = await new MovVendedores(movimiento);
        nuevoMovimiento.save();
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }

};