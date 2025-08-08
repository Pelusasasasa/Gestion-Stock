const movProducto = require("../models/movProducto");

exports.crearMovimientosStock = async(venta) => {
    let bandera = true;
    for(const {cantidad, producto, series} of venta.listaProductos){
        try {
            const movimiento = {};
            movimiento.fecha = venta.fecha;
            movimiento.tipo_venta = venta.tipo_venta;
            movimiento.cliente = venta.idCliente;
            movimiento.marca = producto.marca;
            movimiento.codProd = producto._id;
            movimiento.rubro = producto.rubro;
            movimiento.cantidad = cantidad;
            movimiento.iva = producto.impuesto;
            movimiento.precio = producto.precio;
            movimiento.series = series;
            movimiento.nro_venta = venta.numero;
            movimiento.tipo_comp = venta.tipo_comp;

            const nuevoMovimiento = new movProducto(movimiento);
            await nuevoMovimiento.save();

        } catch (error) {
            console.log(error);
            bandera = false;
        }
    };
    return bandera

};