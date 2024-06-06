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

const {agregarMovimientoVendedores, diferenciaObjetoServicio} = require('../helpers')

const idCliente = document.getElementById('idCliente');
const cliente = document.getElementById('cliente');
const direccion = document.getElementById('direccion');
const telefono = document.getElementById('telefono');

const codProd = document.getElementById('codProd');
const producto = document.getElementById('producto');
const modelo = document.getElementById('modelo');
const marca = document.getElementById('marca');
const agregarProduct = document.getElementById('agregarProduct');

const problemas = document.getElementById('problemas');

const tbody = document.querySelector('tbody');
const numero = document.getElementById('numero');
const vendedor = document.getElementById('vendedor');
const estado = document.getElementById('estado');


const agregar = document.getElementById('agregar');
const modificar = document.getElementById('modificar');
const salir = document.getElementById('salir');

let servicio;
let seleccionado;
let listaProductos = []; //lista para los productos que vamos agrgar al servicio tecnico 

vendedor.value = vend;

window.addEventListener('load', async e => {
    
    if (servicioId) {
        document.querySelector('title').innerText = 'Modificar Servicio';
        servicio = (await axios.get(`${URL}servicios/id/${servicioId}`)).data;        
        listarServicio(servicio);
        modificar.classList.remove('none');
        agregar.classList.add('none');
    }else{
        numero.value = (await axios.get(`${URL}numero/Servicio`)).data + 1;
    };
    
});

ipcRenderer.on('informacion',async (e,args)=>{
    vendedor.value = args.vendedor.nombre;
    if (args.informacion) {
        servicio = (await axios.get(`${URL}servicios/id/${args.informacion}`)).data;
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
    problemas.value = servicio.problemas;

    numero.value = servicio.numero;
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

const agregarProducto = () =>{
    const elem = {};
    elem.codProd = codProd.value.toUpperCase().trim();
    elem.producto = producto.value.toUpperCase().trim();
    elem.marca = marca.value.toUpperCase().trim();
    elem.modelo = modelo.value.toUpperCase().trim();
    elem.problemas = problemas.value;

    listaProductos.push(elem);
    
    codProd.value = '';
    producto.value = '';
    marca.value = '';
    modelo.value = '';
    problemas.value = '';

    codProd.focus();

    listarEnDetalles(elem);
};


tbody.addEventListener('click', e => {
    seleccionado && seleccionado.classList.remove('seleccionado');

    if (e.target.nodeName === "TD") {
        seleccionado = e.target.parentNode;
    }else if(e.target.nodeName === "TR"){
        seleccionado = e.target;
    }else if(e.target.nodeName === 'SPAN' || e.target.nodeName === 'P'){
        seleccionado = e.target.parentNode.parentNode.parentNode;
    };

    seleccionado.classList.add('seleccionado');
})

const listarEnDetalles = (parametro) => {
    const tr = document.createElement('tr');
    tr.id = parametro.codProd;

    const tdCodigo = document.createElement('td');
    const tdProducto = document.createElement('td');
    const tdMarca = document.createElement('td');
    const tdModelo = document.createElement('td');
    const tdAcciones = document.createElement('td');

    tdAcciones.classList.add('acciones')

    tdCodigo.innerText = parametro.codProd;
    tdProducto.innerText = parametro.producto;
    tdMarca.innerText = parametro.marca;
    tdModelo.innerText = parametro.modelo;
    tdAcciones.innerHTML = `
        <div id=edit class=tool>
            <span id=edit class=material-icons>edit</span>
            <p class=tooltip>Modificar</p>
        </div>
        <div id=delete class=tool>
            <span id=delete class=material-icons>delete</span>
            <p class=tooltip>Eliminar</p>
        </div>
    `

    tdAcciones.addEventListener('click', async(e) => {
                seleccionado && seleccionado.classList.remove('seleccionado');
                seleccionado = e.target.parentNode.parentNode.parentNode;
                seleccionado.classList.add('seleccionado');

            if (e.target.innerText === "edit" || e.target.innerText === "Modificar") {

                tbody.removeChild(seleccionado);

                const elem = listaProductos.find( elem => elem.codProd === seleccionado.id);
                listaProductos = listaProductos.filter( elem => elem.codProd !== seleccionado.id);

                codProd.value = elem.codProd;
                producto.value = elem.producto;
                marca.value = elem.marca;
                modelo.value = elem.modelo;
                problemas.value = elem.problemas;
                
                seleccionado = '';
            }else if(e.target.innerText === "delete" || e.target.innerText === 'Eliminar'){
                
                tbody.removeChild(seleccionado);

                listaProductos = listaProductos.filter( elem => elem.codProd !== seleccionado.id);

                seleccionado = '';
            };
    });

    tr.appendChild(tdCodigo);
    tr.appendChild(tdProducto);
    tr.appendChild(tdMarca);
    tr.appendChild(tdModelo);
    tr.appendChild(tdAcciones);

    tbody.appendChild(tr);

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
        problemas.focus();
    }
});

agregarProduct.addEventListener('click', agregarProducto);

agregar.addEventListener('click',async e=>{
   for(let elem of listaProductos){

     const servicio = {};
    
    servicio.numero = numero.value;
    
    servicio.idCliente = idCliente.value;
    servicio.cliente = cliente.value.toUpperCase();
    servicio.direccion = direccion.value.toUpperCase();
    servicio.telefono = telefono.value;

    servicio.codProd = elem.codProd;
    servicio.producto = elem.producto.toUpperCase();
    servicio.modelo = elem.modelo.toUpperCase();
    servicio.marca = elem.marca.toUpperCase();
    servicio.problemas = elem.problemas.toUpperCase();

    servicio.vendedor = vendedor.value;
    servicio.estado = estado.value;
    

    const {cliente:cli, producto:pro, message} = (await axios.post(`${URL}servicios`,servicio)).data;
    await axios.put(`${URL}numero/Servicio`, {"Servicio": servicio.numero});
    
    numero.value = parseInt(numero.value) + 1;
    if (cli) {
        await sweet.fire({
            title: "El Nombre del cliente es Necesario "
        });
    }else if(pro){
        await sweet.fire({
            title: "El Producto es Necesario "
        });
    }else if(message){

        await sweet.fire({
            title: message
        });


        const movVendedor = {
            descripcion: `El vendedor ${vend} Agrego el Servicio Tecnico del producto ${servicio.producto} del cliente ${servicio.cliente}`,
            vendedor: vend
        };

        await axios.post(`${URL}movVendedores`, movVendedor);
    };
   };

   // ipcRenderer.send('imprimir_servicio', JSON.stringify(servicio));
   location.href = './servicio.html';
    

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

    servicioNuevo.problemas = problemas.value.toUpperCase();

    servicioNuevo.vendedor = vendedor.value;
    servicioNuevo.estado = estado.value;

    servicioNuevo.fechaEgreso = servicioNuevo.estado === "3" ? new Date() : servicioNuevo.fechaEgreso = '';

    // vendedor.value && await modificacionesEnServicios(servicio,servicioNuevo)
    try {
        const a = (await axios.put(`${URL}servicios/id/${servicioId}`,servicioNuevo)).data;
        console.log(a)
        diferenciaObjetoServicio(a,servicioNuevo)
        // location.href = './servicio.html';
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