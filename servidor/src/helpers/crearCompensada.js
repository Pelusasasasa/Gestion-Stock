const cuentaCorrComp = require("../models/cuentaCorrComp");

exports.crearCompensada = async(venta) => {

    try {
        const compensada = {};
        compensada.fecha = venta.fecha;
        compensada.cliente = venta.cliente;
        compensada.idCliente = venta.idCliente;
        compensada.nro_venta = venta.numero;
        compensada.importe = venta.precio;
        compensada.pagado = 0;
        compensada.saldo = venta.precio;
        compensada.condicion = venta.condicion; //Esto Puede ser NORMAL o INSTALADOR
        compensada.tipo_comp = venta.tipo_comp;
        compensada.observaciones = venta.observaciones;

        const nuevaCompensada = new cuentaCorrComp(compensada);
        await nuevaCompensada.save();
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}