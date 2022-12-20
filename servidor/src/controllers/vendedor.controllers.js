const vendedorCTRL = {};

const Vendedor = require('../models/Vendedor');

vendedorCTRL.post = async(req,res)=>{
    const vendedor = new Vendedor(req.body);
    await vendedor.save();
    console.log(`Vendedor ${req.body.nombre} Cargado`);
    res.end();
}

vendedorCTRL.getAll = async(req,res)=>{
    const vendedores = await Vendedor.find();
    res.send(vendedores);
}

vendedorCTRL.getForId = async(req,res)=>{
    const {id} = req.params;
    const vendedor = await Vendedor.findOne({codigo:id});
    res.send(vendedor)
}

vendedorCTRL.putForId = async(req,res)=>{
    const {id} = req.params;
    await Vendedor.findOneAndUpdate({_id:id},req.body);
    console.log(`Vendedor ${req.body.nombre} Modificado`)
    res.end();
}

vendedorCTRL.deleteForId = async(req,res)=>{
    const {id} = req.params;
    await Vendedor.findOneAndDelete({_id:id});
    res.end();
}

module.exports = vendedorCTRL;
