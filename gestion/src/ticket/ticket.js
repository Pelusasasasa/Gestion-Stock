const {ipcRenderer} = require('electron');

const {cuit:cuitPro} = require('../configuracion.json');
const axios = require('axios');
require('dotenv').config();

const URL = process.env.GESTIONURL

const tipoComp = document.querySelector('.tipoComp');
const numeroComp = document.querySelector('.numeroComp');
const cuitPropetiario = document.querySelector('.cuitPropetiario');
const fecha = document.querySelector('.fecha');
const hora = document.querySelector('.hora');

//cliente
const cliente = document.querySelector('.cliente');
const direccion = document.querySelector('.direccion');
const cuit = document.querySelector('.cuit');
const notaCredito = document.querySelector('.notaCredito');

//listado
const listado = document.querySelector('.listado');

//ivas
const gravado21 = document.querySelector('.gravado21');
const gravado105 = document.querySelector('.gravado105');
const netoIva21 = document.querySelector('.netoIva21');
const netoIva105 = document.querySelector('.netoIva105');

//totales
const descuento = document.querySelector('.descuento');
const total = document.querySelector('.total');
const tipoVenta = document.querySelector('.tipoVenta');
const valorDolar = document.getElementById('valorDolar');

//afip
const qr = document.querySelector('#qr');
const cae = document.querySelector('#cae');
const vencimientoCae = document.querySelector('#vencimientoCae');

//En caso de recibo
const cantidadPrecio = document.querySelector('.cantidadPrecio');
const iva = document.querySelector('.iva');
const pagado = document.querySelector('.pagado');
const descripcion = document.querySelector('.descripcion');

let neto21 = 0;
let neto105 = 0;
let iva21 = 0;
let iva105 = 0;
let dolar = 0;

window.addEventListener('load',e=>{
    cuitPropetiario.innerText = cuitPro; 
});

ipcRenderer.on('imprimir',async (e,args)=>{
    const [situacion,venta,cliente,listado, checkDolar] = JSON.parse(args);
    dolar = (await axios.get(`${URL}numero/Dolar`)).data;
    listar(situacion,venta,cliente,listado, checkDolar);
});

const listar = async(situacion,venta,clienteTraido,lista, checkDolar)=>{
    let date = new Date(venta.fecha);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let hour = date.getHours();
    let minuts = date.getMinutes();
    let seconds = date.getSeconds();

    month = month === 13 ? 1 : month;
    month = month <10 ? `0${month}` : month;
    day = day <10 ? `0${day}` : day;
    hour = hour <10 ? `0${hour}` : hour;
    minuts = minuts <10 ? `0${minuts}` : minuts;
    seconds = seconds <10 ? `0${seconds}` : seconds;

    
    numeroComp.innerHTML = venta.F ? (venta.afip.puntoVenta.toString()).padStart(4,'0') + "-" + venta.afip.numero.toString().padStart(8,'0') :(venta.numero.toString()).padStart(8,'0');
    tipoComp.innerHTML = venta.tipo_comp;
    fecha.innerHTML = `${day}/${month}/${year}`;
    hora.innerHTML = `${hour}:${minuts}:${seconds}`;
    cliente.innerHTML = venta.cliente;
    direccion.innerHTML = clienteTraido.direccion;
    cuit.innerHTML = clienteTraido.cuit.length > 8 ? `CUIT:${clienteTraido.cuit}` : `DNI:${clienteTraido.cuit}`;
    notaCredito.innerHTML = venta.tipo_comp === "Nota Credito C" ? `Numero de Factura: 0003-${venta.facturaAnterior}` : "";

    neto21 += venta.gravado21;
    neto105 += venta.gravado105;
    iva21 += venta.iva21;
    iva105 += venta.iva105;

    if (neto21 !== 0 && (venta.cod_comp === 1 || venta.cod_comp === 3)) {
        gravado21.parentNode.parentNode.classList.remove('none')
    };

    if (neto105 !== 0 && (venta.cod_comp === 1 || venta.cod_comp === 3)) {
        gravado105.parentNode.parentNode.classList.remove('none')
    };
    gravado21.innerHTML = neto21.toFixed(2);
    gravado105.innerHTML = neto105.toFixed(2);
    netoIva21.innerHTML = iva21.toFixed(2);
    netoIva105.innerHTML = iva105.toFixed(2);

    if (venta.tipo_comp === "Recibo") {
        cantidadPrecio.innerHTML = "Fecha";
        iva.innerHTML = "Comprobante";
        pagado.innerHTML = "Pagado";
        descripcion.classList.add('none');
        notaCredito.innerHTML = `SALDO ACTUAL: ${clienteTraido.saldo}`;
    }
    for await(const elem of lista){
        if (venta.tipo_comp !== "Recibo") {
            listado.innerHTML += `
                <main>
                    <p>${elem.producto.slice(0,25)}</p>
                    <p>${checkDolar ? (elem.precio * elem.cantidad / dolar).toFixed(2) : (elem.precio * elem.cantidad).toFixed(2)}</p>
                </main>
                <main class = "linea">
                    <p>${elem.cantidad.toFixed(2)}/${checkDolar ? (elem.precio / dolar).toFixed(2) : elem.precio.toFixed(2)}</p>
                    <p>${elem.iva.toFixed(2)}</p>
                </main>
            `   
        }else{
            listado.innerHTML += `
                <main>
                    <p>${elem.fecha}</p>
                    <p>${elem.comprobante.toString().padStart(8,'0')}</p>
                    <p>${elem.pagado.toFixed(2)}</p>
                </main>
            `
        }
    };

    descuento.innerHTML = "0.00"
    total.innerHTML = checkDolar ? 'U$S ' + (venta.precio / dolar).toFixed(2) : '$' + venta.precio.toFixed(2);
    tipoVenta.innerHTML = venta.tipo_venta === "CC" ? "Cuenta Corriente" : "Contado";

    if (checkDolar){
        valorDolar.innerHTML += dolar.toFixed(2);
        valorDolar.classList.remove('none');
    }
    

    if (venta.F) {
        vencimientoCae.innerHTML = `Vencimiento Cae: ${venta.afip.vencimiento}`;
        cae.innerHTML = `CAE: ${venta.afip.cae}`;
        qr.src = venta.afip.QR;

    }
    
    ipcRenderer.send('imprimir-ventana',situacion)
}