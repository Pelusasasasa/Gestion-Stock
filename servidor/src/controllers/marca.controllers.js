const marcaCTRL = {};

const Marca = require('../models/Marca');

marcaCTRL.post = async(req, res) => {
    try {
        const marca = new Marca(req.body);
    
        await marca.save();

        res.status(200).json({
            ok: true,
            msg: 'Marca cargada correctamente'
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al cargar la marca'
        })
    }
};

marcaCTRL.getAll = async(req, res) => {
    try {
        const { texto } = req.query;
        let marcas;
        if(texto){
            const regex = new RegExp(texto, 'i');
            marcas = await Marca.find({ nombre: regex });
            console.log(marcas)
        }else{
            marcas = await Marca.find();
        }

        res.status(200).json({
            ok: true,
            marcas
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener las marcas'
        })
    }
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