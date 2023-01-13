const presupuestoCTRL = {};

const Presupuesto = require('../models/Presupuesto');

presupuestoCTRL.post = async(req,res)=>{
    const now = new Date();
    req.body.fecha = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();
    const presupuesto = new Presupuesto(req.body);
    await presupuesto.save();
    console.log(`Presupuesto ${req.body.nro_venta} cargado a las ${req.body.fecha}`);
    res.send();
}

module.exports = presupuestoCTRL;