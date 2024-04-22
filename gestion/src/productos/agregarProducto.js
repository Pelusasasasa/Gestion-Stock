const salir = document.querySelector('.salir');

const codigo = document.querySelector('#codigo');
const descripcion = document.querySelector('#descripcion');
const codigoManual = document.querySelector('#codigoManual');

const selectMarca = document.querySelector('#marca');
const agregarMarca = document.querySelector('#agregarMarca');
const select = document.querySelector('#rubro');
const agregarRubro = document.querySelector('#agregarRubro');
const selectProvedor = document.querySelector('#provedor');
const agregarProvedor = document.querySelector('#agregarProvedor');
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

const guardar = document.querySelector('.guardar');
const ticketPrecio = document.querySelector('#ticketPrecio');
const oferta = document.querySelector('#oferta');

const sweet  = require('sweetalert2');
const {cerrarVentana,apretarEnter, redondear, agregarMovimientoVendedores, imprimirTicketPrecio, agregarProductoModificadoParaTicket} = require('../helpers');

const archivo = require('../configuracion.json');

const axios = require('axios');
const { ipcRenderer } = require('electron');
require('dotenv').config()
const URL = process.env.GESTIONURL;

let vendedor;
let precioAux = 0;

const traerRubros = async()=>{
    const rubros =  (await axios.get(`${URL}rubro`)).data;
    for await(let {numero,rubro} of rubros){
        const option = document.createElement('option');
        option.text = numero + " - " + rubro,
        option.value = numero;
        select.appendChild(option)
    }
};

const traerProvedores = async()=>{
    const provedores =  (await axios.get(`${URL}provedor`)).data;
    for await(let {numero,provedor} of provedores){
        const option = document.createElement('option');
        option.text = numero + " - " + provedor,
        option.value = numero;
        selectProvedor.appendChild(option)
    }
};

const traerMarcas = async() => {
    const marcas = (await axios.get(`${URL}marca`)).data;
    for await(let {numero,marca} of marcas){
        const option = document.createElement('option');
        option.text = numero + ' - ' + marca;
        option.value = numero;
        selectMarca.appendChild(option)
    };
}

window.addEventListener('load', e => {
    ticketPrecio.checked = archivo.ImprecioTicketPrecio;
    traerRubros();
    traerMarcas();
    traerProvedores();
});


ipcRenderer.on('informacion',(e,args)=>{
    vendedor = args.vendedor;
});

window.addEventListener('load',async e=>{
    if (!archivo.dolar) {
        costoDolar.setAttribute('disabled',"");
    }
    dolar.value = ((await axios.get(`${URL}numero`)).data.Dolar).toFixed(2);
});

impuesto.addEventListener('blur',e=>{
    impuesto.value = impuesto.value === "" ? 0 : impuesto.value;
    if (parseFloat(costoDolar.value) !== 0) {
        costoIva.value = redondear(((parseFloat(impuesto.value) * precioAux/100) + precioAux) * parseFloat(dolar.value),2)
    }else{
        costoIva.value = ((parseFloat(impuesto.value) * precioAux/100) + precioAux).toFixed(2);
    }
});

total.addEventListener('focus',e=>{
    total.value = (parseFloat(costoIva.value) + (parseFloat(costoIva.value) * parseFloat(ganancia.value) / 100)).toFixed(2);
});

oferta.addEventListener('click',e => {
    precioOferta.parentElement.classList.toggle('none');
});

guardar.addEventListener('click',async ()=>{
    const producto = {}
    producto._id = codigo.value;
    producto.descripcion = descripcion.value.trim().toUpperCase();
    producto.codigoManual = codigoManual.value === "false" ? false : true;

    producto.marca = marca.value.trim().toUpperCase();
    producto.rubro = rubro.value.trim();
    producto.provedor = provedor.value.toUpperCase().trim();
    producto.stock = stock.value;

    producto.costo = costo.value;
    producto.costoDolar = costoDolar.value;
    producto.descuento1 = descuento1.value;
    producto.descuento2 = descuento2.value;
    producto.descuento3 = descuento3.value;

    producto.impuesto = impuesto.value === "" ? 0 : impuesto.value;
    producto.ganancia = ganancia.value;

    producto.precio = total.value;
    producto.oferta = oferta.checked;
    producto.precioOferta = precioOferta.value;

    const {estado,mensaje} = (await axios.post(`${URL}productos`,producto)).data;
    vendedor && await agregarMovimientoVendedores(`Cargo el producto ${producto.descripcion} con el precio ${producto.precio}`,vendedor);

    imprimirTicketPrecio(producto.descripcion,parseFloat(producto.precio),ticketPrecio.checked);

    await agregarProductoModificadoParaTicket(producto);

    await sweet.fire({
        title:mensaje
    })
    if (estado) {
        window.close();
    } 
});

codigo.addEventListener('keypress',async e=>{

    let aux = codigo.value;

if (e.keyCode === 13) {
    if (aux.includes('/')) {
        aux = aux.replace(/\//g,'%2F');
        console.log(aux)
    }
    const prodcutoExistente = (await axios.get(`${URL}productos/${aux}`)).data;
    console.log(prodcutoExistente)
    if (prodcutoExistente) {
        await sweet.fire({
            title:"Codigo Ya Utilizado"
        });
        codigo.value = "";
    }else{
        apretarEnter(e,descripcion);
    }
}
})

descripcion.addEventListener('keypress',e=>{
    apretarEnter(e,codigoManual);
});

codigoManual.addEventListener('keypress',e=>{
    e.preventDefault();
    apretarEnter(e,marca);
});

marca.addEventListener('keypress',e=>{
    apretarEnter(e,rubro);
})

rubro.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        e.preventDefault();
        provedor.focus();
    }
});

