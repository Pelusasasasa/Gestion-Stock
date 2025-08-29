const Numero = require("../models/Numero")

const initNumero = async() => {
    try {
        const existe = await Numero.findOne({});

        if(!existe){
            await Numero.create({
                "Cuenta Corriente": 0,
                Contado: 0,
                Recibo: 0,
                Presupuesto: 0,
                Remito: 0,
                Dolar: 0,
                dolarInstalador: 0,
                Servicio: 0
            });
            console.log('✅ Numero por defecto creado');
        }else{
            console.log('ℹ️ Numero por defecto ya existe');
        }
    } catch (error) {
        console.error(`❌ error al cargar el numero por defecto: ${error}`)
    };
};

module.exports = initNumero;