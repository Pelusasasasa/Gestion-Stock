const marcaCTRL = {};

const Marca = require('../models/Marca');

marcaCTRL.post = async(req, res) => {
    const marca = new Marca(req.body);
    
    await marca.save();

    res.send(marca);
};

marcaCTRL.getAll = async(req, res) => {
    const marcas = await Marca.find();

    res.send(marcas);
};

marcaCTRL.deleteForId = async(req, res) => {
    const { id } = req.params;

    const marca = await Marca.findByIdAndDelete(id);

    res.send(marca);
};

marcaCTRL.putForId = async(req, res) => {
    const { id } = req.params;

    const marca = await Marca.findByIdAndUpdate(id, req.body, {new: true});

    res.send(marca);
};

marcaCTRL.getForId = async(req, res) => {
    const { id } = req.params;

    const marca = await Marca.findById(id);

    res.send(marca);
};

marcaCTRL.getLast = async(req, res) => {
    const marca = await Marca.findOne().sort({$natural:-1});
    if (!marca){
        res.send(`0`);
    }else{
        res.send(marca.codigo);
    }
    
};


module.exports = marcaCTRL;