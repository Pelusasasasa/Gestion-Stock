const tarjetaCTRL = {};

const Tarjeta = require('../models/Tarjeta');
const { validateTarjeta, validatePartialTarjeta } = require('../schemas/tarjeta.schema');

tarjetaCTRL.postOne = async (req, res) => {
    try {

        const result = await validateTarjeta(req.body);
        console.log(result);
        if (!result.success) return res.status(400).json({
            ok: false,
            msg: JSON.parse(result.error)
        })

        const tarjeta = new Tarjeta(result.data);

        await tarjeta.save();

        res.status(201).json({
            ok: true,
            tarjeta
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
};

tarjetaCTRL.getAll = async (req, res) => {
    try {
        const tarjetas = await Tarjeta.find();

        res.status(200).json({
            ok: true,
            tarjetas
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
};

tarjetaCTRL.patchOne = async (req, res) => {
    const { id } = req.params;

    const result = validatePartialTarjeta(req.body);

    if (!result.success) return res.status(400).json({
        ok: false,
        error: JSON.parse(result.error)
    });

    try {
        const tarjetaUpdate = await Tarjeta.findByIdAndUpdate(id, result.data, { new: true });

        res.status(200).json({
            ok: true,
            tarjeta: tarjetaUpdate
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
};

tarjetaCTRL.deleteOne = async (req, res) => {
    const { id } = req.params;

    try {
        const deleteTarjeta = await Tarjeta.findOneAndDelete(id);

        res.status(200).json({
            ok: true,
            deleteTarjeta
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
};



module.exports = tarjetaCTRL;