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

module.exports = nroSerieCTRL;