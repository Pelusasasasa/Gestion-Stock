const cuentaCorrComp = require("../models/cuentaCorrComp");

exports.crearCompensada = async(venta) => {
    const precio = venta.tipo_comp === 'Nota Credito B' || venta.tipo_comp === 'Nota Credito A' ? venta.precio * -1 : venta.precio;
    try {
        const compensada = {};
        compensada.fecha = venta.fecha;
        compensada.cliente = venta.cliente;
        compensada.idCliente = venta.idCliente;
        compensada.nro_venta = venta.numero;
        compensada.importe = precio;
        compensada.pagado = 0;
        compensada.saldo = precio;
        compensada.condicion = venta.condicion; //Esto Puede ser NORMAL o INSTALADOR
        compensada.tipo_comp = venta.tipo_comp;
        compensada.observaciones = venta.observaciones;

        const nuevaCompensada = new cuentaCorrComp(compensada);
        await nuevaCompensada.save();
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}