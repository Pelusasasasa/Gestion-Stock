const movProducto = require("../models/movProducto");

exports.buscarMovimientosPorNROSeries = async (lista) => {

    try {
        let movs = []
        for (let elem of lista) {

            const numero = elem.toObject();


            const query = {
                series: { $in: [elem.nro_serie] },
                producto: elem.producto
            };

            if (elem.factura) {
                query.nro_venta = elem.factura;
            };

            const mov = await movProducto.findOne(query);

            numero.idCliente = mov?.cliente;
            numero.cliente = mov?.nombreCliente;

            movs.push(numero);
        };


        return movs;
    } catch (error) {
        console.error(error);
        return [];
    }

}