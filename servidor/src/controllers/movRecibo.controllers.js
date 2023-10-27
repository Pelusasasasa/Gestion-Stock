const movReciboCTRL = {};

const MovRecibo = require('../models/MovRecibo');

movReciboCTRL.getAll = async(req,res) => {
    const moviminetos = await MovRecibo.find();
    res.send(moviminetos);
};

movReciboCTRL.post = async(req,res) => {
    const now = new Date();
    req.body.fecha = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();

    const movRecibo = new MovRecibo(req.body);
    await movRecibo.save();
    res.end();
};


movReciboCTRL.getforNumberAndClient = async(req,res) => {
    const {numero,codigo} = req.params;
    const movRecibo = await MovRecibo.find({numero,codigo});
    res.send(movRecibo);
};


module.exports = movReciboCTRL;