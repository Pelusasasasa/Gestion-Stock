const servicioCTRL = {};

const Servicio = require('../models/ServicioTecnico');

servicioCTRL.getAll = async(req,res)=>{
    const servicios = await Servicio.find();
    res.send(servicios)
}

servicioCTRL.post = async(req,res)=>{
    const servicio = new Servicio(req.body);
    await servicio.save();
    console.log(`Servico a ${req.body.cliente} Cargado`);
    res.end();
};

servicioCTRL.getForId = async(req,res)=>{
    const {id} = req.params;
    const servicio = await Servicio.findOne({_id:id});
    res.send(servicio)
}

servicioCTRL.putForId = async(req,res)=>{
    const {id} = req.params;
    await Servicio.findOneAndUpdate({_id:id},req.body);
    console.log(`Servicio de ${req.body.cliente} Modificado`);
    res.end();
}

servicioCTRL.deleteForId = async(req,res)=>{
    const {id} = req.params;
    await Servicio.findOneAndDelete({_id:id});
    res.end();
}

module.exports = servicioCTRL;