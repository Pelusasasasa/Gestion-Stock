const Venta = require("../models/Venta");
const Movimientos = require("../models/movProducto");
const MetodoPago = require('../models/MetodoPago');
const MovRecibo = require('../models/MovRecibos');

exports.agregarIngormacionCompensadas = async(lista) => {
    let compensadas = [];
    for(let elem of lista){
        let compensada = elem.toObject();
        const venta = await Venta.findOne({
            $and: [
                {numero: elem.nro_venta},
                {tipo_venta: 'CC'}
            ]
        });
        const movimientos = await Movimientos.find({
            $and: [
                {nro_venta: elem.nro_venta},
                {tipo_venta: 'CC'}
            ]
        });
        compensada.dolar = venta?.dolar ?? '0';
        compensada.movimientos = movimientos;
        compensadas.push(compensada);
    };

    return compensadas;
};

exports.agregarInformacionHistoricas = async(lista) => {
    let historicas = [];
    for(let elem of lista){
        let historica = elem.toObject();
        
        if(elem.tipo_comp === 'Recibo'){
            const movimientos = await MovRecibo.find({
                numeroRecibo: elem.nro_venta
            });

            const metodosPago = await MetodoPago.find({
                nro_comp: elem.nro_venta,
                tipoComprobante: elem.tipo_comp
            });

            historica.movimientos = movimientos;
            historica.metodosPago = metodosPago;
        }else{

            const movimientos = await Movimientos.find({
                $and: [
                    {nro_venta: elem.nro_venta},
                    {tipo_venta: 'CC'}
                ]
            });
            historica.movimientos = movimientos;
        }
        historicas.push(historica);
        
    };

    return historicas;
};

