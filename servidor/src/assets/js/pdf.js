const funcion = {};

const pdf = require('html-pdf');

const fs = require('fs');
const path = require('path');

funcion.crearPDF = async (venta, productos = []) => {
  return new Promise((resolve, reject) => {
    try{
      
  
    const { dolar, checkboxDolar } = venta;

    let html = fs.readFileSync(path.join(__dirname, '../html/pdf.html'), 'utf8');

    //Fecha
    const d = new Date(venta.fecha);
    // Formato día/mes/año en zona horaria Argentina
    const [day, month, year] = d.toLocaleDateString('es-AR', {
      timeZone: 'America/Argentina/Buenos_Aires',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).split('/');
    html = html.replace('{{day}}', day);
    html = html.replace('{{month}}', month);
    html = html.replace('{{year}}', year);


    const puntoVenta = venta.afip.puntoVenta.toString().padStart(4, '0');
    const numero = venta.afip.numero.toString().padStart(8, '0');
    const letra = verTipoFactura(venta.cod_comp);
    
    

    //parte arriba
    html = html.replace('{{letra}}', letra);
    html = html.replace('{{codigo}}', 'Cod. ' + venta.cod_comp);
    html = html.replace('{{puntoVenta}}', puntoVenta);
    html = html.replace('{{factura}}', venta.tipo_comp);
    html = html.replace('{{numero}}', numero);

    //cliente
    html = html.replace('{{cliente}}', venta.cliente);
    html = html.replace('{{cuit}}', venta.num_doc.length === 11 ? 'CUIT' : 'DNI');
    html = html.replace('{{dni}}', venta.num_doc ? venta.num_doc : '00000000');
    html = html.replace('{{domicilio}}', venta.direccion ? venta.direccion + ' - ' + venta.localidad : 'Chajari');
    html = html.replace('{{clienteIva}}', venta.condicionIva ? venta.condicionIva : 'Consumidor Final');
    html = html.replace('{{condicionVenta}}', venta.tipo_venta === 'CC' ? 'Cuenta Corriente' : 'Contado');
    let tr = '';
    for (let {_id, cantidad, precio, impuesto, descripcion, productoOriginal} of productos) {
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
                  <td class="text-end">${productoOriginal?.unidad === 'horas' ? '' : cantidad.toFixed(2)}</td>
                  <td class="text-end">${productoOriginal?.unidad === 'horas' ? '' : venta.condicionIva === 'Responsable Inscripto' ? (precio / (impuesto / 100 + 1)).toFixed(2) : precio.toFixed(2)}</td>
                  <td class="text-end">${impuesto ? impuesto.toFixed(2) : ''}</td>
                  <td class="text-end">${venta.condicionIva === 'Responsable Inscripto' ? ((precio / (impuesto / 100 + 1)) * cantidad).toFixed(2) : (precio * cantidad).toFixed(2)}</td>
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
      venta.iva21 = venta.iva21 / dolar;
      venta.iva105 = venta.iva105 / dolar;
      venta.descuento = venta.descuento / dolar;
    }
    html = html.replace(
      '{{subTotal}}',
      venta.condicionIva === 'Responsable Inscripto' ? (checkboxDolar ? 'U$S ' : '$ ') + (venta.precio - venta.iva21 - venta.iva105).toFixed(2) : (checkboxDolar ? 'U$S ' : '$ ') + venta.precio.toFixed(2),
    );
    html = html.replace('{{iva21}}', venta.condicionIva === 'Responsable Inscripto' ? `IVA 21%: ${venta.iva21.toFixed(2)} ` : '');
    html = html.replace('{{iva105}}', venta.condicionIva === 'Responsable Inscripto' ? `IVA 10.5% ${venta.iva105.toFixed(2)} ` : '');
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
    const clienteSanitizado = (venta.cliente || 'Consumidor_Final').replace(/[/\\?%*:|"<>]/g, '_');

    pdf.create(html, config).toFile(`pdfs/${clienteSanitizado}--${puntoVenta}-${numero}.pdf`, (err, res) => {
      if (err) {
        reject(err);
      } else {
        console.log(res);
        resolve(true);
      }
    });
    
    }catch(err){
      reject(err);
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
