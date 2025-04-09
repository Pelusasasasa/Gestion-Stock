const provedorCTRL = {};

const Provedor = require('../models/Provedor');
const { validateProvedor } = require('../schemas/provedores.schema');

provedorCTRL.deleteProvedor = async (req, res) => {

    const { id } = req.params;

    try {
        const provedorDelete = await Provedor.findByIdAndDelete(id);

        res.status(200).json({
            ok: true,
            provedorDelete
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: error.message
        })
    }
};

provedorCTRL.getProvedor = async (req, res) => {

    const { id } = req.params;

    const provedor = await Provedor.findById(id);

    res.send(provedor);

};

provedorCTRL.getProvedores = async (req, res) => {
    try {

        const provedores = await Provedor.find();

        res.status(200).json({
            ok: true,
            provedores
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

};

provedorCTRL.getProvedoresForText = async (req, res) => {
    const { text } = req.params;

    let re = new RegExp(`^${text}`);

    let provedores = [];

    if (text === 'NADA') {
        provedores = await Provedor.find();
    } else {
        provedores = await Provedor.find({
            $or: [
                { codigo: { $regex: re, $options: 'i' } },
                { nombre: { $regex: re, $options: 'i' } },
                { cuit: { $regex: re, $options: 'i' } }
            ]
        });
    }

    res.send(provedores);
};

provedorCTRL.postProvedor = async (req, res) => {

    const result = await validateProvedor(req.body);

    if (!result.success) return res.status(400).json({
        ok: false,
        msg: result.error
    });

    try {
        const provedor = new Provedor(result.data);
        await provedor.save();

        res.status(201).json({
            provedor,
            ok: true
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

};

provedorCTRL.patchProvedor = async (req, res) => {
    const { id } = req.params;

    try {
        const updateProvedor = await Provedor.findByIdAndUpdate(id, req.body, { new: true });

        res.status(200).json({
            ok: true,
            updateProvedor
        })
    } catch (error) {
        console.log(error)
        res.send({
            msg: error.message,
            ok: false
        })
    }
};

module.exports = provedorCTRL;