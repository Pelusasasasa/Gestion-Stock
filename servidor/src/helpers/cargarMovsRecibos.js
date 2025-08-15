const MovRecibos = require("../models/MovRecibos");

exports.cargarMovsRecibos = async(lista, numeroRecibo) => {
    let movs = [];
    let bandera = true;
    for(let elem of lista){
        try {
            const movRecibo = {};
            movRecibo.idCliente = elem.idCliente;
            movRecibo.cliente = elem.cliente;
            movRecibo.tipo = elem.tipo_comp
            movRecibo.tipo_comp = 'Recibo';
            movRecibo.numero = elem.nro_venta;
            movRecibo.numeroRecibo = numeroRecibo;
            movRecibo.importe = elem.importe;
            movRecibo.precio = elem.pagado;
            movRecibo.saldo = elem.saldo;

            const nuevoMovRecibo = MovRecibos(movRecibo);
            await nuevoMovRecibo.save();

            movs.push(nuevoMovRecibo);
        } catch (error) {
            console.error(error);
            bandera = false;
        }
    };

    return {
        ok: bandera,
        movs
    }

};