const movimientoCTRL = {};

const Movimiento = require('../models/MovVendedores');

movimientoCTRL.post = async(req,res)=>{
    console.log(req.body)
    const movimiento = new Movimiento(req.body);
    await movimiento.save();
    res.end();
};

module.exports = movimientoCTRL;