const provedorCTRL = {};

const Provedor = require('../models/Provedor');

provedorCTRL.deleteProvedor = async(req, res) => {

    const { id } = req.params;

    const provedor = await Provedor.findByIdAndDelete(id);

    res.send( provedor );

};

provedorCTRL.getProvedor = async(req, res) => {

    const { id } = req.params;

    const provedor = await Provedor.findById(id);

    res.send( provedor );

};

provedorCTRL.getProvedores = async(req, res) => {

    const provedores = await Provedor.find();

    res.send(provedores);

};

provedorCTRL.getProvedoresForText = async(req, res) => {
    const { text } = req.params;

    let re = new RegExp(`^${text}`);

    let provedores = [];

    if (text === 'NADA'){
        provedores = await Provedor.find();
    }else{
        provedores = await Provedor.find({
                $or: [
                    {codigo: {$regex: re, $options:'i'}},
                    {nombre: {$regex: re, $options:'i'}},
                    {cuit: {$regex: re, $options:'i'}}
                ]
            });
    }    

    res.send( provedores );
};

provedorCTRL.postProvedor = async(req, res) => {

    const provedor = new Provedor(req.body);
    await provedor.save();

    res.send(provedor);

};

provedorCTRL.putProvedor = async(req, res) => {
    const { id } = req.params;

    const provedor = await Provedor.findByIdAndUpdate(id, req.body);

    res.send( provedor );
};

module.exports = provedorCTRL;