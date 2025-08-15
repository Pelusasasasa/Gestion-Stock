const Venta = require("../models/Venta");

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
        compensada.dolar = venta?.dolar ?? '0';
        compensadas.push(compensada);
    };

    return compensadas;
};