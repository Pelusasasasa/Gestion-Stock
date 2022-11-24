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

pedidoCTRL.putForId = async(req,res)=>{
    const {id} = req.params;
    await Pedido.findByIdAndUpdate({_id:id},req.body);
    console.log(`Pedido ${req.body.producto} Mificado el estado a ${req.body.estadoPedido}`);
    res.send();
}

pedidoCTRL.deleteForId = async(req,res)=>{
    const {id} = req.params;
    await Pedido.findOneAndDelete({_id:id});
    console.log(`Pedido ${id} Eliminado`)
    res.send()
}

module.exports = pedidoCTRL;