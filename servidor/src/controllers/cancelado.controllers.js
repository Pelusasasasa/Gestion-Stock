const canceladoCTRL = {};

const Cancelado = require('../models/Cancelado');

canceladoCTRL.getCanceladosForDay = async(req,res) => {
    const {desde,hasta} = req.params;
    console.log(desde,hasta);
    const cancelados = await Cancelado.find({
        $and:[
            {fecha:{$gte:new Date( desde + 'T00:00:00.000Z' )}},
            {fecha:{$lte:new Date( hasta + 'T23:59:59.000Z' )}}
        ]
    });

    res.send(cancelados);
};


canceladoCTRL.post = async(req,res) => {

    const now = new Date();
    req.body.fecha = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();

    const cancelado = new Cancelado(req.body);
    await cancelado.save();
    res.send(cancelado);

};

module.exports = canceladoCTRL;