provedor.addEventListener('keypress',e=>{
    apretarEnter(e,stock);
})

stock.addEventListener('keypress',e=>{
    apretarEnter(e,costo);
})

costo.addEventListener('keypress',e=>{
    precioAux = parseFloat(costo.value);
    if (costoDolar.hasAttribute('disabled')) {
        apretarEnter(e,descuento1);
    }else{
        apretarEnter(e,costoDolar);
    }
});

costoDolar.addEventListener('keypress',e=>{
    precioAux = parseFloat(costoDolar.value);
    apretarEnter(e,descuento1);
});

descuento1.addEventListener('keypress',e=>{
    if (parseFloat(descuento1.value) !== 0 && e.keyCode === 13) {
        precioAux = parseFloat(redondear(precioAux - (precioAux * parseFloat(descuento1.value) / 100),2));
    };
    apretarEnter(e, descuento2);
});

descuento2.addEventListener('keypress',e=>{
    if (parseFloat(descuento2.value) !== 0 && e.keyCode === 13) {
        precioAux = parseFloat(redondear(precioAux - (precioAux * parseFloat(descuento2.value) / 100),2));
    }
    apretarEnter(e, descuento3);
});

descuento3.addEventListener('keypress',e=>{
    if (parseFloat(descuento3.value) !== 0 && e.keyCode === 13) {
        precioAux = parseFloat(redondear(precioAux - (precioAux * parseFloat(descuento3.value) / 100),2));
    }
    apretarEnter(e, impuesto);
});

impuesto.addEventListener('keypress',e=>{
    apretarEnter(e,costoIva);
})

costoIva.addEventListener('keypress',e=>{
    apretarEnter(e,ganancia);
})

ganancia.addEventListener('keypress',e=>{
    apretarEnter(e,total);
});

total.addEventListener('keypress',e=>{
    precioTarjeta.value = redondear(parseFloat(total.value) + parseFloat(total.value) * archivo.descuentoEfectivo / 100,2);
    if (precioOferta.parentElement.classList.contains('none')) {
        apretarEnter(e,guardar);
    }else{
        apretarEnter(e,precioOferta);
    }
})

precioOferta.addEventListener('keypress',e=>{
    apretarEnter(e,guardar);
});

salir.addEventListener('click',e=>{
    window.close();
})

document.addEventListener('keydown',e=>{
    cerrarVentana(e)
});

document.addEventListener('keyup',e=>{
    if (e.keyCode === 117) {
        ticketPrecio.checked = !ticketPrecio.checked
    }
})

codigo.addEventListener('focus',e=>{
    codigo.select();
});

descripcion.addEventListener('focus',e=>{
    descripcion.select();
});

stock.addEventListener('focus',e=>{
    stock.select();
});

costo.addEventListener('focus',e=>{
    costo.select();
});

costoDolar.addEventListener('focus',e=>{
    costoDolar.select();
});

descuento1.addEventListener('focus',e=>{
    descuento1.select();
});

descuento2.addEventListener('focus',e=>{
    descuento2.select();
});

descuento3.addEventListener('focus',e=>{
    descuento3.select();
});

impuesto.addEventListener('focus',e=>{
    impuesto.select();
});

costoIva.addEventListener('focus',e=>{
    costoIva.select();
});

ganancia.addEventListener('focus',e=>{
    ganancia.select();
});

total.addEventListener('focus',e=>{
    total.select();
});

precioTarjeta.addEventListener('focus',e=>{
    precioTarjeta.select();
});

precioOferta.addEventListener('focus',e=>{
    precioOferta.select();
});

agregarRubro.addEventListener('click', async e => {
    const {value} = await sweet.fire({
        title: "Agregar Rubro",
        input: "text",
        confirmButtonText: "Agregar",
        showCancelButton: true,
        cancelButtonText: "Cancelar"
    });

    if (value) {
        const numero = parseInt((await axios.get(`${URL}rubro/last`)).data);
        const rubro = {
            numero: numero + 1,
            rubro: value
        };
        const nuevo = (await axios.post(`${URL}rubro`, rubro)).data;
        const option = document.createElement('option');
        option.value = nuevo.numero;
        option.text = nuevo.numero + " - " + nuevo.rubro.toUpperCase();

        select.appendChild(option);
    }
});

agregarMarca.addEventListener('click', async e => {
    const {value} = await sweet.fire({
        title: "Agregar Marca",
        input: "text",
        confirmButtonText: "Agregar",
        showCancelButton: true,
        cancelButtonText: "Cancelar"
    });

    if (value) {
        const numero = parseInt((await axios.get(`${URL}marca/last`)).data);
        const marca = {
            numero: numero + 1,
            marca: value
        };
        const nuevo = (await axios.post(`${URL}marca`, marca)).data;
        const option = document.createElement('option');
        option.value = nuevo.numero;
        option.text = nuevo.numero + " - " + marca.marca.toUpperCase();

        selectMarca.appendChild(option);
    }
});

agregarProvedor.addEventListener('click', async e => {
    const {value} = await sweet.fire({
        title: "Agregar Provedor",
        input: "text",
        confirmButtonText: "Agregar",
        showCancelButton: true,
        cancelButtonText: "Cancelar"
    });

    if (value) {
        const numero = parseInt((await axios.get(`${URL}provedor/last`)).data);
        const provedor = {
            numero: numero + 1,
            provedor: value
        };
        const nuevo = (await axios.post(`${URL}provedor`, provedor)).data;
        if (nuevo.name === "ValidatorError") {
            await sweet.fire({
                title: nuevo.message
            });
            return;
        }
        const option = document.createElement('option');
        option.value = nuevo.numero;
        option.text = nuevo.numero + " - " + nuevo.provedor.toUpperCase();

        selectProvedor.appendChild(option);
    }
});