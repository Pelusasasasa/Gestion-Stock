const movimientoCTRL = {};

const Movimiento = require('../models/MovVendedores');

movimientoCTRL.post = async(req,res)=>{
    const now = new Date();
    req.body.fecha = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();
    const movimiento = new Movimiento(req.body);
    await movimiento.save();
    res.end();
};

movimientoCTRL.getAll = async(req,res)=>{
    const movimientos = await Movimiento.find();
    res.send(movimientos)
};

movimientoCTRL.getForNameAndDate = async(req,res)=>{
    const {name,desde} = req.params;
    const fecha = new Date(desde);
    const movimientos = await Movimiento.find({
        $and:[
            {fecha:{$gte:desde}},
            {vendedor:name}
        ]
    });
    res.send(movimientos);
};

module.exports = movimientoCTRL;