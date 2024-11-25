const remitoCTRL = {}


const Remito = require('../models/Remito');

remitoCTRL.getAll = async(req, res) => {
    const remitos = await Remito.find();

    res.send(remitos);
};

remitoCTRL.getforid = async(req, res) => {
    const { id } = req.params;

    const remito = await Remito.findOne({_id: id});

    res.send(remito);
};

remitoCTRL.postOne = async(req, res) => {
    const remito = new Remito(req.body);
    try {
        console.log(remito)
        await remito.save();
        res.send(remito);
    } catch (error) {
        console.log(error);
        if (error.code === 11000){
            res.status(400).send({error: 'El numero ya es utilizado'});
        }
    }
};

remitoCTRL.putPasado = async(req, res) => {
    const { id } = req.params;

    const remito = await Remito.findOneAndUpdate({_id: id,},{
        $set: {
            pasado: true
        }
    });

    res.send(remito);
};

module.exports = remitoCTRL;