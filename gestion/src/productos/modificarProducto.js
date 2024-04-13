const { ipcRenderer } = require('electron');
const {cerrarVentana,apretarEnter, redondear, agregarMovimientoVendedores, imprimirTicketPrecio, agregarProductoModificadoParaTicket} = require('../helpers');
const sweet = require('sweetalert2');

const axios = require('axios');
require("dotenv").config();
const URL = process.env.GESTIONURL;

const archivo = require('../configuracion.json')

const dolar = document.getElementById('dolar');

const codigo = document.querySelector('#codigo');
const descripcion = document.querySelector('#descripcion');
const codigoManual = document.querySelector('#codigoManual');

const marca = document.querySelector('#marca');
const select = document.querySelector('#rubro');
const provedor = document.querySelector('#provedor');
const stock = document.querySelector('#stock');

const costo = document.querySelector('#costo');
const costoDolar = document.querySelector('#costoDolar');
const descuento1 = document.querySelector('#descuento1');
const descuento2 = document.querySelector('#descuento2');
const descuento3 = document.querySelector('#descuento3');

const impuesto = document.querySelector('#impuesto');
const costoIva = document.querySelector('#costoIva');

const ganancia = document.querySelector('#ganancia');
const total = document.querySelector('#total');
const precioTarjeta = document.querySelector('#precioTarjeta');
const precioOferta = document.querySelector('#precioOferta');

const modificar = document.querySelector('.modificar');
const salir = document.querySelector('.salir');
const ticketPrecio = document.querySelector('#ticketPrecio');
const oferta = document.querySelector('#oferta');

let vendedor;
let precioAux = 0;


//Recibimos la informacion del producto para luego llenar los inputs
ipcRenderer.on('informacion',async (e,args)=>{
    if (!archivo.dolar) {
        costoDolar.setAttribute('disabled',"");
    }
    dolar.value = (await axios.get(`${URL}numero/Dolar`)).data.toFixed(2)
    const {informacion}= args;
    vendedor = args.vendedor;
    const rubros = (await axios.get(`${URL}rubro`)).data;
    for await(let {rubro,numero} of rubros){
        const option = document.createElement('option');
        option.text = numero + "-" + rubro;
        option.id = numero;
        option.value = rubro;
        select.appendChild(option);
    }
    llenarInputs(informacion);
});

window.addEventListener('load', e => {
    ticketPrecio.checked = archivo.ImprecioTicketPrecio;
});


//llenamos los inputs con la informacion que tenemos
const llenarInputs = async(codigoProducto)=>{
    codigo.value = codigoProducto;
    const producto = (await axios.get(`${URL}productos/${codigo.value}`)).data;
    descripcion.value = producto.descripcion;
    codigoManual.value = producto.codigoManual === true ? 'true' : 'false';

    marca.value = producto.marca;
    select.value = producto.rubro;
    provedor.value = producto.provedor;
    stock.value = producto.stock;
    
    costo.value = producto.costo.toFixed(2);
    costoDolar.value = producto.costoDolar.toFixed(2);
    descuento1.value = producto.descuento1.toFixed(2);
    descuento2.value = producto.descuento2.toFixed(2);
    descuento3.value = producto.descuento3.toFixed(2);

    impuesto.value = producto.impuesto.toFixed(2);
    precioOferta.value = producto.precioOferta.toFixed(2);

    if (producto.oferta) {
        oferta.click();
    }

    if (producto.costoDolar !== 0) {
        costoIva.value = redondear((producto.costoDolar + (producto.costoDolar * producto.impuesto / 100)) * parseFloat(dolar.value),2);
    }else{
        precioAux = producto.costo;
        precioAux = parseFloat(redondear(precioAux - (precioAux * producto.descuento1 / 100),2));
        precioAux = parseFloat(redondear(precioAux - (precioAux * producto.descuento2 / 100),2));
        precioAux = parseFloat(redondear(precioAux - (precioAux * producto.descuento3 / 100),2));
        costoIva.value = (precioAux + (precioAux * producto.impuesto / 100)).toFixed(2);
    }
    ganancia.value = producto.ganancia.toFixed(2);
    total.value = producto.precio.toFixed(2);    
    precioTarjeta.value = Math.round(producto.precio + producto.precio * archivo.descuentoEfectivo / 100).toFixed(2)
}

//al hacer click modificamos los productos con el valor de los inputs
modificar.addEventListener('click',async e=>{
    const producto = {};
    producto._id = codigo.value;
    producto.descripcion = descripcion.value.trim().toUpperCase();

    producto.marca = marca.value.trim().toUpperCase();
    producto.rubro = rubro.value.trim().toUpperCase();
    producto.provedor = provedor.value.trim().toUpperCase();
    producto.stock = parseFloat(stock.value).toFixed(2);

    producto.costo = parseFloat(costo.value).toFixed(2);
    producto.costoDolar = parseFloat(costoDolar.value).toFixed(2);
    producto.descuento1 = parseFloat(descuento1.value).toFixed(2);
    producto.descuento2 = parseFloat(descuento2.value).toFixed(2);
    producto.descuento3 = parseFloat(descuento3.value).toFixed(2);

    producto.impuesto = parseFloat(impuesto.value).toFixed(2);
    producto.ganancia = parseFloat(ganancia.value).toFixed(2);

    producto.precio = parseFloat(total.value).toFixed(2);
    producto.precioOferta = precioOferta.value;
    producto.oferta = oferta.checked;
    const {mensaje,estado} =  (await axios.put(`${URL}productos/${producto._id}`,producto)).data;

    await ipcRenderer.send('informacion-a-ventana',producto);
    vendedor && await agregarMovimientoVendedores(`Modifico el producto ${producto.descripcion} con el precio ${producto.precio}`,vendedor);
    
    imprimirTicketPrecio(producto.descripcion,parseFloat(producto.precio),ticketPrecio.checked);

    await agregarProductoModificadoParaTicket(producto);

    await sweet.fire({
        title:mensaje
    })
    if (estado) {
        window.close();
    }
})

