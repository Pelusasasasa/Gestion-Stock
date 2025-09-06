const Cliente = require("../models/Cliente");

exports.cambiarSaldoCliente = async(id, precio, recibo = false, tipo) => {

    try {
        const cliente = await Cliente.findById(id);

        if(!cliente) return {
            ok: false
        };

        if(recibo || tipo === 'Nota Credito A' || tipo === 'Nota Credito B'){
            cliente.saldo -= precio;
        }else{
            cliente.saldo += precio;
        }

        await cliente.save();

        return {
            ok: true,
            cliente
        };
        
    } catch (error) {
        console.error(error);
        return {
            ok: false
        }
    }

};