const funcion = {};

const pdf = require('html-pdf');

const fs = require('fs');
const path = require('path');

funcion.crearPDF = async (venta, productos) => {
  const { dolar, checkboxDolar } = venta;

  let html = fs.readFileSync(path.join(__dirname, '../html/pdf.html'), 'utf8');

  const puntoVenta = venta.afip.puntoVenta.toString().padStart(4, '0');
  const numero = venta.afip.numero.toString().padStart(8, '0');
  const letra = await verTipoFactura(venta.cod_comp);
  const fecha = venta.fecha.slice(0, 10).split('-', 3);

  //parte arriba
  html = html.replace('{{letra}}', letra);
  html = html.replace('{{codigo}}', 'Cod. ' + venta.cod_comp);
  html = html.replace('{{puntoVenta}}', puntoVenta);
  html = html.replace('{{factura}}', venta.tipo_comp);
  html = html.replace('{{numero}}', numero);
  html = html.replace('{{day}}', fecha[2]);
  html = html.replace('{{month}}', fecha[1]);
  html = html.replace('{{year}}', fecha[0]);

  //cliente
  html = html.replace('{{cliente}}', venta.cliente);
  html = html.replace('{{cuit}}', venta.num_doc.length === 11 ? 'CUIT' : 'DNI');
  html = html.replace('{{dni}}', venta.num_doc ? venta.num_doc : '00000000');
  html = html.replace('{{domicilio}}', venta.direccion ? venta.direccion + ' - ' + venta.localidad : 'Chajari');
  html = html.replace('{{clienteIva}}', venta.condicionIva ? venta.condicionIva : 'Consumidor Final');
  html = html.replace('{{condicionVenta}}', venta.tipo_venta === 'CC' ? 'Cuenta Corriente' : 'Contado');
  let tr = '';
  for await (let {_id, cantidad, precio, impuesto, descripcion, productoOriginal} of productos) {
    cantidad = parseFloat(cantidad)
    precio = parseFloat(precio)
    impuesto = parseFloat(impuesto)

    if (checkboxDolar) {
      precio = precio / dolar;
      impuesto = impuesto / dolar;
    }

    tr =
      tr +
      `
            <tr>
                <td>${_id ? _id : ''}</td>
                <td class="text-left">${descripcion}</td>
                <td class="text-end">${productoOriginal.unidad === 'horas' ? '' : cantidad.toFixed(2)}</td>
                <td class="text-end">${productoOriginal.unidad === 'horas' ? '' : venta.condicionIva === 'Inscripto' ? (precio / (impuesto / 100 + 1)).toFixed(2) : precio.toFixed(2)}</td>
                <td class="text-end">${impuesto ? impuesto.toFixed(2) : ''}</td>
                <td class="text-end">${venta.condicionIva === 'Inscripto' ? ((precio / (impuesto / 100 + 1)) * cantidad).toFixed(2) : (precio * cantidad).toFixed(2)}</td>
            </tr>
        `;
  }

  html = html.replace('{{tr}}', tr);

  //qr
  html = html.replace('{{qr}}', venta.afip.QR);

  //cae
  html = html.replace('{{cae}}', venta.afip.cae);
  html = html.replace('{{fechaCae}}', venta.afip.vencimiento);
  html = html.replace('{{tipoCambio}}', checkboxDolar ? `Tipo de Cambio: ${dolar.toFixed(2)}` : '');

  //total
  if (checkboxDolar) {
    venta.precio = venta.precio / dolar;
    venta.totalIva21 = venta.totalIva21 / dolar;
    venta.totalIva105 = venta.totalIva105 / dolar;
    venta.descuento = venta.descuento / dolar;
  }
  html = html.replace(
    '{{subTotal}}',
    venta.condicionIva === 'Responsable Inscripto' ? (checkboxDolar ? 'U$S ' : '$ ') + (venta.precio - venta.totalIva21 - venta.totalIva105).toFixed(2) : (checkboxDolar ? 'U$S ' : '$ ') + venta.precio.toFixed(2),
  );
  html = html.replace('{{iva21}}', venta.condicionIva === 'Responsable Inscripto' ? `IVA 21%: ${venta.totalIva21.toFixed(2)} ` : '');
  html = html.replace('{{iva105}}', venta.condicionIva === 'Responsable Inscripto' ? `IVA 10.5% ${venta.totalIva105.toFixed(2)} ` : '');
  html = html.replace('{{descuento}}', venta.descuento ?? 0);
  html = html.replace('{{total}}', (checkboxDolar ? 'U$S ' : '$ ') + venta.precio.toFixed(2));
  html = html.replace('{{pesosArgentinos}}', checkboxDolar ? '$ ' + (venta.precio * dolar).toFixed(2) : venta.precio.toFixed(2));

  const config = {
    height: '15.5in',
    width: '10in',
    format: 'A4',
    type: 'pdf',
    // "zoomFactor": "0.65"
  };
  pdf.create(html, config).toFile(`pdfs/${venta.cliente}--${puntoVenta}-${numero}.pdf`, (err, res) => {
    if (err) {
      console.error(err);
    } else {
      console.log(res);
    }
  });
};

const verTipoFactura = (codigo) => {
  if (codigo === 11) {
    return 'C';
  } else if (codigo === 1 || codigo === 3) {
    return 'A';
  } else if (codigo === 6 || codigo === 8) {
    return 'B';
  }
  return '';
};
module.exports = funcion;
