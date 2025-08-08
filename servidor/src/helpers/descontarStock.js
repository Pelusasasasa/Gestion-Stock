const Producto = require("../models/producto");

exports.descontarStock = async (lista) => {
    let bandera = true;
    for(let {cantidad, producto, series} of lista){
        try {
            const productoActualizado = await Producto.findById(producto._id);
            productoActualizado.stock -= cantidad;
            await productoActualizado.save();
        } catch (error) {
            bandera = false;
        };
    };
    return bandera;
};