function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};

const vend = getParameterByName('vendedor');
const servicioId = getParameterByName('id');

const axios = require('axios');
require("dotenv").config();
const URL = process.env.GESTIONURL;

const { ipcRenderer } = require('electron');
const sweet = require('sweetalert2');

const {agregarMovimientoVendedores} = require('../helpers')

const idCliente = document.getElementById('idCliente');
const cliente = document.getElementById('cliente');
const direccion = document.getElementById('direccion');
const telefono = document.getElementById('telefono');

const codProd = document.getElementById('codProd');
const producto = document.getElementById('producto');
const modelo = document.getElementById('modelo');
const marca = document.getElementById('marca');
const serie = document.getElementById('serie');
const problemas = document.getElementById('problemas');

const detalles = document.getElementById('detalles');
const vendedor = document.getElementById('vendedor');
const estado = document.getElementById('estado');


const agregar = document.getElementById('agregar');
const modificar = document.getElementById('modificar');
const salir = document.getElementById('salir');

let servicio;

vendedor.value = vend;

window.addEventListener('load', async e => {
    if (servicioId) {
        document.querySelector('title').innerText = 'Modificar Servicio';
        servicio = (await axios.get(`${URL}servicios/id/${servicioId}`)).data;
        listarServicio(servicio);
        modificar.classList.remove('none');
        agregar.classList.add('none');
    };
    
});

ipcRenderer.on('informacion',async (e,args)=>{
    vendedor.value = args.vendedor.nombre;
    if (args.informacion) {
        servicio = (await axios.get(`${URL}servicios/id/${args.informacion}`)).data;
        console.log(servicio)
        listarServicio(servicio);

        egreso.classList.remove('none');

        const fechaEgreso = new Date();
        let day = fechaEgreso.getDate();
        let month = fechaEgreso.getMonth() + 1;
        let year = fechaEgreso.getFullYear();

        month = month === 13 ? 1 : month;
        day = day < 10 ? `0${day}` : day;
        month = month < 10 ? `0${month}` : month;
        inputEgreso.value = `${year}-${month}-${day}`;

        modificar.classList.remove('none');
        modificar.id = args.informacion;
        agregar.classList.add('none');
    }
});

ipcRenderer.on('recibir', async(e,args) => {
    const {tipo,informacion} = JSON.parse(args);
    if (tipo === 'cliente') {
        const elem = (await axios.get(`${URL}clientes/id/${informacion}`)).data;
        listarCliente(elem);
    };

    if (tipo === 'producto') {
        console.log(tipo,informacion)
        const elem = (await axios.get(`${URL}productos/${informacion}`)).data;
        
        listarProducto(elem);
    };
});

const listarServicio = (servicio) => {
    cliente.value = servicio.cliente;
    direccion.value = servicio.direccion;
    telefono.value = servicio.telefono;
    idCliente.value = servicio.idCliente;

    codProd.value = servicio.codProd;
    producto.value = servicio.producto;
    modelo.value = servicio.modelo;
    marca.value = servicio.marca;
    serie.value = servicio.serie;
    problemas.value = servicio.problemas;

    detalles.value = servicio.detalles;
    vendedor.value = servicio.vendedor;
    estado.value = servicio.estado;
    
};

const listarCliente = (elem) => {
    idCliente.value = elem._id;
    cliente.value = elem.nombre;
    direccion.value = elem.direccion;
    telefono.value = elem.telefono;
    codProd.focus();
};

const listarProducto = (elem) => {
    codProd.value = elem._id;
    producto.value = elem.descripcion;
    marca.value = elem.marca;
    modelo.focus();
};

idCliente.addEventListener('keypress',async e=>{
    if (e.keyCode === 13 && idCliente.value !== "") {
        const cliente = (await axios.get(`${URL}clientes/id/${idCliente.value}`)).data;
        console.log(cliente)
        if (cliente) {
            listarCliente(cliente);
            codProd.focus();
        }else{
            await sweet.fire({
                title:"Cliente no encontrado"
            });
            idCliente.value = "";
        }
    }else if(e.keyCode === 13 && idCliente.value === ""){
        
        const opciones = {
            path: './clientes/clientes.html',
            botones:false,
        }

        ipcRenderer.send('abrir-ventana', opciones);

    };
});

cliente.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        direccion.focus();
    }
});

direccion.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        telefono.focus();
    }
});

telefono.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        producto.focus();
    }
});

codProd.addEventListener('keypress',e=>{
    if (e.keyCode === 13 && producto.value === "") {
        const opciones = {
            botones:false,
            path: './productos/productos.html'
        }
        ipcRenderer.send('abrir-ventana',opciones);
    }
});

