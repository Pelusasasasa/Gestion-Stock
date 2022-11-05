const vendedorCTRL = {};

const Vendedor = require('../models/Vendedor');

vendedorCTRL.getAll = async(req,res)=>{
    const vendedores = await Vendedor.find();
    res.send(JSON.stringify(vendedores));
}

vendedorCTRL.post = async(req,res)=>{
    const vendedor = new Vendedor(req.body);
    await vendedor.save();
    console.log(`Vendedor ${req.body.nombre} Cargado`);
    res.send(`Vendedor ${req.body.nombre} Cargado`);
};

vendedorCTRL.getForId = async(req,res)=>{
    const {id} = req.params;
    const vendedor = await Vendedor.findOne({_id:id});
    res.send(JSON.stringify(vendedor))
}

vendedorCTRL.putForId = async(req,res)=>{
    const {id} = req.params;
    await Vendedor.findOneAndUpdate({_id:id},req.body);
    console.log(`${req.codigo.nombre} con codigo ${req.body.codigo}`);
    res.send(`${req.codigo.nombre} con codigo ${req.body.codigo}`);
}

vendedorCTRL.deleteForId = async(req,res)=>{
    const {id} = req.params;
    await Vendedor.findOneAndDelete({_id:id});
    res.end();
}


module.exports = vendedorCTRL