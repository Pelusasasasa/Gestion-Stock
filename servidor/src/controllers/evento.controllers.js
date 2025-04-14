const eventoCTRL = {};


const Evento = require('../models/Evento');
const { validateEvento, validatePartialEvento } = require('../schemas/evento.schema');

eventoCTRL.deleteOne = async (req, res) => {
    const { id } = req.params;

    try {
        const deleteEvento = await Evento.findByIdAndDelete(id);

        if (!deleteEvento) return res.status(404).json({
            ok: false,
            msg: 'No se encontro un evento con ese id'
        });


        res.status(200).json({
            ok: true,
            deleteEvento
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: ' No se pudo eliminar el evento, hable con el administrador'
        })
    }
};

eventoCTRL.getForMonth = async (req, res) => {
    const { month, year } = req.params;

    try {

        const startOfMonth = new Date(year, month, 1);
        const endOfMonth = new Date(year, parseFloat(month) + 1, 1);

        const eventos = await Evento.find({
            start_date: {
                $gte: startOfMonth,
                $lt: endOfMonth
            }
        }).populate('category', ['nombre', 'color']);

        res.status(200).json({
            ok: true,
            eventos
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se puo obtener los datos, hable con el administrador'
        })
    }

};

eventoCTRL.patchOne = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await validatePartialEvento(req.body);

        if (!result.success) return res.status(404).json({
            ok: false,
            msg: 'No se pudo modificar el evento',
            errors: result.error
        });

        const returnEvento = await Evento.findByIdAndUpdate(id, result.data, { new: true });

        if (!returnEvento) return res.status(404).json({
            ok: false,
            msg: 'No existe evento con ese id'
        });

        const updateEvento = await Evento.findOne({ _id: returnEvento._id }).populate('category', ['nombre', 'color']);

        res.status(200).json({
            ok: true,
            updateEvento
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se pudo modificar el evento, hablar con el administrador'
        })
    }

};

eventoCTRL.postOne = async (req, res) => {

    try {
        const result = await validateEvento(req.body);

        if (!result.success) return res.status(400).json({
            ok: false,
            msg: 'Error en la validacion',
            errors: result.error
        });

        const eventoAux = new Evento(result.data);
        await eventoAux.save();

        const evento = await Evento.findOne({ _id: eventoAux._id }).populate('category', ['nombre', 'color']);

        res.status(201).json({
            ok: true,
            evento
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se puedo cargar el evento, hable con el administrador'
        })
    }

};

module.exports = eventoCTRL;