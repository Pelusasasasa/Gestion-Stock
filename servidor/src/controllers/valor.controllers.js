const valorCTRL = {};

const Valor = require('../models/Valor');

valorCTRL.deleteOne = async(req, res) => {

    const { id } = req.params;

    try {

        const deleteValor = await Valor.findByIdAndDelete(id);

        res.status(200).json({
            ok: true,
            deleteValor
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

};

valorCTRL.getAll = async(req, res) => {

    try {
        const valores = await Valor.find({}).sort({createdAt: -1});
        res.status(200).json({
            ok: true,
            valores
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

};

valorCTRL.patchOne = async(req, res) => {
    const {id} = req.params;
    const {nombre, importe, icono, vendedor, pc } = req.body;

    auxValor = {nombre, importe, icono, vendedor, pc};

    try {
        const updateValor = await Valor.findByIdAndUpdate(id, auxValor, {new: true});

        res.status(200).json({
            ok: true,
            updateValor
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
};

valorCTRL.postOne = async(req, res) => {
    const {nombre, importe, icono = '', vendedor, pc} = req.body;


    try {
        const valor = new Valor({nombre, importe, icono, vendedor, pc});

        await valor.save();

        res.status(201).json({
            ok: true,
            valor
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
};


module.exports = valorCTRL;