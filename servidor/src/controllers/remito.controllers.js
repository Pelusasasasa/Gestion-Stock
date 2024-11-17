const remitoCTRL = {}


const Remito = require('../models/Remito');

remitoCTRL.getAll = async(req, res) => {
    const remitos = await Remito.find();

    res.send(remitos);
}


remitoCTRL.postOne = async(req, res) => {
    const remito = new Remito(req.body);
    try {
        await remito.save();
        res.send(remito);
    } catch (error) {
        if (error.code === 11000){
            res.status(400).send({error: 'El numero ya es utilizado'});
        }
    }
};

module.exports = remitoCTRL;