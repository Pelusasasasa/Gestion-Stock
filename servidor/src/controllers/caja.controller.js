const cajaCTRL = {};

const Venta = require('../models/Venta');
const Recibo = require('../models/Recibo');
const Presupuesto = require('../models/Presupuesto');


cajaCTRL.activar = async (req, res) => {
    try {

        const { tipo, id } = req.query;

        if(tipo === 'PP'){
            const presupuestoActivado = await Presupuesto.findByIdAndUpdate(id, { activo: true }, { new: true });

            if(presupuestoActivado){
                return res.status(200).json({
                    ok: true,
                    msg: 'Presupuesto activado'
                })
            };
        };


        if(tipo === 'RC'){
            const reciboActivado = await Recibo.findByIdAndUpdate(id, { activo: true }, { new: true });

            if(reciboActivado){
                return res.status(200).json({
                    ok: true,
                    msg: 'Recibo activado'
                })
            };
        }

        if (tipo === 'CC' || tipo === 'CD'){
            const ventaActivada = await Venta.findByIdAndUpdate(id, { activo: true }, { new: true });

            if(ventaActivada){
                return res.status(200).json({
                    ok: true,
                    msg: 'Venta activada'
                })
            };
        }
        
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error al activar la caja, hable con el administrador',
            error
        })
    }
};

cajaCTRL.desactivar = async (req, res) => {
    try {

        const { tipo, id } = req.query;

        if(tipo === 'PP'){
            const presupuestoDesactivado = await Presupuesto.findByIdAndUpdate(id, { activo: false }, { new: true });

            if(presupuestoDesactivado){
                return res.status(200).json({
                    ok: true,
                    msg: 'Presupuesto desactivado'
                })
            };
        };


        if(tipo === 'RC'){
            const reciboDesactivado = await Recibo.findByIdAndUpdate(id, { activo: false }, { new: true });

            if(reciboDesactivado){
                return res.status(200).json({
                    ok: true,
                    msg: 'Recibo desactivado'
                })
            };
        }

        if (tipo === 'CC' || tipo === 'CD'){
            const ventaDesactivada = await Venta.findByIdAndUpdate(id, { activo: false }, { new: true });

            if(ventaDesactivada){
                return res.status(200).json({
                    ok: true,
                    msg: 'Venta desactivada'
                })
            };
        }
        
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error al desactivar la caja, hable con el administrador',
            error
        })
    }
};

module.exports = cajaCTRL;