const movProducto = require("../models/movProducto");
const Venta = require("../models/Venta");

const TIPOS_EXCLUIDOS = ['GR', 'PP']

exports.buscarMovimientosPorNROSeries = async (lista) => {

    try {
        let movs = [];
        for (let elem of lista) {
            
            const numero = elem.toObject();
            let mov = null;
            
            if(elem.comprobanteId){
                const venta = await Venta.findById(elem.comprobanteId).select('numero');
                if(venta){
                    mov = await movProducto.findOne({ nro_venta: venta.numero, codProd: elem.codigo});
                }
            }
            
            if(!mov){
                const query = { series: {$in: [elem.nro_serie]}, producto: elem.producto};
                if(elem.factura) query.nro_venta = elem.factura;
                mov = await movProducto.findOne(query);
            };
            
            if(mov && TIPOS_EXCLUIDOS.includes(mov.tipo_venta)) continue;
                
            numero.idCliente = mov?.cliente;
            numero.cliente = mov?.nombreCliente;
            numero.cantidad = mov?.cantidad;

            movs.push(numero);
        };
        return movs;
    } catch (error) {
        console.error(error);
        return [];
    }

}