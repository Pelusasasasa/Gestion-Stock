const servicioCTRL = {};

const Servicio = require('../models/ServicioTecnico');

servicioCTRL.getAll = async(req,res)=>{
    const servicios = await Servicio.find();
    res.send(servicios)
};

servicioCTRL.getForId = async(req, res) => {
    const servicio = await Servicio.findById(req.params.id);
    res.send(servicio);
};

servicioCTRL.getForText = async(req, res) => {
    const {text} = req.params;
    if (text !== 'vacio') {
        const re = new RegExp(`^${text}`);
    
        const servicios = await Servicio.find({
            $or: [
                {producto:{$regex:re, $options: 'i'}},
                {marca:{$regex:re, $options: 'i'}},
                {modelo:{$regex:re, $options: 'i'}},
                {cliente:{$regex:re, $options: 'i'}},
            ]
        });
        res.send(servicios);
    }else{
        const servicios = await Servicio.find();
        res.send(servicios);
    }

};

servicioCTRL.post = async(req, res)=>{
    const now = new Date();
    req.body.fecha = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();

    const servicio = new Servicio(req.body);
    await servicio.save();

    res.send({message: `Servicio creado por el vendedor ${req.body.vendedor} a la hora ${req.body.fecha.slice(0,19)}`});
};

module.exports = servicioCTRL;