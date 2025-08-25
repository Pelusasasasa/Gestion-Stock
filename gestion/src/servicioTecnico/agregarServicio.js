const { default: Swal } = require("sweetalert2");
const { parsearFecha, getParameterByName, fechaConHora } = require("../helpers");
const axios = require('axios');
require('dotenv').config();

const URL = process.env.GESTIONURL;

let vendedor = getParameterByName('vendedor');

const cancelar = document.getElementById('cancelar');
const guardar = document.getElementById('guardar');

const numero = document.getElementById('numero');
const fecha = document.getElementById('fecha');
const cliente = document.getElementById('cliente');
const direccion = document.getElementById('direccion');
const telefono = document.getElementById('telefono');
const producto = document.getElementById('producto');
const sugerencia = document.getElementById('sugerencia');
const listaClientes = document.getElementById('listaClientes');
const listaProductos = document.getElementById('listaProductos');
const productosAgregados = document.getElementById('productosAgregados');

let equipos = [];

const buscarCliente = async(e) => {
    if(e.key === 'Enter'){
        try {
            const { data } = await axios.get(`${URL}clientes/buscar/${cliente.value}`);
            if(data.ok){
                listarClientes(data.clientes)
            }else{
                return await Swal.fire('Error al obtener los clientes', data.msg, 'error');
            };
        } catch (error) {
            console.log(error);
            return await Swal.fire('Error al obtener los clientes', error?.response?.data?.msg, 'error');
        }
    };
};

const buscarProducto = async(e) => {
    if(e.key === 'Enter'){
        try {
            const { data } = await axios.get(`${URL}productos/${producto.value}/descripcion`);
            if(data){
                listarProductos(data);
            }else{
                return await Swal.fire('Error al obtener los productos', data.msg, 'error');
            };
        } catch (error) {
            console.log(error);
            return await Swal.fire('Error al obtener los productos', error?.response?.data?.msg, 'error');
        }
    };
};

const cargarPagina = async() => {
    const fechaActual = new Date();
    fecha.value = parsearFecha(fechaActual).slice(0, 10).split('/', 3).reverse().join('-');

    const  { data } = await axios.get(`${URL}numero`);
    numero.value = `ST-${(data.Servicio + 1).toString().padStart(4, '0')}`;
};

const crearServicio = async() => {

    console.log(equipos)

    const servicio = {  
        fecha: fechaConHora(fecha.value),
        datosClientes: {
            nombre: cliente.value,
            direccion: direccion.value,
            telefono: telefono.value
        },
        equipos: equipos,
        sugerencias: sugerencia.value,     
        vendedor  
    };

    try {
        const { data } = await axios.post(`${URL}servicios`, servicio);
        if(data.ok){
            await Swal.fire('Servicio creado con exito', '', 'success');
            location.href = './servicio.html';
        }else{
            await Swal.fire('Error al crear el servicio', data.msg, 'error');
        };
    } catch (error) {
        console.log(error);
        return await Swal.fire('Error al crear el servicio', error?.response?.data?.msg, 'error');
    }
};

const eliminarEquipo = async(e) => {
    if(e.target.nodeName === 'SPAN'){
        productosAgregados.removeChild(e.target.parentNode.parentNode);
        equipos = equipos.filter(equipo => equipo.equipo === e.target.parentNode.parentNode.children[1].innerText);
    }
}

const listarClientes = (lista) => {
    listaClientes.innerHTML = '';
    listaClientes.parentNode.classList.remove('none');

    for(let cliente of lista){
        const div = document.createElement('div');

        div.addEventListener('click', seleccionarCliente);

        div.classList.add('flex');
        div.classList.add('justify-between');
        div.classList.add('cursor-pointer');
        div.classList.add('hover-bg-gray');
        div.classList.add('py-1');
        

        div.innerHTML = `
            <p class='m-0'>${cliente.nombre}</p>
            <p class='m-0'>${cliente.direccion}</p>
            <p class='m-0'>${cliente.telefono}</p>
        `

        listaClientes.appendChild(div);
    };
};

const listarProductos = (lista) => {
    listaProductos.innerHTML = '';
    listaProductos.parentNode.classList.remove('none');

    for(let producto of lista){
        const div = document.createElement('div');
        div.addEventListener('click', seleccionarProducto);

        div.classList.add('flex');
        div.classList.add('justify-between');
        div.classList.add('cursor-pointer');
        div.classList.add('hover-bg-gray');
        div.classList.add('border-b');
        div.classList.add('border-gray-400');
        
        
        div.innerHTML = `
            <p class='m-0 px-1'>${producto._id}</p>
            <p class='m-0 px-1'>${producto.descripcion}</p>
            <p class='m-0 px-1'>${producto.marca}</p>
        `

        listaProductos.appendChild(div);
    };
};

const seleccionarProducto = async(e) => {
    const productoDiv = e.target.nodeName === 'DIV' ? e.target : e.target.parentNode;
    const { isConfirmed, value } = await Swal.fire({
        title: 'Numero Serie',
        confirmButtonText: 'Agregar',
        showCancelButton: true,
        input: 'text'
    });

    if(!isConfirmed) return;

    equipos.push({
        equipo: productoDiv.children[1].innerText,
        marca: productoDiv.children[2].innerText,
        serie: value,
    });

    productosAgregados.innerHTML += `
        <div class='flex justify-between w-full'>
            <p class='m-0'>${productoDiv.children[0].innerText}</p>
            <p class='m-0'>${productoDiv.children[1].innerText}</p>
            <p class='m-0'>${productoDiv.children[2].innerText}</p>
            <p class='m-0'>${value}</p>
            <p class='m-0 cursor-pointer'><span class=material-icons-outlined id=delete>delete</span></p>
        </div>
    `

    listaProductos.parentNode.classList.add('none');
    producto.value = '';
};

const seleccionarCliente = (e) => {
    const clienteDiv = e.target.nodeName === 'DIV' ? e.target : e.target.parentNode;
    
    cliente.value = clienteDiv.children[0].innerText;
    direccion.value = clienteDiv.children[1].innerText;
    telefono.value = clienteDiv.children[2].innerText;

    listaClientes.parentNode.classList.add('none');
};

cancelar.addEventListener('click', () => location.href = './servicio.html');

cliente.addEventListener('keypress', buscarCliente);
producto.addEventListener('keypress', buscarProducto);
productosAgregados.addEventListener('click', eliminarEquipo);
guardar.addEventListener('click', crearServicio);
window.addEventListener('load', cargarPagina);