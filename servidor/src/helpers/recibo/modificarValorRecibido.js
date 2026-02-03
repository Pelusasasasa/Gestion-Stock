const Recibo = require('../../models/Recibo');
const CuentaCompensada = require('../../models/cuentaCorrComp');
const Historica = require('../../models/cuentaCorrHisto');

const modificarValorRecibido = async (comprobanteNumero, tipoPago) => {
  let comprobante;
  try {
    comprobante = await Recibo.findById(comprobanteNumero);
    comprobante.valorRecibido = tipoPago;
    await comprobante.save();
  } catch (error) {
    console.error(error);
  }

  try {
    const chComprobante = await Historica.findOneAndUpdate({ nro_venta: comprobante.numero, tipo_comp: comprobante.tipo_comp }, { condicion: tipoPago }, { new: true });
    console.log(chComprobante);
  } catch (error) {
    console.error(error);
  }
};

module.exports = modificarValorRecibido;
