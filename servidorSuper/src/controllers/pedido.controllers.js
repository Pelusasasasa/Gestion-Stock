const pedidoCTRL = {};

const Pedido = require('../models/Pedido');

pedidoCTRL.post = async(req,res)=>{
    const pedido = new Pedido(req.body);
    await pedido.save();
    console.log(`Pedido ${req.body.producto} Cargado`)
    res.end();
};

pedidoCTRL.getAll = async(req,res)=>{
    const pedidos = await Pedido.find();
    res.send(pedidos);
}

module.exports = pedidoCTRL;