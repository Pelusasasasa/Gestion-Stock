require('dotenv').config();
const axios = require('axios');
const { default: Swal } = require('sweetalert2');
const { parsearFecha } = require('../helpers');




const URL = process.env.GESTIONURL;


const cantidad = document.getElementById('cantidad');
const tbody = document.getElementById('tbody');

const cargarPagina = async () => {
    traerServicios();
};

const eliminarServicio = async(e) => {
    const id = e.target.parentNode.parentNode.parentNode.id;
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
}

const traerServicios = async() => {

    try {
        const { data } = await axios.get(`${URL}servicios`);

        if(data.ok){
            servicios = data.servicios;
            listarServicios(servicios)
        }else{
            await Swal.fire('Error al traer los servicios tecnicos', data.msg, 'error');
        }
    } catch (error) {
        console.log(error);
        await Swal.fire('Error al traer los servicios tecnicos', error?.response?.data?.msg, 'error');
    }

};

const listarServicios = async(lista) => {

    for(let servicio of lista){
        
        const tr = document.createElement('tr');
        tr.id = servicio._id;

        const tdNumero = document.createElement('td');
        const tdFecha = document.createElement('td');
        const tdCliente = document.createElement('td');
        const tdDireccion = document.createElement('td');
        const tdTelefono = document.createElement('td');
        const tdEstado = document.createElement('td');
        const tdVendedor = document.createElement('td');
        const tdAcciones = document.createElement('td');

        tdAcciones.classList.add('flex')
        tdAcciones.classList.add('gap-2')
        tdAcciones.classList.add('justify-center')

        tdNumero.innerText = servicio.numero;
        tdFecha.innerText = parsearFecha(servicio.fecha);
        tdCliente.innerText = servicio.datosClientes.nombre.toUpperCase();
        tdDireccion.innerText = servicio.datosClientes.direccion;
        tdTelefono.innerText = servicio.datosClientes.telefono;
        tdEstado.innerText = servicio.estado;
        tdVendedor.innerText = servicio.vendedor;
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
        tr.appendChild(tdCliente);
        tr.appendChild(tdDireccion);
        tr.appendChild(tdTelefono);
        tr.appendChild(tdEstado);
        tr.appendChild(tdVendedor);
        tr.appendChild(tdAcciones);

        tbody.appendChild(tr);


        document.getElementById('delete').addEventListener('click', eliminarServicio);
    };
};

window.addEventListener('load', cargarPagina);