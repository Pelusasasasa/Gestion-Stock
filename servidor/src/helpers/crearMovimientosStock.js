const movProducto = require("../models/movProducto");

exports.crearMovimientosStock = async(listaProductos, venta) => {

    const movimientos = [];
    for(const {cantidad, producto, series} of listaProductos){

        let precioFinal = 0;

        if(venta.condicion === 'INSTALADOR'){
            precio = producto.costoDolar !== 0 
                ? (producto.costoDolar + (producto.costoDolar * producto.impuesto / 100)) * venta.dolar 
                : producto.costo + (producto.costo * producto.impuesto / 100)
        }else{
            precio = producto.precio;
        };

        
        try {
            const movimiento = {};
            movimiento.fecha = venta.fecha;
            movimiento.tipo_venta = venta.tipo_venta;
            movimiento.cliente = venta.idCliente;
            movimiento.nombreCliente = venta.cliente;
            movimiento.marca = producto.marca;
            movimiento.codProd = producto._id;
            movimiento.producto = producto.descripcion;
            movimiento.rubro = producto.rubro;
            movimiento.cantidad = cantidad;
            movimiento.iva = producto.impuesto;
            movimiento.precio = precio;
            movimiento.series = series;
            movimiento.nro_venta = venta.numero;
            movimiento.tipo_comp = venta.tipo_comp;

            const nuevoMovimiento = new movProducto(movimiento);
            await nuevoMovimiento.save();
            movimientos.push(movimiento);

        } catch (error) {
            console.error(error);
            movimientos = undefined;
        }
    };
    return movimientos

};