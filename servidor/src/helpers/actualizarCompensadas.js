const cuentaCorrComp = require("../models/cuentaCorrComp");

exports.actualizarCompensadas = async(lista) => {
    let bandera = true;
    let compensadas = [];
    for(let elem of lista){
        
       try {
            const compensada = await cuentaCorrComp .findOne({nro_venta: elem.numero});
            compensada.pagado = compensada.pagado + elem.pagado;
            compensada.saldo = compensada.saldo - elem.pagado;

            await compensada.save();
            compensadas.push(compensada);
       } catch (error) {
        console.log(error);
        bandera = false;
       }
    }

    return {
        ok: bandera,
        compensadas
    };
};