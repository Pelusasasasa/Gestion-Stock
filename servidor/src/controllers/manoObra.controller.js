const ManoObra = require('../models/ManoObra')

const manoObraCtrl = {};

manoObraCtrl.getManoDeObras = async(req, res) => {
    try {
        const { activo } = req.query;
        
        const manoObras = await ManoObra.find({activo})
        .populate('cliente_id', 'nombre')
        .populate('vendedor_id', 'nombre')
        .populate('operarios', 'nombre codigo')

        res.status(200).json({
            ok: true,
            manoObras
        });
    } catch (error) {
        console.error(error)
        return res.status(500).json({ ok: false,
            msg: 'Error interno del servidor' })
    }
};

manoObraCtrl.postManoObra = async(req, res ) => {
    try {
        const { cliente_id, vendedor_id, tipo, segmento_id, fecha, horas, descripcion, estado, operarios} = req.body;

        const lastMano = await ManoObra.findOne().sort({ numero: -1 });
        const nextNumero = lastMano ? lastMano.numero + 1 : 1;
        

        const manoObra = new ManoObra({
            numero: nextNumero,
            cliente_id,
            vendedor_id,
            tipo,
            segmento_id,
            fecha,
            horas,
            descripcion,
            estado,
            created: new Date(),
            activo: true,
            operarios,
        })

        await manoObra.save();

        return res.status(201).json({
            ok: true,
            manoObra
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ ok: false,
            msg: 'Error interno del servidor' })
    }
};

manoObraCtrl.deleteManoObra = async(req, res) => {
    try {
        const { id } = req.params;


        const manoObra = await ManoObra.findByIdAndUpdate({_id: id}, {
            activo: false
        });

        if(!manoObra){
            return res.status(404).json({
                ok: false,
                msg: 'Mano de obra no encontrada'
            })
        }

        await manoObra.save();

        return res.status(200).json({
            ok: true,
            manoObra
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        })
    }
}

module.exports = manoObraCtrl;