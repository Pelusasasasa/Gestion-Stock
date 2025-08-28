const { default: Swal } = require("sweetalert2");
const { parsearFecha, getParameterByName, fechaConHora, masVeinticuatroHoras } = require("../helpers");
const axios = require('axios');
const { ipcRenderer } = require("electron");
require('dotenv').config();

const URL = process.env.GESTIONURL;

let vendedor = getParameterByName('vendedor');
let permiso = getParameterByName('permiso');
let numeroTraido = getParameterByName('numero')

const cancelar = document.getElementById('cancelar');
const guardar = document.getElementById('guardar');
const modificar = document.getElementById('modificar');

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
const tbody = document.getElementById('tbody');

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
    numero.value = `ST-${(data.Servicio).toString().padStart(4, '0')}`;


    traerParaModificar();
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
            ipcRenderer.send('imprimir-servicio', {
                servicio: data.servicio,
                equipos: data.equiposCargados
            });
            location.href = `./servicio.html?vendedor=${vendedor}`;
        }else{
            await Swal.fire('Error al crear el servicio', data.msg, 'error');
        };
    } catch (error) {
        console.log(error);
        return await Swal.fire('Error al crear el servicio', error?.response?.data?.msg, 'error');
    }
};

const cambiarEquipo = async(e) => {
    if(e.target.nodeName === 'SPAN'){
        productosAgregados.removeChild(e.target.parentNode.parentNode);
        equipos = equipos.filter(equipo => equipo.equipo !== e.target.parentNode.parentNode.children[0].innerText);
    };

    if(e.target.nodeName === 'SELECT'){
        const equipoTraido = equipos.find(equipo => equipo.equipo === e.target.parentNode.children[0].innerText);
        equipoTraido.estado = e.target.value
    };
};

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
        div.classList.add('border-b');
        div.classList.add('border-gray-400');
        

        div.innerHTML = `
            <p class='m-0'>${cliente.nombre}</p>
            <p class='m-0'>${cliente.direccion}</p>
            <p class='m-0'>${cliente.telefono}</p>
        `

        listaClientes.appendChild(div);
    };
};

const listarHistorial = (historial) => {
    const fragment = document.createDocumentFragment();
    for(let elem of historial){
        const tr = document.createElement('tr');

        const tdFecha = document.createElement('td');
        const tdEquipo = document.createElement('td');
        const tdEstado = document.createElement('td');

        tdFecha.classList.add('border', 'text-center');
        tdEquipo.classList.add('border', 'text-center');
        tdEstado.classList.add('border', 'text-center');

        tdFecha.innerText = parsearFecha(elem.fecha);
        tdEquipo.innerText = elem.equipo?.slice(0, 50) ?? '';
        tdEstado.innerText = elem.estado;

        tr.appendChild(tdFecha);
        tr.appendChild(tdEquipo);
        tr.appendChild(tdEstado);

        fragment.appendChild(tr);
    };
    console.log(tbody)
    tbody.appendChild(fragment)
}

const listarServicio = (servicio, lista) => {
    numero.value = `ST-${servicio.numero.toString().padStart(4, '0')}`;
    fecha.value = parsearFecha(servicio.fecha).slice(0, 10).split('/', 3).reverse().join('-');

    cliente.value = servicio?.datosClientes?.nombre ?? '';
    direccion.value = servicio?.datosClientes?.direccion ?? '';
    telefono.value = servicio?.datosClientes?.telefono ?? '';

    sugerencia.value = servicio.sugerencias;

    for(let equipo of lista){
        equipos.push({
        _id: equipo._id,
        equipo: equipo.equipo,
        marca: equipo.marca,
        serie: equipo.serie,
        estado: equipo.estado
    });

    productosAgregados.innerHTML += `
        <div class='grid columns-5-4fr-1fr-1fr-1fr-1fr w-full'>
            <p class='m-0 '>${equipo.equipo}</p>
            <p class='m-0 text-center'>${equipo.marca}</p>
            <p class='m-0 text-center'>${equipo.serie}</p>
            <select id='estado' class='m-0 text-xs h-fit-content'>
                <option ${equipo.estado === 'Pendiente' && 'selected'} value='Pendiente'>Sin Revisar</option>
                <option ${equipo.estado === 'Proceso' && 'selected'} value='Proceso'>En Proceso</option>
                <option ${equipo.estado === 'Finalizado' && 'selected'} value='Finalizado'>Finalizado</option>
                <option ${equipo.estado === 'Entregado' && 'selected'} value='Entregado'>Entregado</option>
            </select>
            <p class='${verDisponibilidadParaEliminar(servicio)} m-0 text-center cursor-pointer'><span class=material-icons-outlined id=delete>delete</span></p>
        </div>
    `
    }
};

