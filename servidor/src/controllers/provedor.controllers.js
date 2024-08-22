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