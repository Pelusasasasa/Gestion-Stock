const provedorCTRL = {};

const Provedor = require('../models/Provedor');

provedorCTRL.getLastNumero = async(req, res) => {
    const ultimoProvedor = await Provedor.findOne().sort({numero: -1});

    const last = ultimoProvedor ? ultimoProvedor.numero : 0;

    res.json(`${last}`);
};

provedorCTRL.getProvedores = async (req, res) => {
    const provedores = await Provedor.find();
    res.send(provedores);
};

provedorCTRL.getProvedor = async (req, res) => {
    const {numero} = req.params;
    const provedor = await Provedor.findOne({numero: numero});
    res.send(provedor);
}

provedorCTRL.postProvedor = async (req, res) => {

    const provedor = new Provedor(req.body);
    await provedor.save();

    res.send(provedor);
};

provedorCTRL.putProvedor = async (req, res) => {

    const {numero} = req.params;
    const provedor = await Provedor.findOneAndUpdate({numero:numero},req.body);
    res.send(`Provedor ${provedor.provedor} actualizado con exito a ${req.body.provedor.toUpperCase()}`);
};

provedorCTRL.deleteProvedor = async (req, res) => {
    const {numero} = req.params;
    const provedor = await Provedor.findOneAndDelete({numero: numero});
    res.send(`Provedor ${provedor.provedor} eliminado con exito`);
};

module.exports = provedorCTRL;