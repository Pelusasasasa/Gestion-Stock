const Cliente = require("../models/Cliente");

exports.cambiarSaldoCliente = async(id, precio, recibo = false) => {

    try {
        const cliente = await Cliente.findById(id);

        if(!cliente) return {
            ok: false
        };

        if(recibo){
            cliente.saldo -= precio;
        }else{
            cliente.saldo += precio;
        }

        await cliente.save();

        return {
            ok: true
        };
        
    } catch (error) {
        console.error(error);
        return {
            ok: false
        }
    }

};