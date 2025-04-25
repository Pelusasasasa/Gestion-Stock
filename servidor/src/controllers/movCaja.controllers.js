const movCajaCTRL = {};

const MovCaja = require('../models/MovCaja');
const { validateMovCajaSchema, validatePartialMovCajaSchema } = require('../schemas/movCaja.schema');

movCajaCTRL.deleteOne = async (req, res) => {

    const { id } = req.params;

    try {

        const deleteMovCaja = await MovCaja.findOneAndDelete({ _id: id });

        res.status(200).json({
            ok: true,
            deleteMovCaja

        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: true,
            msg: 'No se pueod eliminar el movimiento',
            error: error
        })
    }

};

movCajaCTRL.getForDates = async (req, res) => {
    const { desde, hasta, tipo } = req.params;

    try {

        const movimientos = await MovCaja.find({
            $and: [
                { fecha: { $gte: new Date(desde + "T00:00:00.000Z") } },
                { fecha: { $lt: new Date(hasta + "T23:59:59.000Z") } }
            ]
        }).populate('tipo', ['nombre', 'tipo']);
        const movs = movimientos.filter(elem => elem.tipo.tipo === tipo);

        res.status(200).json({
            movs,
            ok: true
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se puede obtener los movimientos, hable con el administrador',
            error
        })
    }
}

movCajaCTRL.patchOne = async (req, res) => {
    const { id } = req.params;

    const result = await validatePartialMovCajaSchema(req.body);

    if (!result.success) return res.status(400).json({
        ok: false,
        msg: 'No se pudo modifciar el movimiento de caja',
        error: result.error
    });

    try {
        const updateMovCajaAux = await MovCaja.findOneAndUpdate({ _id: id }, result.data, { new: true });

        const updateMovCaja = await MovCaja.findById(updateMovCajaAux._id).populate('tipo', ['nombre', 'tipo']);

        res.status(200).json({
            ok: true,
            updateMovCaja
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se puedo modificar el movimiento de caja, hable con el administador',
            error: error
        })
    }
};

movCajaCTRL.postOne = async (req, res) => { 
    
    const result = await validateMovCajaSchema(req.body);

    console.log(result.error)
    

    if (!result.success) return res.status(400).json({
        ok: false,
        msg: 'No se pudo cargar el movimiento de caja',
        error: result.error
    });


    try {
        const newMov = new MovCaja(result.data);
        await newMov.save();

        const mov = await MovCaja.findOne({_id: newMov._id}).populate('tipo', ['nombre', 'tipo']);
        res.status(201).json({
            ok: true,
            mov
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se pudo cargar el mov, Hable con el administrador',
            error: error
        })
    }

};



module.exports = movCajaCTRL;