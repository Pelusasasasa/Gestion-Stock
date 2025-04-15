const tipoTarjetaCTRL = {};

const TipoTarjeta = require('../models/TipoTarjeta');

tipoTarjetaCTRL.postOne = async (req, res) => {
    const { nombre } = req.body;
    try {
        const tipo = new TipoTarjeta({ nombre });
        await tipo.save();

        res.status(201).json({
            ok: true,
            tipo
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

};

tipoTarjetaCTRL.getAll = async (req, res) => {

    try {
        const tipos = await TipoTarjeta.find().sort({ nombre: 1 });
        res.status(200).json({
            ok: true,
            tipos
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })

    }

};

tipoTarjetaCTRL.patchOne = async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;

    try {

        const tipo = await TipoTarjeta.findOne({ nombre: nombre });

        if (tipo) return res.status(400).json({
            ok: false,
            msg: ' Ya existe un tipo de tarjeta con ese nombre'
        })

        const updateTipo = await TipoTarjeta.findByIdAndUpdate(id, { nombre }, { new: true });

        res.status(200).json({
            ok: true,
            updateTipo
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador',
            error: error.errmsg
        })
    }
};

tipoTarjetaCTRL.deleteOne = async (req, res) => {
    const { id } = req.params;

    try {
        const deleteTipo = await TipoTarjeta.findByIdAndDelete(id);

        res.status(200).json({
            ok: true,
            deleteTipo
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: true,
            msg: 'Hable con el administrador'
        })
    }
};

module.exports = tipoTarjetaCTRL;