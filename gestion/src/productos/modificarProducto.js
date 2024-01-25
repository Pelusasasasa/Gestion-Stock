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


//llenamos los inputs con la informacion que tenemos
const llenarInputs = async(codigoProducto)=>{
    codigo.value = codigoProducto;
    const producto = (await axios.get(`${URL}productos/${codigo.value}`)).data;
    descripcion.value = producto.descripcion;
    codigoManual.value = producto.codigoManual === true ? 'true' : 'false';
    marca.value = producto.marca;
    provedor.value = producto.provedor;
    stock.value = producto.stock;
    select.value = producto.rubro;
    costo.value = producto.costo.toFixed(2);
    costoDolar.value = producto.costoDolar.toFixed(2);
    impuesto.value = producto.impuesto.toFixed(2);
    precioOferta.value = producto.precioOferta.toFixed(2);
    if (producto.oferta) {
        oferta.click();
    }
    if (producto.costoDolar !== 0) {
        costoIva.value = redondear((producto.costoDolar + (producto.costoDolar * producto.impuesto / 100)) * parseFloat(dolar.value),2);
    }else{
        costoIva.value = (producto.costo + (producto.costo * producto.impuesto / 100)).toFixed(2);
    }
    ganancia.value = producto.ganancia.toFixed(2);
    total.value = producto.precio.toFixed(2);    
    precioTarjeta.value = producto.precioTarjeta.toFixed(2);
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
    producto.impuesto = parseFloat(impuesto.value).toFixed(2);
    producto.ganancia = parseFloat(ganancia.value).toFixed(2);
    producto.precio = parseFloat(total.value).toFixed(2);
    producto.precioTarjeta = precioTarjeta.value;
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
    if (costoDolar.hasAttribute('disabled')) {
        apretarEnter(e,impuesto);
    }else{
        apretarEnter(e,costoDolar);
    }
});

costoDolar.addEventListener('keypress',e=>{
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
    precioTarjeta.value = redondear(parseFloat(total.value) + parseFloat(total.value) * archivo.descuentoEfectivo / 100,2);

    apretarEnter(e,precioTarjeta);
});

precioTarjeta.addEventListener('keypress',e=>{
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
        costoIva.value = (parseFloat(costo.value) + (parseFloat(costo.value) * parseFloat(impuesto.value) / 100 )).toFixed(2);
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