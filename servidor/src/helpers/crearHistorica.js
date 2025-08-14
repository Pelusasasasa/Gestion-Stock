const Cliente = require("../models/Cliente");
const Historica = require("../models/cuentaCorrHisto");

exports.crearHistorica = async(venta) => {

    try {
        const cliente = await Cliente.findById(venta.idCliente)

        const historica = {};
        historica.fecha = venta.fecha;
        historica.cliente = venta.cliente;
        historica.idCliente = venta.idCliente;
        historica.nro_venta = venta.numero;
        historica.tipo_comp = venta.tipo_comp;
        historica.debe = venta.precio;
        historica.haber = 0;
        historica.saldo = cliente.saldo;
        historica.condicion = venta.condicion; //Puede ser NORMAL o  INSTALADOR
        historica.observaciones = venta.observaciones;

        const nuevaHistorica = new Historica(historica);
        await nuevaHistorica.save();
        return true;
    } catch (error) {
        console.error(error);
        return false;
    };
};