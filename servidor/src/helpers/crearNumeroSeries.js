const NroSerie = require("../models/NroSerie");

exports.crearNumeroSeries = async(lista) => {
    let bandera = true
    try {
        for(let elem of lista){
            const serie = new NroSerie(elem);
            await serie.save();
        };
    } catch (error) {
        console.log(error);
        bandera = false;
    };

    return bandera;
};