codigo.addEventListener('keypress',e=>{
    apretarEnter(e,descripcion);
});

descripcion.addEventListener('keypress',e=>{
    apretarEnter(e,codigoManual);
});

codigoManual.addEventListener('keypress',e=>{
    e.preventDefault();
    apretarEnter(e,marca);
});

marca.addEventListener('keypress',e=>{
    apretarEnter(e,rubro);
});

rubro.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        e.preventDefault();
        provedor.focus();
    }
});

provedor.addEventListener('keypress',e=>{
    apretarEnter(e,stock);
});

stock.addEventListener('keypress',e=>{
    apretarEnter(e,costo);
});

costo.addEventListener('keypress',e=>{
    precioAux = parseFloat(costo.value);
    if (costoDolar.hasAttribute('disabled')) {
        apretarEnter(e,descuento1);
    }else{
        apretarEnter(e,costoDolar);
    }
});

costoDolar.addEventListener('keypress',e=>{
    apretarEnter(e,descuento1);
});

descuento1.addEventListener('keypress',e=>{

    if (e.keyCode === 13 && parseFloat(descuento1.value) !== 0) {
        precioAux = parseFloat(redondear(precioAux - (precioAux * parseFloat(descuento1.value) / 100),2));
    };

    apretarEnter(e,descuento2);
});
descuento2.addEventListener('keypress',e=>{

    if (e.keyCode === 13 && parseFloat(descuento2.value) !== 0) {
        precioAux = parseFloat(redondear(precioAux - (precioAux * parseFloat(descuento2.value) / 100),2));
    };

    apretarEnter(e,descuento3);
});

descuento3.addEventListener('keypress',e=>{

    if (e.keyCode === 13 && parseFloat(descuento3.value) !== 0) {
        precioAux = parseFloat(redondear(precioAux - (precioAux * parseFloat(descuento3.value) / 100),2));
    };

    apretarEnter(e,impuesto);
});

impuesto.addEventListener('keypress',e=>{
    apretarEnter(e,costoIva);
});

costoIva.addEventListener('keypress',e=>{
    apretarEnter(e,ganancia);
});

ganancia.addEventListener('keypress',e=>{
    apretarEnter(e,total);
});

total.addEventListener('keypress',e=>{
    precioTarjeta.value = Math.round(parseFloat(total.value) + parseFloat(total.value) * archivo.descuentoEfectivo / 100 ).toFixed(2);
    if (precioOferta.parentElement.classList.contains('none')) {
        apretarEnter(e,modificar);
    }else{
        apretarEnter(e,precioOferta);
    }
});


descripcion.addEventListener('focus',e=>{
    descripcion.select()
});

marca.addEventListener('focus',e=>{
    marca.select()
});

provedor.addEventListener('focus',e=>{
    provedor.select()
});

stock.addEventListener('focus',e=>{
    stock.select()
});

costo.addEventListener('focus',e=>{
    costo.select()
});

costoDolar.addEventListener('focus',e=>{
    costoDolar.select()
});

descuento1.addEventListener('focus',e=>{
    descuento1.select()
});

descuento2.addEventListener('focus',e=>{
    descuento2.select()
});

descuento3.addEventListener('focus',e=>{
    descuento3.select()
});

impuesto.addEventListener('focus',e=>{
    impuesto.select()
});

costoIva.addEventListener('focus',e=>{
    costoIva.select()
});

ganancia.addEventListener('focus',e=>{
    ganancia.select()
});

total.addEventListener('focus',e=>{
    total.select()
});

impuesto.addEventListener('blur',e=>{
    if (parseFloat(costoDolar.value) !== 0) {
        costoIva.value = redondear((parseFloat(costoDolar.value) + (parseFloat(costoDolar.value) * parseFloat(impuesto.value) / 100 ))*parseFloat(dolar.value),2);
    }else{
        costoIva.value = (precioAux + (precioAux * parseFloat(impuesto.value) / 100 )).toFixed(2);
    }
});

ganancia.addEventListener('blur',e=>{
    total.value = ((parseFloat(costoIva.value) * parseFloat(ganancia.value) / 100) + parseFloat(costoIva.value)).toFixed(2);
})

salir.addEventListener('click',e=>{
    window.close();
});

document.addEventListener('keydown',e=>{
    cerrarVentana(e);
});

document.addEventListener('keyup',e=>{
    if (e.keyCode === 117) {
        ticketPrecio.checked = !ticketPrecio.checked;
    }
});


oferta.addEventListener('click',e=>{
    precioOferta.parentElement.classList.toggle('none');
});

precioOferta.addEventListener('focus',e => {
    precioOferta.select();
});

precioTarjeta.addEventListener('focus',e => {
    precioTarjeta.select();
});

precioOferta.addEventListener('keypress',e=>{
    apretarEnter(e,modificar);
});