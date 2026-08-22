const tls = require('tls');
tls.DEFAULT_CIPHERS = 'DEFAULT@SECLEVEL=1';

const Afip = require('@afipsdk/afip.js');
const afip = new Afip({ CUIT: '27340150231' });

const tablaCondicionIVAReceptorId = (condicion) => {
  if (condicion === 'Consumidor Final') {
    return 5;
  } else if (condicion === 'Monotributo') {
    return 6;
  } else if (condicion === 'Exento') {
    return 4;
  } else {
    return 1;
  }
};

const generarQR = async(texto) => {
  const qrCode = require('qrcode');
  const url = `https://www.afip.gob.ar/fe/qr/?p=${texto}`;
  const QR = await qrCode.toDataURL(url);
  return QR;
}



const cargarFactura = async (venta, notaCredito) => {

  try{
    const fecha = venta.fecha;
  const puntoVenta = 2;
  const { AppServer, AuthServer, DbServer } = await afip.ElectronicBilling.getServerStatus();
  console.log('Estado del servidor');
  console.log({ AppServer, AuthServer, DbServer }); // mostramos el estado del servidor

  let ultimaElectronica = await afip.ElectronicBilling.getLastVoucher(puntoVenta, venta.cod_comp);
  console.log('La ultima electronica es:');
  console.log(ultimaElectronica);


  console.log('La factura anterior es:');
  console.log(parseFloat(venta.facturaAnterior));
  let aux = venta.condicionIva === 'Responsable Inscripto' ? 1 : 6;
  let ventaAnterior = venta.facturaAnterior && (await afip.ElectronicBilling.getVoucherInfo(parseFloat(venta.facturaAnterior), puntoVenta, aux));


  let data = {
    cantReg: 1,
    CbteTipo: venta.cod_comp,
    Concepto: 1,
    DocTipo: venta.cod_doc,
    DocNro: venta.num_doc,
    CbteDesde: ultimaElectronica + 1,
    CbteHasta: ultimaElectronica + 1,
    CbteFch: parseInt(fecha.replace(/-/g, '')),
    ImpTotal: venta.precio.toFixed(2),
    ImpTotConc: 0,
    ImpNeto: parseFloat((venta.gravado21 + venta.gravado105).toFixed(2)),
    ImpOpEx: 0,
    ImpIVA: parseFloat((venta.totalIva21 + venta.totalIva105).toFixed(2)),
    ImpTrib: 0,
    //'CondicionIVAReceptorId': tablaCondicionIVAReceptorId(venta.condicionIva),
    MonId: 'PES',
    PtoVta: puntoVenta,
    MonCotiz: 1,
    Iva: [],
  };
  
  notaCredito &&
    (data.CbtesAsoc = [
      {
        Tipo: ventaAnterior.CbteTipo,
        PtoVta: ventaAnterior.PtoVta,
        Nro: ventaAnterior.CbteHasta,
      },
    ]);

    venta.totalIva105 !== 0 &&
      data.Iva.push({
        Id: 4,
        BaseImp: venta.gravado105,
        Importe: venta.totalIva105,
      });

    venta.totalIva21 !== 0 &&
      data.Iva.push({
        Id: 5,
        BaseImp: venta.gravado21,
        Importe: venta.totalIva21,
      });

      console.log(data)
  const res = await afip.ElectronicBilling.createVoucher(data); //creamos la factura electronica
  
  console.log("Factura Cargada Correctamente")

  const qr = {
    ver: 1,
    fecha: fecha,
    cuit: '27340150231',
    ptoVta: puntoVenta,
    tipoCmp: venta.cod_comp,
    nroCmp: ultimaElectronica + 1,
    importe: data.ImpTotal,
    moneda: 'PES',
    ctz: 1,
    tipoDocRec: data.DocTipo,
    nroDocRec: parseInt(data.DocNro),
    tipoCodAut: 'E',
    codAut: parseFloat(res.CAE),
  };
  const textoQR = btoa(JSON.stringify(qr)); //codificamos lo que va en el QR
  const QR = await generarQR(textoQR);

  return {
    ok: true,
    puntoVenta: puntoVenta,
    QR,
    numero: ultimaElectronica + 1,
    cae: res.CAE,
    vencimiento: res.CAEFchVto,
  };
  }catch(error){
    console.log(error);
    return {
      ok: false,
      error: error.message,
    };
  }
};

module.exports = {
    cargarFactura
}