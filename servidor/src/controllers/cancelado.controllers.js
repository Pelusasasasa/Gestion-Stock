const canceladoCTRL = {};

const Cancelado = require('../models/Cancelado');

canceladoCTRL.getCanceladosForDay = async(req,res) => {
    const {desde,hasta} = req.params;
    const cancelados = await Cancelado.find({
        $and:[
            {fecha:{$gte:new Date( desde + 'T00:00:00.000Z' )}},
            {fecha:{$lte:new Date( hasta + 'T23:59:59.000Z' )}}
        ]
    });

    res.send(cancelados);
};


canceladoCTRL.post = async(req,res) => {

    const now = new Date();
    req.body.fecha = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();

    const cancelado = new Cancelado(req.body);
    await cancelado.save();
    res.send(cancelado);

};

canceladoCTRL.getUltimo = async(req,res) => {
    const cancelado = await Cancelado.findOne().sort({$natural: -1});
    if (cancelado) {
        res.send(`${cancelado.numero}`);
    }else{
        res.send(`${0}`);
    }
}

canceladoCTRL.getForNumber = async(req,res) => {
    const { numero } = req.params;
    const cancelado = await Cancelado.findOne({numero: numero});
    res.send(cancelado);
}

canceladoCTRL.deleteForId = async(req,res) => {
    const { id } = req.params;
    const cancelado = await Cancelado.findOneAndDelete({_id:id});
    console.log(`Cancelado del cliente ${cancelado.cliente} Eliminado con el numero ${cancelado.numero}`);
    res.send(`Cancelado del cliente ${cancelado.cliente} Eliminado con el numero ${cancelado.numero}`);
};

module.exports = canceladoCTRL;
