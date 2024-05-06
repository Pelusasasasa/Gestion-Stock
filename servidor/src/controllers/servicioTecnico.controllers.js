const servicioCTRL = {};

const Servicio = require('../models/ServicioTecnico');

servicioCTRL.getAll = async(req,res)=>{
    const servicios = await Servicio.find();
    res.send(servicios)
};

servicioCTRL.post = async(req, res)=>{
    const now = new Date();
    req.body.fecha = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();

    const servicio = new Servicio(req.body);
    await servicio.save();

    res.send({message: `Servicio creado por el vendedor ${req.body.vendedor} a la hora ${req.body.fecha.slice(0,19)}`});
};

module.exports = servicioCTRL;