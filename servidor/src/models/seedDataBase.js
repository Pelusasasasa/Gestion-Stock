const {  Schema, model } = require("mongoose");
const TipoCuenta = require('../models/TipoCuenta');
const seedTipoCuenta = async() => {

    const Migration = model('Migration', new Schema({
        name: String,
        executedAt: { type: Date, default: Date.now}
    }));

    const migrationName = 'inicial_tipo_cuenta';
    const alreadyExecuted = await Migration.findOne({name: migrationName});

    if(!alreadyExecuted){
        await TipoCuenta.create({
            nombre: 'Factura A',
            tipo: 'I'
        });

        await TipoCuenta.create({
            nombre: 'Factura B',
            tipo: 'I'
        });

        await TipoCuenta.create({
            nombre: 'Factura C',
            tipo: 'I'
        });

        await TipoCuenta.create({
            nombre: 'Recibo',
            tipo: 'I'
        });

        await TipoCuenta.create({
            nombre: 'Presupuesto',
            tipo: 'I'
        });

        await Migration.create({
            name: migrationName
        });

        console.log('Datos Iniciales Creados')
    }

};


module.exports = seedTipoCuenta