require('dotenv').config();
const axios = require('axios');
const { default: Swal } = require('sweetalert2');
const { parsearFecha, getParameterByName } = require('../helpers');
const { ipcRenderer } = require('electron');

const vendedor = getParameterByName('vendedor');

const URL = process.env.GESTIONURL;

const imprimir = document.getElementById('imprimir');
const agregar = document.getElementById('agregar');

const cantidad = document.getElementById('cantidad');
const tbody = document.getElementById('tbody');

let servicios = [];
let equipos = [];

const agregarServicioALista = (servicio) => {

    const fragment = document.createDocumentFragment();
    const tr = document.createElement('tr');

    tr.id = servicio._id;

    const tdNumero = document.createElement('td');
    const tdFecha = document.createElement('td');
    const tdNombre = document.createElement('td');
    const tdDireccion = document.createElement('td');
    const tdTelefono = document.createElement('td');
    const tdEstado = document.createElement('td');
    const tdVendedor = document.createElement('td');
    const tdAcciones = document.createElement('td');

    tdAcciones.classList.add('flex');
    tdAcciones.classList.add('gap-2');
    tdAcciones.classList.add('justify-center');
        
    tdNumero.innerText = servicio.numero;
    tdFecha.innerText = parsearFecha(servicio.fecha);
    tdNombre.innerText = servicio.datosClientes?.nombre ?? '';
    tdDireccion.innerText = servicio.datosClientes?.direccion ?? '';
    tdTelefono.innerText = servicio.datosClientes?.telefono ?? '';
    tdEstado.innerText = servicio.estado;
    tdVendedor.innerText = servicio.vendedor.nombre;
    tdAcciones.innerHTML = `
            <div class=tool>
                    <span class=material-icons-outlined title='Modificar' id='edit'>edit</span>
                </div>
            <div class=tool>
                <span class=material-icons-outlined title='Eliminar' id='delete'>delete</span>
            </div>
        `

    tr.appendChild(tdNumero);
    tr.appendChild(tdFecha);
    tr.appendChild(tdNombre);
    tr.appendChild(tdDireccion);
    tr.appendChild(tdTelefono);
    tr.appendChild(tdEstado);
    tr.appendChild(tdVendedor);
    tr.appendChild(tdAcciones);

    fragment.appendChild(tr);

    tbody.appendChild(fragment);

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
            agregarServicioALista(data.servicio);
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
    cantidad.innerText = lista.length;

    for(let equipo of equipos){
        const servicio = lista.find(elem => elem.numero === equipo.numero);

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
        tdEquipo.innerText = equipo.equipo.slice(0,30);
        tdEstado.innerHTML = `<p class='m-0 bg-red-50 px-1 text-sm text-red-800 rounded text-semibold rounded-full inline-flex'>${equipo.estado}</p>`;
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
        tr.appendChild(tdDireccion);
        tr.appendChild(tdTelefono);
        tr.appendChild(tdEquipo);
        tr.appendChild(tdEstado);
        tr.appendChild(tdVendedor);
        tr.appendChild(tdAcciones);
        
        
        tbody.appendChild(tr);
    };
};


agregar.addEventListener('click', () => {
    location.href = `./agregarServicio.html?vendedor=${vendedor}`;
})

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
        location.href = `./agregarServicio.html?vendedor${vendedor}&numero=${numero}`;
        console.log(numero)
    }else if(e.target.id === 'delete'){
        eliminarServicio(e)
    };
});

window.addEventListener('load', cargarPagina);