modelo.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        marca.focus();
    }
});

marca.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        serie.focus();
    }
});

serie.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        problemas.focus();
    }
});

agregar.addEventListener('click',async e=>{
    const servicio = {};
    servicio.idCliente = idCliente.value;
    servicio.cliente = cliente.value.toUpperCase();
    servicio.direccion = direccion.value.toUpperCase();
    servicio.telefono = telefono.value;

    servicio.codProd = codProd.value;
    servicio.producto = producto.value.toUpperCase();
    servicio.modelo = modelo.value.toUpperCase();
    servicio.marca = marca.value.toUpperCase();
    servicio.serie = serie.value;

    servicio.vendedor = vendedor.value;
    servicio.estado = estado.value;
    servicio.problemas = problemas.value.toUpperCase();

    try {
        await axios.post(`${URL}servicios`,servicio);
        location.href = './servicio.html';
    } catch (error) {
        await sweet.fire({
            title:"No se pudo cargar el servicio"
        })
    }
});

modificar.addEventListener('click',async e=>{
    const servicioNuevo = {};
    servicioNuevo.idCliente = idCliente.value;
    servicioNuevo.cliente = cliente.value.toUpperCase();
    servicioNuevo.direccion = direccion.value.toUpperCase();
    servicioNuevo.telefono = telefono.value;

    servicioNuevo.codProd = codProd.value;
    servicioNuevo.producto = producto.value.toUpperCase();
    servicioNuevo.modelo = modelo.value.toUpperCase();
    servicioNuevo.marca = marca.value.toUpperCase();
    servicioNuevo.serie = serie.value;

    servicioNuevo.problemas = problemas.value.toUpperCase();

    servicioNuevo.detalles = detalles.value.toUpperCase();
    servicioNuevo.vendedor = vendedor.value;
    servicioNuevo.estado = estado.value;


    // vendedor.value && await modificacionesEnServicios(servicio,servicioNuevo)
    try {
        await axios.put(`${URL}servicios/id/${servicioId}`,servicioNuevo);
        location.href = './servicio.html';
    } catch (error) {
        sweet.fire({
            title:"No se pudo modificar el servicio"
        })
    }
});

const modificacionesEnServicios = async(servicioViejo,servicioNuevo)=>{
    if (servicioViejo.cliente !== servicioNuevo.cliente) {
        await agregarMovimientoVendedores(`Se modifico el cliente ${servicioViejo.cliente} a ${servicioNuevo.cliente}`,vendedor.value);
    }
    if (servicioViejo.problemas !== servicioNuevo.problemas) {
        await agregarMovimientoVendedores(`Se modifico el detalle ${servicioViejo.problemas} a ${servicioNuevo.problemas}`,vendedor.value);
    }
    if (servicioViejo.marca !== servicioNuevo.marca) {
        await agregarMovimientoVendedores(`Se modifico la marca ${servicioViejo.marca} a ${servicioNuevo.marca}`,vendedor.value);
    }
    if (servicioViejo.modelo !== servicioNuevo.modelo) {
        await agregarMovimientoVendedores(`Se modifico el modelo ${servicioViejo.modelo} a ${servicioNuevo.modelo}`,vendedor.value);
    }
    if (servicioViejo.producto !== servicioNuevo.producto) {
        await agregarMovimientoVendedores(`Se modifico el prodcuto ${servicioViejo.producto} a ${servicioNuevo.producto}`,vendedor.value);
    }
    if (servicioViejo.serie !== servicioNuevo.serie) {
        await agregarMovimientoVendedores(`Se modifico el numero de serie ${servicioViejo.serie} a ${servicioNuevo.serie}`,vendedor.value);
    }
    if (servicioViejo.telefono !== servicioNuevo.telefono) {
        await agregarMovimientoVendedores(`Se modifico el telefono ${servicioViejo.telefono} a ${servicioNuevo.telefono}`,vendedor.value);
    }
    if (servicioViejo.total !== servicioNuevo.total) {
        await agregarMovimientoVendedores(`Se modifico el total ${servicioViejo.total} a ${servicioNuevo.total}`,vendedor.value);
    }
    if (servicioViejo.direccion !== servicioNuevo.direccion) {
        await agregarMovimientoVendedores(`Se modifico la direccion ${servicioViejo.direccion} a ${servicioNuevo.direccion}`,vendedor.value);
    }
};

salir.addEventListener('click',e=>{
    location.href = './servicio.html';
});

document.addEventListener('keyup',e=>{
    if (e.keyCode === 27) {
        location.href = './servicio.html';
    }
});