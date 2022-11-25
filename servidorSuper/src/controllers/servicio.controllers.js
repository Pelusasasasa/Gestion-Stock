const servicioCTRL = {};

const Servicio = require('../models/ServicioTecnico');

servicioCTRL.post = async(req,res)=>{
    const servicio = new Servicio(req.body);
    await servicio.save();
    console.log(`Servico a ${req.body.cliente} Cargado`);
    res.end();
};

module.exports = servicioCTRL;