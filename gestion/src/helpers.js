const Afip = require('@afipsdk/afip.js');
const { clipboard } = require('electron');
const fs = require('fs');
const path = require('path');
const sweet = require('sweetalert2');
const axios = require('axios');
const archivo = require('./configuracion.json');
let internetAvalible = require('internet-available');
const { getClienteById } = require('./services/clientesService');

require('dotenv').config();
const URL = process.env.GESTIONURL;

const funciones = {};

const afip = new Afip({ CUIT: archivo.cuit });

let puntoVenta = archivo.puntoVenta;

//Sirve para ver si hay internet o no
funciones.verSiHayInternet = () => {
  let retorno = true;
  internetAvalible({
    timeout: 1000,
    retries: 5,
  })
    .then(() => {
      retorno = true;
    })
    .catch(() => {
      retorno = false;
    });
  return retorno;
};

funciones.calcularPrecio = (lista, producto, dolar) => {
  if (lista === 'NORMAL') return producto.precio;

  if (producto.costoDolar !== 0) {
    const costoUtilidad = (producto.costoDolar + (producto.costoDolar * (producto.utilidad ?? 0)) / 100) * dolar;
    const precio = costoUtilidad + (costoUtilidad * producto.impuesto) / 100;
    return precio;
  } else {
    const costoUtilidad = producto.costoDolar + (producto.costoDolar * (producto.utilidad ?? 0)) / 100;
    const precio = costoUtilidad + (costoUtilidad * producto.impuesto) / 100;
    return precio;
  }
};

funciones.cargarVendedor = async () => {
  const html = `
    <section>
        <main>
            <label htmlFor="nombre">Nombre</label>
            <input type="text" name="nombre" id="nombre" />
        </main>
        <main>
            <label htmlFor="codigo">Codigo</label>
            <input type="text" name="codigo" id="codigo" />
        </main>
        <main>
            <label htmlFor="permisos">Permisos</label>
            <input type="number" name="permisos" id="permisos" />
        </main>
    </section>
    `;
  return html;
};

