const remitoCTRL = {};

const Remito = require('../models/Remito');

remitoCTRL.post = async(req,res)=>{
    const remito = new Remito(req.body)
    await remito.save();
    console.log(`Remito numero ${req.body.numero} a ${req.body.cliente} Cargador`)
    res.end();
};

module.exports = remitoCTRL;