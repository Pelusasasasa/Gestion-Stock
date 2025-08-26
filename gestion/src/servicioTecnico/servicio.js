require('dotenv').config();
const axios = require('axios');
const { default: Swal } = require('sweetalert2');
const { parsearFecha, getParameterByName } = require('../helpers');
const { ipcRenderer } = require('electron');

const vendedor = getParameterByName('vendedor');

const URL = process.env.GESTIONURL;

const volver = document.getElementById('volver');
const buscador = document.getElementById('buscador');
const imprimir = document.getElementById('imprimir');
const agregar = document.getElementById('agregar');

const cantidad = document.getElementById('cantidad');
const tbody = document.getElementById('tbody');

let servicios = [];
let equipos = [];

const agregarHTMLServicio = (servicio = {}, equipo = {}) => {
    let colorEstado = 'bg-red-50 text-red-800'

    if(equipo.estado === 'Proceso') colorEstado = 'bg-yellow-50 text-yellow-800';
    if(equipo.estado === 'Finalizado') colorEstado = 'bg-green-50 text-green-800';
    if(equipo.estado === 'Entregado') colorEstado = 'bg-blue-50 text-blue-800';

    const parrafoEstado =  `<div class='flex justify-center items-center'><p class='m-0 ${colorEstado} justify-center px-1 text-sm rounded text-semibold rounded-full inline-flex'>${equipo?.estado ?? ''}</p></div>`

    const tr = document.createElement('tr');
        tr.id = servicio._id;

        const tdNumero = document.createElement('td');
        const tdFecha = document.createElement('td');   
        const tdCliente = document.createElement('td');
        const tdDireccion = document.createElement('td');
        const tdTelefono = document.createElement('td');
        const tdEquipo = document.createElement('td');
        const tdEstado = document.createElement('td');
        const tdVendedor = document.createElement('td');
        const tdAcciones = document.createElement('td');

        tdAcciones.classList.add('flex')
        tdAcciones.classList.add('gap-2')
        tdAcciones.classList.add('justify-center')

        tdNumero.innerText = servicio.numero;
        tdFecha.innerText = parsearFecha(servicio.fecha);
        tdCliente.innerText = servicio.datosClientes?.nombre.toUpperCase() ?? '';
        tdDireccion.innerText = servicio.datosClientes?.direccion ?? '';
        tdTelefono.innerText = servicio.datosClientes?.telefono ?? '';
        tdEquipo.innerText = equipo?.equipo?.slice(0,50) ?? '';
        tdEstado.innerHTML = parrafoEstado;
        tdVendedor.innerText = servicio.vendedor.nombre;
        tdAcciones.innerHTML = `
            <div class=tool>
                <span class=material-icons-outlined title='Re-Imprimir' id='printer'>print</span>
            </div>
            <div class=tool>
                <span class=material-icons-outlined title='Modificar' id='edit'>edit</span>
            </div>
            <div class=tool>
                <span class=material-icons-outlined title='Eliminar' id='delete'>delete</span>
            </div>
        `;

        servicio

        tr.appendChild(tdNumero);
        tr.appendChild(tdFecha);
        tr.appendChild(tdCliente);
        tr.appendChild(tdEquipo);
        tr.appendChild(tdEstado);
        tr.appendChild(tdVendedor);
        tr.appendChild(tdAcciones);
        tr.appendChild(tdDireccion);
        tr.appendChild(tdTelefono);
        
        
        tbody.appendChild(tr);
};

const buscar = (e) => {
    const texto = e.target.value.toUpperCase();


    const equiposFiltrados = equipos.filter(elem => elem.equipo.toUpperCase().startsWith(texto));
    const serviciosFiltrados = servicios.filter(elem => elem.datosClientes.nombre.toUpperCase().startsWith(texto));
    
    for(let servicio of serviciosFiltrados){
        const equipo = equipos.filter(elem => elem.numero === servicio.numero);
        equiposFiltrados.push(...equipo);
    }
    
    const sinRepetidos = [...new Map(equiposFiltrados.map(item => [item._id, item])).values()];
    listarServicios(servicios, sinRepetidos)
};

const cargarPagina = async () => {
    traerServicios();
};

