const movReciboCTRL = {};


const MovRecibo = require('../models/MovRecibos');

movReciboCTRL.postMovRecibo = async(req,res)=>{
    const movRecibo = new MovRecibo(req.body);
    await movRecibo.save();
    res.send(`Movimiento de recibo del cliente ${movRecibo.cliente} Cargado por el vendedor ${movRecibo.vendedor}`);
};

movReciboCTRL.getForNumber = async(req,res)=>{

    const {number} = req.params;

    const movRecibos = await MovRecibo.find({numeroRecibo:number});
    res.send(movRecibos);

};

module.exports = movReciboCTRL;