const listarProductos = (lista) => {
    listaProductos.innerHTML = '';
    listaProductos.parentNode.classList.remove('none');

    for(let producto of lista){
        const div = document.createElement('div');
        div.addEventListener('click', seleccionarProducto);

        div.classList.add('grid');
        div.classList.add('columns-3-1fr-2fr-1fr');
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

const modificarSerivicio = async() => {
    const servicio = {
        fecha: fechaConHora(fecha.value),
        datosClientes: {
            nombre: cliente.value,
            direccion: direccion.value,
            telefono: telefono.value
        },
        sugerencias: sugerencia.value,
        vendedor
    };
    try {
        const { data } = await axios.put(`${URL}servicios/${modificar.id}`, {
            servicio,
            equipos,
            vendedor
        });
        const { isConfirmed } = await Swal.fire({
            title: 'Quiere Reimprimir',
            confirmButtonText: 'Aceptar',
            showCancelButton: true
        });

        if(isConfirmed){
            ipcRenderer.send('imprimir-servicio', {
                servicio: data.servicio,
                equipos: data.equiposModificados
            });
        }

        location.href = `./servicio.html?vendedor=${vendedor}`;
    } catch (error) {
        console.log(error);
        return await Swal.fire('Error al modifiar el servicio Tecnico', error.response.data.msg, 'error');
    }
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
        <div class='grid columns-5-4fr-1fr-1fr-1fr-1fr w-full'>
            <p class='m-0'>${productoDiv.children[1].innerText}</p>
            <p class='m-0 text-center'>${productoDiv.children[2].innerText}</p>
            <p class='m-0 text-center'>${value}</p>
            <select class='m-0 text-xs h-fit-content'>
                <option selected>Sin Revisar</option>
                <option>En Proceso</option>
                <option>Finalizado</option>
                <option>Entregado</option>
            </select>
            <p class='m-0 text-center cursor-pointer'><span class=material-icons-outlined id=delete>delete</span></p>
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

const traerParaModificar = async() => {
    if(!numeroTraido) return;

    try {
        const { data }  = await axios.get(`${URL}servicios/numero/${numeroTraido}`);

        if(data.ok){
            listarServicio(data.servicio, data.equipos);
            listarHistorial(data.historial)

            guardar.classList.add('none');
            modificar.classList.remove('none');
            modificar.id = data.servicio._id;

            if(permiso === "2"){
                fecha.disabled = true;
                cliente.disabled = true;
                producto.disabled = true;
            }
        }else{
            return await Swal.fire('Error al obtener el servicio', data.msg, 'error');
        };
    } catch (error) {
        console.log(error);
        return await Swal.fire('Error al obtener el servicio', error?.response?.data?.msg, 'error');
    }
};

const verDisponibilidadParaEliminar = (servicio) => {
    if(permiso === '2' && numeroTraido){
        return 'none';
    }else if(permiso === '1'){
        const aux = masVeinticuatroHoras(servicio.fecha);
        return aux ? 'none' : '';
    }else{
        return '';
    }
};

cancelar.addEventListener('click', () => location.href = './servicio.html');
cliente.addEventListener('keypress', buscarCliente);
guardar.addEventListener('click', crearServicio);
modificar.addEventListener('click', modificarSerivicio);
producto.addEventListener('keypress', buscarProducto);
productosAgregados.addEventListener('click', cambiarEquipo);
window.addEventListener('load', cargarPagina);