const saldoMensualCTRL = {};

const getSaldoInicial = require('../helpers/getSaldoInicial');
const SaldoMensual = require('../models/SaldoMensual');

saldoMensualCTRL.getSaldoInicial = async(req, res) => {
    const { mes } = req.params;
    const [anio, mesNum] = mes.split('-');

    const desde = new Date(`${anio}-${mesNum}-01T00:00:00.000Z`);
    const hasta = new Date(`${anio}-${parseInt(mesNum) + 1}-01T00:00:00.000Z`);

    try {
        const saldoInicial = await getSaldoInicial(mes);

        const movimientos = await Movimiento.find({
            fecha: { $gte: desde, $lt: hasta},
        }).sort({fecha: 1})

        let saldo = saldoInicial;
        const movsConSaldo = movimientos.map(mov => {
            saldo += mov.tipo === 'ingreso' ? mov.importe : -mov.importe;
            return {...mov.toObject(), saldo}
        })
    } catch (error) {
        
    }

    const respuesta = await getSaldoInicial('2025-04');

    res.send(`${respuesta}`)
};

module.exports = saldoMensualCTRL;