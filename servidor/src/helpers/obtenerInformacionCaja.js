const Gasto = require("../models/Gasto");
const Recibo = require("../models/Recibo");
const Venta = require("../models/Venta");

exports.traerInformacionCajaDelDia = async(req, res) => {
    const { fecha } = req.params;
    try {
        const fechaBase = new Date(`${fecha}T00:00:00-03:00`);
        const inicioDia = new Date(fechaBase);
        const finDia = new Date(fechaBase);
        finDia.setHours(23, 59, 59, 999);

        const ventas = await Venta.find({
            $and: [
                {fecha: {$gte: inicioDia}},
                {fecha: {$lte: finDia}}
            ]
        }).populate('vendedor', 'nombre');

        const recibos = await Recibo.find({
            $and: [
                {fecha: {$gte: inicioDia}},
                {fecha: {$lte: finDia}}
            ]
        });

        const gastos = await Gasto.find({
            $and: [
                {fecha: {$gte: inicioDia}},
                {fecha: {$lte: finDia}}
            ]
        });

        res.status(200).json({
            ok: true,
            ventas: ventas,
            recibos: recibos,
            gastos: gastos
        });
        
    } catch (error) {
        console.error("Error al traer la información de la caja del día:", error);
        res.status(500).json({ 
            ok: false,
            msg: "Error al obtener la información de la caja del día" 
        });
    }


};

exports.traerInformacionCajaDelMes = async(req, res) => {
    const { month } = req.params;
    let mes = parseInt(month);

    mes = mes > 12 ? 1 : mes;

    try {
        const ventas = await Venta.find({
            $expr: { $eq: [{ $month: "$fecha" }, mes] }
        }).populate('vendedor', 'nombre');

        const recibos = await Venta.find({
            $expr: { $eq: [{ $month: "$fecha" }, mes] }
        }).populate('vendedor', 'nombre');

        res.status(200).json({
            ok: true,
            ventas: ventas,
            recibos: recibos
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener la información de la caja del mes'
        })
    }
};


exports.traerInformacionCajaDelAnio = async(req, res) => {
    const { year } = req.params;
    try {
        const ventas = await Venta.find({
            $expr: { $eq: [{ $year: "$fecha" }, year] }
        }).populate('vendedor', 'nombre');

        const recibos = await Recibo.find({
            $expr: { $eq: [{ $year: "$fecha" }, year] }
        })//.populate('vendedor', 'nombre');


        res.status(200).json({
            ok: true,
            ventas: ventas,
            recibos: recibos
        });
    } catch (error) {
        console.error("Error al traer la información de la caja del año:", error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener la información de la caja del año"
        });
    }

};