const remitoCTRL = {}

const { actualizarNumero } = require('../helpers/actualizarNumero');
const { crearMovimientosStock } = require('../helpers/crearMovimientosStock');
const { crearMovimientoVendedores } = require('../helpers/crearMovimientoVendedores');
const { descontarStock } = require('../helpers/descontarStock');
const Remito = require('../models/Remito');

remitoCTRL.getAll = async(req, res) => {
    const remitos = await Remito.find();

    res.send(remitos);
};

remitoCTRL.getforid = async(req, res) => {
    const { id } = req.params;

    try {
        const remito = await Remito.findById(id)
            .populate('vendedor', 'nombre');

        res.status(200).json({
            remito,
            ok: true
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'No se pudo obtener el remito, hable con el administrador'
        })
    };
};

remitoCTRL.postOne = async(req, res) => {
    try {
        const remito = new Remito(req.body);

        const numeroActualizado = await actualizarNumero(remito.tipo_venta);
        if(numeroActualizado.ok){
            remito.numero = numeroActualizado.numero;
        };

        const stockDescontado = await descontarStock(req.body.listaProductos);
        if(!stockDescontado) return res.status(400).json({
            ok: false,
            msg: "Error al descontar el stock"
        });

        const movimientos = await crearMovimientosStock(req.body.listaProductos, remito);
        if(!movimientos) return res.status(400).json({
            ok: false,
            msg: "Error al crear los movimientos"
        });

        await remito.save();

        await crearMovimientoVendedores(`Se hizo un remito al cliente ${remito.cliente}`, remito.vendedor);

        const nuevoRemito = await Remito.findOne({_id:remito._id})
            .populate('vendedor', 'nombre');
        
        res.status(201).json({
            ok: true,
            venta: nuevoRemito,
            movimientos,
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al cargar el remito, hable con el administrador"
        });
    }
};

remitoCTRL.putPasado = async(req, res) => {
    const { id } = req.params;

    try {
        const remito = await Remito.findOneAndUpdate({_id: id,},{
        $set: {
            pasado: true
            }
        });


        if(!remito) return res.status(400).json({
            ok: false,
            msg: "No se pudo actualizar el remito"
        });

        res.status(200).json({
            ok: true,
            remito
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error al actualizar el remito, hable con el administrador"
        });
    };
};

module.exports = remitoCTRL;