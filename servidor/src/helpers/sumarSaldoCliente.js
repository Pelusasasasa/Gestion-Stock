const Cliente = require("../models/Cliente");

exports.sumarSaldoCliente = async(id, precio) => {

    try {
        const cliente = await Cliente.findById(id);

        if(!cliente) return {
            ok: false
        };

        cliente.saldo += precio;

        await cliente.save();

        return {
            ok: true
        };
        
    } catch (error) {
        console.log(error);
        return {
            ok: false
        }
    }

};