const chequeCTRL = {};

const Cheque = require('../models/Cheque');
const { validateCheque, validatePartialCheque } = require('../schemas/cheque.schema');

chequeCTRL.gestAll = async (req, res) => {

    const cheques = await Cheque.find();
    try {
        res.status(200).json({
            cheques,
            ok: true,
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable Con el Administrador'
        })
    }

};

chequeCTRL.postOne = async (req, res) => {

    const result = await validateCheque(req.body);

    console.log(result.error)

    if (!result.success) return res.status(400).json({
        msg: 'Error en el formato de los datos',
        errors: result.error,
        ok: false,
    });


    try {
        console.log(result.data)
        const cheque = new Cheque(result.data);
        await cheque.save();

        res.status(201).json({
            cheque,
            ok: true,
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable Con el Administrador'
        })
    }
};

chequeCTRL.patchOne = async (req, res) => {
    const result = await validatePartialCheque(req.body)

    if (!result.success) return res.status(400).json({
        msg: result.error,
        ok: false,
    });


    try {

        const { id } = req.params;

        const chequeUpdate = await Cheque.findByIdAndUpdate(id, result.data, { new: true });

        res.status(200).json({
            chequeUpdate,
            ok: true,
        });



    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable Con el Administrador'
        })
    }

};

chequeCTRL.deleteOne = async (req, res) => {

    const { id } = req.params;

    try {
        const chequeDelete = await Cheque.findByIdAndDelete(id);

        res.status(200).json({
            chequeDelete,
            ok: true,
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable Con el Administrador'
        })
    }
}


module.exports = chequeCTRL;