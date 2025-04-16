const tipoCuentaCTRL = {};

const TipoCuenta = require('../models/TipoCuenta');

tipoCuentaCTRL.deleteOne = async (req, res) => {
    const { id } = req.params;

    try {
        const tipoCuentaDelete = await TipoCuenta.findByIdAndDelete(id);

        res.status(200).json({
            ok: true,
            tipoCuentaDelete
        });
    } catch (error) {
        res.status(500).json({
            msg: 'No se pudo eliminar el tipo de cuenta, hable con el administrador',
            ok: false
        })
    }
};

tipoCuentaCTRL.getAll = async (req, res) => {

    try {
        const tipoCuentas = await TipoCuenta.find();

        res.status(200).json({
            ok: true,
            tipoCuentas
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se pudo obtener los tipos de cuenta, hable con el administrador'
        });
    }

};

tipoCuentaCTRL.patchOne = async (req, res) => {

    const { id } = req.params;
    const { nombre, tipo } = req.body;

    try {

        const tipoUsado = await TipoCuenta.findOne({ _id: id });

        if (tipoUsado) return res.status({
            ok: false,
            msg: 'Ya existe un tipo de cuenta con ese nombre'
        });

        const updateTipoCuenta = await TipoCuenta.findByIdAndUpdate(id, { nombre, tipo }, { new: true });

        res.status(200).json({
            ok: true,
            updateTipoCuenta
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se pudo modificar el tipo de cuenta, hable con el administrador'
        })
    }

};

tipoCuentaCTRL.postOne = async (req, res) => {
    try {

        const { nombre, tipo } = req.body;

        const tipoUsado = await TipoCuenta.findOne({ nombre });

        if (tipoUsado) return res.status(400).json({
            ok: false,
            msg: 'Ya existe una cuenta con ese nombre'
        });


        const tipoCuenta = new TipoCuenta({ nombre, tipo });
        await tipoCuenta.save();

        res.status(201).json({
            ok: true,
            tipoCuenta
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se pudo cargar el tipo de cuenta, hable con el administrador'
        });
    }
};

module.exports = tipoCuentaCTRL;