const reImprimirservicio = async(e) => {
    const id = e.target.parentNode.parentNode.parentNode.id;
    try {
        const { data } = await axios.get(`${URL}servicios/${id}`);
        if(data.ok){
            ipcRenderer.send('imprimir-servicio', {
                servicio: data.servicio,
                equipos: data.equipos
            });
        }else{
            return Swal.fire('Error al cargar el servicio', data.msg, 'error');
        };
    } catch (error) {
        console.log(error);
        return Swal.fire(`Error al obtener el servicio`, error?.response?.data?.msg, 'error');
    }
};

const eliminarServicio = async(e) => {
    const id = e.target.parentNode.parentNode.parentNode.id;
    const numero = e.target.parentNode.parentNode.parentNode.children[0].innerText;

    const { isConfirmed } = await Swal.fire({
        title: 'Quiere eliminar el servicio?',
        showCancelButton: true,
        confirmButtonText: 'Aceptar'
    });


    if(!isConfirmed) return;

    try {
        
        const { data } = await axios.delete(`${URL}servicios/${id}`);
        if(data.ok){
            await Swal.fire('Servicio eliminado', '', 'success');
            document.getElementById(id).remove();
            const trs = document.querySelectorAll('tbody tr');
            for(let tr of trs){
                if(tr.children[0].innerText === numero){
                    tr.remove();
                }
            };
        }else{
            await Swal.fire('Error al eliminar el servicio', data.msg, 'error');
        }
    } catch (error) {
        console.log(error);
        return await Swal.fire('Error al eliminar servicio', error?.response?.data?.msg, 'error');
    } 
};

const imprimirNuevoServicio = async(e) => {
    try {
        const servicio = {}
        servicio.vendedor = vendedor;
        servicio.datosClientes = {};

        const {isConfirmed} = await Swal.fire({
            confirmButtonText: 'Aceptar',
            showCancelButton: true,
            title: 'Quiere Agrega un servicio en blanco'
        });

        if(!isConfirmed) return;

        const { data } = await axios.post(`${URL}servicios`, servicio);
        if(data.ok){
            agregarHTMLServicio(data.servicio, {});
            ipcRenderer.send('imprimir-servicio', {
                servicio: data.servicio,
                equipos: []
            });
        }else{
            return await Swal.fire('Error al cargar el servicio', data.msg, 'error');
        }
    } catch (error) {
        console.log(error);
        return await Swal.fire('error al cargar el servicio', error?.response?.data?.msg, 'error');
    }
};

const traerServicios = async() => {

    try {
        const { data } = await axios.get(`${URL}servicios`);
        if(data.ok){
            servicios = data.servicios;
            equipos = data.equipos;
            listarServicios(servicios, equipos);
        }else{
            await Swal.fire('Error al traer los servicios tecnicos', data.msg, 'error');
        }
    } catch (error) {
        console.log(error);
        await Swal.fire('Error al traer los servicios tecnicos', error?.response?.data?.msg, 'error');
    }

};

const listarServicios = async(lista, equipos) => {
    let serviciosCopia = [...lista];

    tbody.innerHTML = '';

    cantidad.innerText = lista.length;

    for(let equipo of equipos){
        const servicio = lista.find(elem => elem.numero === equipo.numero);
        serviciosCopia = serviciosCopia.filter(elem => elem.numero !== equipo.numero);

        
        agregarHTMLServicio(servicio, equipo);
    };


    for(let servicio of serviciosCopia){
        agregarHTMLServicio(servicio, {})
    }
};

agregar.addEventListener('click', () => {
    location.href = `./agregarServicio.html?vendedor=${vendedor}`;
});

buscador.addEventListener('keyup', buscar);

document.addEventListener('keyup', (e) => {
    if(e.key === 'Escape'){
        location.href = '../menu.html';
    };
});

imprimir.addEventListener('click', imprimirNuevoServicio);

tbody.addEventListener('click', e => {
    if(e.target.id === 'printer'){
        reImprimirservicio(e);
    }else if(e.target.id === 'edit'){
        const numero = e.target.parentNode.parentNode.parentNode.children[0].innerText;
        location.href = `./agregarServicio.html?vendedor=${vendedor}&numero=${numero}`;
    }else if(e.target.id === 'delete'){
        eliminarServicio(e)
    };
});

volver.addEventListener('click', () => {
    location.href = '../menu.html';
});

window.addEventListener('load', cargarPagina);