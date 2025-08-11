const movProducto = require("../models/movProducto");

exports.buscarMovimientosPorNROSeries = async(lista) => {

    try {
        let movs = []
        for(let elem of lista){
            const numero = elem.toObject();

            const mov = await movProducto.findOne({
                $and: [
                    {series: {
                        $in: [elem.nro_serie]
                    }},
                    {producto: elem.producto}
                ]
            });
            
            numero.idCliente = mov?.cliente;
            numero.cliente = mov?.nombreCliente;

            movs.push(numero);
        };
        

        return movs;
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se pudieron obtener las ventas, hable con el administrador'
        });

        return []
    }

}