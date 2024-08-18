const nroSerieCTRL = {};

const NroSerie = require('../models/NroSerie');

nroSerieCTRL.get = async(req, res) => {
    const respuesta = await NroSerie.find();
    res.send(respuesta);
}

nroSerieCTRL.post = async(req, res) => {
    const nroSerie = new NroSerie(req.body);

    await nroSerie.save();
    
    res.send(nroSerie);
};

nroSerieCTRL.getForSearch = async(req, res) => {
    const { text } = req.params;
    const re = new RegExp(`^${text}`);
    
    const respuesta = await NroSerie.find({
        $or: [
            {nro_serie:{$regex: re, $options: 'i'}},
            {codigo:{$regex: re, $options: 'i'}},
            {producto:{$regex: re, $options: 'i'}},
            {provedor:{$regex: re, $options: 'i'}}
        ]
    });

    res.send(respuesta);
}

module.exports = nroSerieCTRL;