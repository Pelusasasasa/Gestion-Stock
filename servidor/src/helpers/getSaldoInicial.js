const MovCaja = require("../models/MovCaja");
const SaldoMensual = require("../models/SaldoMensual");

async function getSaldoInicial(mes){
    const existente = await SaldoMensual.findOne({ mes });

    if(existente) return existente.saldo;

    const [anio, mesNum] = mes.split('-');

    const desde = new Date(`${anio}-${mesNum}-01T00:00:00.000Z`);

    const saldoCalculado = await MovCaja.aggregate([
        {$match: {fecha: {$lt: desde }}},
        {
            $group: {
                _id: null,
                saldo: {
                    $sum: {
                        $cond: [
                            {$eq: ['$tipo', 'ingreso']},
                            '$importe',
                            {$multiply: ['$importe', -1]}
                        ]
                    }
                }
            }
        }
    ]);

    const saldo = saldoCalculado[0]?.saldo || 0;
    
    await SaldoMensual.create({mes, saldo});

    return saldo;
};

module.exports = getSaldoInicial;