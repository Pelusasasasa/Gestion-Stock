const cuentaCorrComp = require("../models/cuentaCorrComp");

exports.actualizarCompensadas = async(lista, recibo) => {
    let bandera = true;
    let total = recibo.precio || 0;
    let compensadas = [];
    for(let elem of lista){
        
        try {
            const compensada = await cuentaCorrComp.findOne({nro_venta: elem.numero});
            compensada.pagado = compensada.pagado + elem.pagado;
            compensada.saldo = compensada.saldo - elem.pagado;
            total -= elem.pagado;

            await compensada.save();
            compensadas.push(compensada);
        } catch (error) {
            console.error(error);
            bandera = false;
        };
    };

    if(total > 0){
        try {
            const compensada = {};
            compensada.fecha = recibo.fecha;
            compensada.condicion = "Normal";
            compensada.tipo_comp = recibo.tipo_comp.toUpperCase();
            compensada.cliente = recibo.cliente;
            compensada.idCliente = recibo.idCliente;
            compensada.nro_venta = recibo.numero;
            compensada.importe = -total;
            compensada.pagado = total;
            compensada.saldo = -total;


            const nuevaCompensada = new cuentaCorrComp(compensada);
            await nuevaCompensada.save();
            compensadas.push(nuevaCompensada);
        } catch (error) {
            console.error(error);
            bandera = false;
        }
    };
    return {
        ok: bandera,
        compensadas
    };
};