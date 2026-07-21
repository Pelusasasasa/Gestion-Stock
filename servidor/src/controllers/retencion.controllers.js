const Retencion = require("../models/Retencion");

const cargarRetencion = async (req, res) => {
    try {
        const newRetencion = new Retencion(req.body);
        await newRetencion.save();

        res.status(201).json({
            ok: true,
            retencion: newRetencion
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error del servidor al cargar retencion, hable con el administrador'
        })
    }

};

module.exports = {
    cargarRetencion
};