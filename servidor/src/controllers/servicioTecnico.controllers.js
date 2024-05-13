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
    try {
        await servicio.save();

        res.send({message: `Servicio creado por el vendedor ${req.body.vendedor} a la fecha ${req.body.fecha.slice(0,10).split('-',3).reverse().join('/')}`});
    } catch (error) {
        res.send(error.errors);
    }
};

servicioCTRL.putForId = async(req, res) => {

    const {id} = req.params;

    const now = new Date();
    if(req.body.fechaEgreso){
       req.body.fechaEgreso = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString(); 
    }
    
    const servicio = await Servicio.findByIdAndUpdate({_id:id},req.body);
    res.send(servicio);

};

module.exports = servicioCTRL;