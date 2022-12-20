const movimientoCTRL = {};

const Movimiento = require('../models/MovVendedores');

movimientoCTRL.post = async(req,res)=>{
    const now = new Date();
    req.body.fecha = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();
    const movimiento = new Movimiento(req.body);
    await movimiento.save();
    res.end();
};

module.exports = movimientoCTRL;