funciones.getParameterByName = (name) => {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
    results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

funciones.apretarEnter = async (e, input) => {
  if (e.key === 'Enter') {
    input.focus();
  }
};

//cerramos la ventana al apretrar escape
funciones.cerrarVentana = (e) => {
  if (e.key === 'Escape') {
    window.close();
  }
};

funciones.copiar = async () => {
  document.addEventListener('keydown', (e) => {
    if (e.keyCode === 17) {
      document.addEventListener(
        'keydown',
        (e) => {
          const subSeleccionado = document.querySelector('.subSeleccionado');
          if (e.keyCode === 67) {
            clipboard.writeText(subSeleccionado.innerHTML);
          }
        },
        { once: true }
      );
    }
  });
};

funciones.recorrerFlechas = (code) => {
  if (code === 40 && seleccionado.nextElementSibling) {
    let aux = 0;
    let i = 0;
    const tds = document.querySelectorAll('.seleccionado td');

    for (let td of tds) {
      if (td.classList.contains('subSeleccionado')) {
        aux = i;
      }
      i++;
    }

    seleccionado && seleccionado.classList.remove('seleccionado');
    seleccionado = seleccionado.nextElementSibling;
    seleccionado.classList.add('seleccionado');

    subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');
    subSeleccionado = seleccionado.children[aux];
    subSeleccionado.classList.add('subSeleccionado');
  } else if (code === 38 && seleccionado.previousElementSibling) {
    let aux = 0;
    let i = 0;
    const tds = document.querySelectorAll('.seleccionado td');

    for (let td of tds) {
      if (td.classList.contains('subSeleccionado')) {
        aux = i;
      }
      i++;
    }

    seleccionado && seleccionado.classList.remove('seleccionado');
    seleccionado = seleccionado.previousElementSibling;
    seleccionado.classList.add('seleccionado');

    subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');
    subSeleccionado = seleccionado.children[aux];
    subSeleccionado.classList.add('subSeleccionado');
  } else if (code === 37 && subSeleccionado.previousElementSibling) {
    subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');
    subSeleccionado = subSeleccionado.previousElementSibling;
    subSeleccionado.classList.add('subSeleccionado');
  } else if (code === 39 && subSeleccionado.nextElementSibling) {
    subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');
    subSeleccionado = subSeleccionado.nextElementSibling;
    subSeleccionado.classList.add('subSeleccionado');
  }
};

funciones.redondear = (numero, decimales) => {
  const signo = numero >= 0 ? 1 : -1;
  return parseFloat(Math.round(numero * Math.pow(10, decimales) + signo * 0.0001) / Math.pow(10, decimales)).toFixed(decimales);
};

funciones.selecciona_value = (idInput) => {
  const seleccionado = document.getElementById(idInput);
  seleccionado.select();
};

funciones.tablaCondicionIVAReceptorId = (condicion) => {
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

funciones.cargarFactura = async (venta, notaCredito) => {
  console.log(venta);
  const fecha = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];
  const { AppServer, AuthServer, DbServer } = await afip.ElectronicBilling.getServerStatus();
  console.log('Estado del servidor');
  console.log({ AppServer, AuthServer, DbServer }); // mostramos el estado del servidor

  let ultimaElectronica = await afip.ElectronicBilling.getLastVoucher(puntoVenta, venta.cod_comp);
  console.log(ultimaElectronica);

  console.log(parseFloat(venta.facturaAnterior));
  let aux = venta.condicionIva === 'Inscripto' ? 1 : 6;
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
    ImpTotal: venta.precio,
    ImpTotConc: 0,
    ImpNeto: archivo.condIva === 'Inscripto' ? parseFloat(redondear(venta.gravado21 + venta.gravado0 + venta.gravado105, 2)) : venta.precio,
    ImpOpEx: 0,
    ImpIVA: archivo.condIva === 'Inscripto' ? parseFloat(redondear(venta.iva21 + venta.iva0 + venta.iva105, 2)) : 0,
    ImpTrib: 0,
    // 'CondicionIVAReceptorId': funciones.tablaCondicionIVAReceptorId(venta.condicionIva),
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

  if (archivo.condIva === 'Inscripto') {
    venta.iva105 !== 0 &&
      data.Iva.push({
        Id: 4,
        BaseImp: venta.gravado105,
        Importe: venta.iva105,
      });

    venta.iva21 !== 0 &&
      data.Iva.push({
        Id: 5,
        BaseImp: venta.gravado21,
        Importe: venta.iva21,
      });

    venta.gravado0 !== 0 &&
      data.Iva.push({
        Id: 3,
        BaseImp: venta.gravado0,
        Importe: venta.iva0,
      });
  }
  console.log(data);
  const res = await afip.ElectronicBilling.createVoucher(data); //creamos la factura electronica
  console.log(res);

  const qr = {
    ver: 1,
    fecha: fecha,
    cuit: archivo.cuit,
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
    puntoVenta: puntoVenta,
    QR,
    numero: ultimaElectronica + 1,
    cae: res.CAE,
    vencimiento: res.CAEFchVto,
  };
};

//Generamos el qr
async function generarQR(texto) {
  const qrCode = require('qrcode');
  const url = `https://www.afip.gob.ar/fe/qr/?p=${texto}`;
  const QR = await qrCode.toDataURL(url);
  return QR;
}

//devolvemos la ultimaFactura C y ultima Nota de credito C
funciones.ultimaC = async () => {
  try {
    const facturaC = await afip.ElectronicBilling.getLastVoucher(puntoVenta, 11); //Devuelve el número del último comprobante creado para el punto de venta 1 y el tipo de comprobante 6 (Factura B)
    const notaC = await afip.ElectronicBilling.getLastVoucher(puntoVenta, 13);
    return {
      facturaC,
      notaC,
    };
  } catch (error) {
    console.log(error);
    return {
      facturaC: 0,
      notaC: 0,
    };
  }
};

funciones.ultimaAB = async () => {
  try {
    const facturaA = await afip.ElectronicBilling.getLastVoucher(puntoVenta, 1);
    const notaA = await afip.ElectronicBilling.getLastVoucher(puntoVenta, 3);
    const facturaB = await afip.ElectronicBilling.getLastVoucher(puntoVenta, 6);
    const notaB = await afip.ElectronicBilling.getLastVoucher(puntoVenta, 8);
    return {
      facturaA,
      notaA,
      facturaB,
      notaB,
    };
  } catch (error) {
    console.log(error);
    return {
      facturaA: 0,
      notaA: 0,
      facturaB: 0,
      notaB: 0,
    };
  }
};

funciones.obtenerElementoSeleccionado = (e) => {
  let seleccionado = e.target.closest('.seleccionado');
  if (e.target.nodeName === 'TD') {
    seleccionado = e.target.parentNode;
  } else if (e.target.nodeName === 'DIV') {
    console.log(e.target);
    seleccionado = e.target.parentNode.parentNode;
  } else if (e.target.nodeName === 'SPAN') {
    seleccionado = e.target.parentNode.parentNode.parentNode;
  }

  seleccionado.classList.add('seleccionado');
  return seleccionado;
};

funciones.ponerNumero = async () => {
  sweet
    .fire({
      html: `
            <section id=imprimirVenta>
                <main>
                    <label htmlFor="tipo">Tipo</label>
                    <select name="tipo" id="tipo">
                        <option value="CD">Contado - ${(await axios.get(`${URL}numero`)).data.Contado}</option>
                        <option value="CC">Cuenta Corriente - ${(await axios.get(`${URL}numero`)).data['Cuenta Corriente']}</option>
                        <option value="PP">Presupuesto - ${(await axios.get(`${URL}numero`)).data.Presupuesto}</option>
                        <option value="RC">Recibo - ${(await axios.get(`${URL}numero/Recibo`)).data}</option>
                    </select>
                </main>
                <main>
                    <label htmlFor="numero">Numero de Venta</label>
                    <input type="text" name="numero" id="numero" />
                </main>
                <main class="checkboxDolar">
                    <label htmlFor="dolar">Dolar</label>
                    <input type="checkbox" name="dolar" id="dolar" />
                </main>

            </section>
        `,
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
    })
    .then(async ({ isConfirmed }) => {
      const tipo = document.getElementById('tipo');
      const numero = document.getElementById('numero');
      const checkboxDolar = document.getElementById('dolar');

      const { data } = await axios.get(`${URL}numero`);
      let dolar = data.Dolar;
      let dolarInstalador = data.dolarInstalador;

      let cliente;
      let movimientos;
      let venta;
      let recibo;

      if (isConfirmed) {
        if (tipo.value === 'PP') {
          venta = (await axios.get(`${URL}presupuesto/forNumber/${numero.value}`)).data;
        } else if (tipo.value === 'RC') {
          recibo = (await axios.get(`${URL}recibo/id/${numero.value}`)).data;
        } else {
          venta = (await axios.get(`${URL}ventas/numeroYtipo/${numero.value}/${tipo.value}`)).data;
          if (!venta) {
            venta = (await axios.get(`${URL}ventas/numeroYtipo/${numero.value}/T`)).data;
          }
        }

        cliente = await getClienteById(recibo ? recibo.idCliente : venta.idCliente);

        if (!cliente) {
          await sweet.fire('Error al obtener el cliente', 'No se pudo obtener el cliente', 'error');
          return;
        }

        movimientos = (await axios.get(`${URL}movimiento/${numero.value}/${tipo.value}`)).data;

        if (movimientos.length === 0) {
          movimientos = (await axios.get(`${URL}movimiento/${numero.value}/T`)).data;
        }

        if (checkboxDolar.checked) {
          movimientos.forEach((mov) => {
            mov.precio = venta.condicion === 'INSTALADOR' ? mov.precio / dolarInstalador : mov.precio / dolar;
          });
          venta.subtotal = venta.condicion === 'INSTALADOR' ? (venta.precio + venta.descuento) / dolarInstalador : (venta.precio + venta.descuento) / dolar;
          venta.precio = venta.condicion === 'INSTALADOR' ? venta.precio / dolarInstalador : venta.precio / dolar;
        }

        movimientos = tipo.value === 'RC' ? (await axios.get(`${URL}movRecibo/forNumber/${numero.value}`)).data : movimientos;

        let situacion;
        if (venta) {
          if (venta.F) {
            situacion = 'blanco';
          } else {
            situacion = 'negro';
          }
        } else if (recibo) {
          if (recibo.F) {
            situacion = 'blanco';
          } else {
            situacion = 'negro';
          }
        }

        if (recibo) {
          ipcRenderer.send('imprimir-recibo', [recibo, cliente, movimientos, true]);
        } else {
          ipcRenderer.send('imprimir', [situacion, venta, cliente, movimientos]);
        }
      }
    });
};

funciones.prepararObjetoVenta = async (dolar, dolarInstalador, vendedor, facturaAnterior) => {
  const venta = {};

  venta.fecha = new Date();

  venta.idCliente = codigo.value;
  venta.cliente = nombre.value;
  venta.direccion = direccion.value;
  venta.localidad = localidad.value;
  venta.condicion = lista.value;
  venta.vendedor = vendedor ?? '';
  venta.caja = require('./configuracion.json').caja;

  venta.precio = parseFloat(total.value);
  venta.descuento = parseFloat(descuento.value ?? 0);

  venta.tipo_venta = funciones.verTipoVenta();
  venta.listaProductos = listaProductos;

  venta.checkboxDolar = checkboxDolar.checked;
  venta.dolar = lista.value === 'NORMAL' ? dolar : dolarInstalador;

  venta.cod_comp = situacion === 'blanco' ? await funciones.verCodigoComprobante(tipoFactura, cuit.value, condicionIva.value === 'Responsable Inscripto' ? 'Inscripto' : condicionIva.value) : 0;
  venta.tipo_comp = situacion === 'blanco' ? await funciones.verTipoComprobante(venta.cod_comp) : await funciones.verTipoComprobanteNegro(venta.tipo_venta);
  venta.num_doc = cuit.value !== '' ? cuit.value : '00000000';
  venta.cod_doc = await funciones.verCodDoc(cuit.value);
  venta.condicionIva = condicionIva.value === 'Responsable Inscripto' ? 'Inscripto' : condicionIva.value;

  const [iva21, iva0, gravado21, gravado0, iva105, gravado105, cantIva] = await funciones.sacarIva(listaProductos, venta.condicion);

  venta.iva21 = iva21;
  venta.iva0 = iva0;
  venta.gravado21 = gravado21;
  venta.gravado0 = gravado0;
  venta.iva105 = iva105;
  venta.gravado105 = gravado105;
  venta.cantIva = cantIva;
  venta.facturaAnterior = facturaAnterior && '';

  return venta;
};

funciones.verificarUsuarios = async () => {
  let retorno;
  await sweet
    .fire({
      title: 'Contraseña',
      input: 'password',
      confirmButtonText: 'Aceptar',
      showCancelButton: true,
    })
    .then(async ({ isConfirmed, value }) => {
      if (isConfirmed) {
        retorno = (await axios.get(`${URL}vendedores/id/${value}`)).data;
      }
    });
  return retorno;
};

funciones.verNombrePc = async () => {
  require('hostname-patcher');
  const os = require('os');
  return os.hostname();
};

funciones.agregarMovimientoVendedores = async (descripcion, vendedor = '') => {
  const movimiento = {};
  movimiento.descripcion = descripcion;
  movimiento.fecha = new Date();
  movimiento.vendedor = vendedor;

  await axios.post(`${URL}movVendedores`, movimiento);
};

//Vemos el codigo de comprobante para las faturas
funciones.verCodigoComprobante = async (notaCredito, cuit = '00000000', condIva) => {
  if (archivo.condIva === 'Monotributo') {
    if (notaCredito) {
      return 13;
    } else {
      return 11;
    }
  } else if (archivo.condIva === 'Inscripto') {
    if (notaCredito) {
      if (cuit.length === 11 && condIva === 'Inscripto') {
        return 3;
      } else if (cuit.length === 11 && condIva !== 'Inscripto') {
        return 8;
      } else if (cuit.length === 8 && condIva !== 'Inscripto') {
        return 8;
      } else {
        await sweet.fire({
          title: 'No se puede hacer una Nota Credito B a un Inscripto',
        });
        return 0;
      }
    } else {
      if (cuit.length === 11 && condIva === 'Inscripto') {
        return 1;
      } else if (cuit.length === 11 && condIva !== 'Inscripto') {
        return 6;
      } else if (cuit.length === 8 && condIva !== 'Inscripto') {
        return 6;
      } else {
        await sweet.fire({
          title: 'No se puede hacer una Factura B a un Inscripto',
        });
        return 0;
      }
    }
  }
};

funciones.verCodDoc = async (cuit) => {
  if (cuit === '00000000') return 99;
  if (cuit.length > 8) return 80;
  return 90;
};

funciones.verTipoComprobante = async (codigo) => {
  let retorno = 'Comprobante';
  if (codigo === 1) {
    retorno = 'Factura A';
  } else if (codigo === 3) {
    retorno = 'Nota Credito A';
  } else if (codigo === 6) {
    retorno = 'Factura B';
  } else if (codigo === 8) {
    retorno = 'Nota Credito B';
  } else if (codigo === 11) {
    retorno = 'Factura C';
  } else if (codigo === 13) {
    retorno = 'Nota Credito C';
  }
  return retorno;
};

funciones.verTipoComprobanteNegro = async (tipo) => {
  if (tipo === 'RT') {
    return 'REMITO';
  } else {
    return 'COMPROBANTE';
  }
};

funciones.verTipoVenta = () => {
  let retornar;
  radio.forEach((input) => {
    if (input.checked) {
      retornar = input.value;
    }
  });
  return retornar;
};

funciones.sacarIva = (lista, condicion) => {
  let totalIva0 = 0;
  let totalIva21 = 0;
  let gravado21 = 0;
  let gravado0 = 0;
  let totalIva105 = 0;
  let gravado105 = 0;
  if (condicion === 'NORMAL') {
    lista.forEach(({ producto, cantidad }) => {
      if (producto.impuesto === 21) {
        gravado21 += (cantidad * producto.precioAux) / 1.21;
        totalIva21 += (((cantidad * producto.precioAux) / 1.21) * 21) / 100;
      } else if (producto.impuesto === 10.5) {
        gravado105 += (cantidad * producto.precioAux) / 1.105;
        totalIva105 += (((cantidad * producto.precioAux) / 1.105) * 10.5) / 100;
      } else {
        gravado0 += (cantidad * producto.precioAux) / 1;
        totalIva0 += cantidad * producto.precioAux - producto.precioAux / 1;
      }
    });
  } else {
    lista.forEach(({ producto, cantidad }) => {
      let auxCosto = producto.costoDolar === 0 ? (producto.costo * producto.impuesto) / 100 : producto.costoDolar * dolarInstalador;
      let auxCostoIva = auxCosto + (auxCosto * producto.impuesto) / 100;
      if (producto.impuesto === 21) {
        gravado21 += (cantidad * auxCostoIva) / 1.21;
        totalIva21 += (((cantidad * auxCostoIva) / 1.21) * 21) / 100;
      } else if (producto.impuesto === 10.5) {
        gravado105 += (cantidad * auxCostoIva) / 1.105;
        totalIva105 += (((cantidad * auxCostoIva) / 1.105) * 10.5) / 100;
      } else {
        gravado0 += (cantidad * auxCostoIva) / 1;
        totalIva0 += cantidad * auxCostoIva - auxCostoIva / 1;
      }
    });
  }

  let cantIva = 0;
  if (gravado0 !== 0) {
    cantIva++;
  }
  if (gravado21 !== 0) {
    cantIva++;
  }
  if (gravado105 !== 0) {
    cantIva++;
  }
  return [
    parseFloat(totalIva21.toFixed(2)),
    parseFloat(totalIva0.toFixed(2)),
    parseFloat(gravado21.toFixed(2)),
    parseFloat(gravado0.toFixed(2)),
    parseFloat(totalIva105.toFixed(2)),
    parseFloat(gravado105.toFixed(2)),
    cantIva,
  ];
};

funciones.verificarDatos = async () => {
  if (codigo.value === '') {
    await sweet.fire({ title: 'Poner un codigo al Proucto' });
    codigo.focus();
    return false;
  }

  if (descripcion.value === '') {
    await sweet.fire({ title: 'Poner una Descripcion al Producto' });
    descripcion.focus();
    return false;
  }

  if (stock.value === '') {
    await sweet.fire({ title: 'Poner un stock al producto' });
    stock.focus();
    return false;
  }

  if (costo.value === '') {
    await sweet.fire({ title: 'Poner un costo en pesos al Producto' });
    costo.focus();
    return false;
  }

  if (costoDolar.value === '') {
    await sweet.fire({ title: 'Poner un costo en Dolar al Producto' });
    costoDolar.focus();
    return false;
  }

  if (ganancia.value === '') {
    await sweet.fire({ title: 'Poner una Ganancia al Producto' });
    ganancia.focus();
    return false;
  }

  if (total.value === '') {
    await sweet.fire({ title: 'Poner un Total al Producto' });
    ganancia.focus();
    return false;
  }

  return true;
};

funciones.diferenciaObjetoServicio = async (objeto1, objeto2) => {
  let retorno = '';
  if (objeto1.cliente !== objeto2.cliente) {
    retorno += `Se cambio el cliente de ${objeto1.cliente} a ${objeto2.cliente}`;
  } else if (objeto1.producto !== objeto2.producto) {
    retorno += `Se cambio el producto de ${objeto1.producto} a ${objeto2.producto}`;
  } else if (objeto1.marca !== objeto2.marca) {
  }
};

funciones.cargarMovCaja = async (descripcion, puntoVenta, numero, tipo, importe, vendedor) => {
  const cuenta = {};

  cuenta.fecha = new Date();
  cuenta.descripcion = descripcion;
  cuenta.puntoVenta = puntoVenta;
  cuenta.numero = numero;
  cuenta.tipo = tipo;
  cuenta.importe = importe;
  cuenta.vendedor = vendedor;

  try {
    await axios.post(`${URL}movCaja`, cuenta);
  } catch (error) {
    console.log(error);
  }
};

funciones.parsearFecha = (date) => {
  const fecha = new Date(date);
  const fechaUTC3 = new Date(fecha.getTime() - 3 * 60 * 60 * 1000).toISOString();
  const fechaParseada = `${fechaUTC3.slice(0, 10).split('-', 3).reverse().join('/')} ${fechaUTC3.slice(11, 19)}`;
  return fechaParseada;
};

funciones.fechaConHora = (fecha) => {
  const hoy = new Date();
  const fechaConHora = new Date(fecha + 'T' + hoy.toTimeString().split(' ')[0]);
  return fechaConHora;
};

funciones.masVeinticuatroHoras = (fechaTraida) => {
  const fecha = new Date(fechaTraida);
  const ahora = new Date();
  const diffMs = ahora - fecha;
  const difHoras = diffMs / (1000 * 60 * 60);

  if (difHoras > 24) {
    return true;
  } else {
    return false;
  }
};

funciones.modulos = () => {
  let modulos = '';
  const filePath = path.join(__dirname, 'config.json');

  const moduloCreate = {
    ventas: true,
    clientes: true,
    productos: true,
    caja: true,
    recibos: true,
    consultas: true,
    remitos: true,
    gastos: true,
    servicioTecnico: true,
  };

  try {
    modulos = require('./config.json');
  } catch (error) {
    fs.writeFileSync(filePath, JSON.stringify(moduloCreate), 'utf-8');
    location.reload();
  }
  return modulos;
};

funciones.verPrecioConCantidad = ({ producto, cantidad }, tipoCliente = 'Normal', dolar) => {
  if (producto.costoDolar !== 0) {
    if (tipoCliente === 'INSTALADOR') {
      const retorno = (producto.costoDolar + (producto.costoDolar * producto.impuesto) / 100) * dolarInstalador * cantidad;

      return retorno;
    } else {
      return parseFloat((producto.precio * cantidad).toFixed(2));
    }
  } else {
    if (tipoCliente === 'INSTALADOR') {
      return (producto.costo + (producto.costo * producto.impuesto) / 100) * cantidad;
    } else {
      return parseFloat((producto.precio * cantidad).toFixed(2));
    }
  }
};

funciones.fechaActual = () => {
  const hoy = new Date();
  let d = hoy.getDate();
  let m = hoy.getMonth() + 1;
  let a = hoy.getFullYear();

  d = d < 10 ? `0${d}` : d;
  m = m < 10 ? `0${m}` : m;
  m = m === 13 ? 1 : m;

  return `${a}-${m}-${d}`;
};

funciones.saltarEnter = (origen, destino) => {
  if (origen.keyCode === 13) {
    origen.preventDefault();
    destino.focus();
    destino.select();
  }
};

module.exports = funciones;
