const marcaCTRL = {};

const Marca = require('../models/Marca');

//Mandamos el ultimo numero de la marca
marcaCTRL.getLastNumero = async (req, res) => {
    const ultimaMarca = (await Marca.findOne().sort({$natural:-1}));

    const numero = ultimaMarca ? ultimaMarca.numero : 0;
    res.send(`${numero}`);
};

marcaCTRL.getMarcas = async (req, res) => {
    const marcas = await Marca.find();
    res.send(marcas);
};

marcaCTRL.postMarca = async (req, res) => {
    const marca = new Marca(req.body);
    await marca.save();

    res.send(`La marca ${marca.marca} Se Creo con exito`);
};

marcaCTRL.putMarca = async (req, res) => {
    const {numero} = req.params;
    await Marca.findOneAndUpdate({numero:numero},req.body);

    res.send(`La marca ${req.body.marca} Se Actualizo con exito`);
};

marcaCTRL.deleteMarca = async (req, res) => {

    await Marca.findOneAndDelete({numero:req.params.numero});

    res.send(`La marca ${req.params.numero} Se Elimino con exito`);

};

module.exports = marcaCTRL;