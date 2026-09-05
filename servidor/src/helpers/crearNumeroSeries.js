const NroSerie = require("../models/NroSerie");
const Vendedor = require("../models/Vendedor");

exports.crearNumeroSeries = async(lista) => {
    let bandera = true
    if (!Array.isArray(lista) || lista.length === 0) return true;
    try {
        let vendedorDefault = null;
        for(let elem of lista){
            let vendedorId  = elem.vendedor;

            if(!vendedorId){
                if(!vendedorDefault){
                    vendedorDefault = await Vendedor.findOne({activo: true}) || await Vendedor.findOne();
                }
                vendedorId = vendedorDefault?._id;
            }


            const serie = new NroSerie({
                ...elem,
                nro_serie: elem.nro_serie || '',
                vendedor: vendedorId
            });
            await serie.save();
        };
    } catch (error) {
        console.error(error);
        bandera = false;
    };

    return bandera;
};