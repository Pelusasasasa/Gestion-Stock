const Cliente = require("../models/Cliente");

exports.cambiarSaldoCliente = async(id, precio, recibo = false, tipo) => {

    try {
        const cliente = await Cliente.findById(id);

        if(!cliente) return {
            ok: false
        };

        if(recibo || tipo === 'Nota Credito A' || tipo === 'Nota Credito B'){
            cliente.saldo -= precio;

            cliente.saldo = Number(cliente.saldo.toFixed(2));
        }else{
            cliente.saldo += precio;
            cliente.saldo = Number(cliente.saldo.toFixed(2));
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