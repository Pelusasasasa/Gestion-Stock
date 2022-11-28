const axios = require('axios');
const { ipcRenderer } = require('electron');
require("dotenv").config();
const URL = process.env.URL;
const sweet = require('sweetalert2');

const tbody = document.querySelector('tbody');

//botones
const agregar = document.getElementById('agregar');
const salir = document.getElementById('salir');

let servicios;
let seleccionado;
let subSeleccionado;

window.addEventListener('load',async e=>{
    servicios = (await axios.get(`${URL}servicios`)).data;
    listarServicios(servicios);
});


const listarServicios = (lista)=>{
    for(let servicio of lista){
        const tr = document.createElement('tr');
        tr.id = servicio._id;

        const fechaIngreso  = servicio.fecha.slice(0,10).split('-',3);

        const tdFechaIngreso = document.createElement('td');
        const tdCliente = document.createElement('td');
        const tdTelefono = document.createElement('td');
        const tdDireccion = document.createElement('td');
        const tdEmail = document.createElement('td');
        const tdProducto = document.createElement('td');
        const tdNumeroSerie = document.createElement('td');
        const tdDetalles = document.createElement('td');
        const tdAcciones = document.createElement('td');

        tdFechaIngreso.innerHTML = `${fechaIngreso[2]}/${fechaIngreso[1]}/${fechaIngreso[0]}`;
        tdCliente.innerHTML = servicio.cliente;
        tdTelefono.innerHTML = servicio.telefono;
        tdDireccion.innerHTML = servicio.direccion;
        tdEmail.innerHTML = servicio.email;
        tdProducto.innerHTML = servicio.producto;
        tdNumeroSerie.innerHTML = servicio.numeroSerie;
        tdDetalles.innerHTML = servicio.detalles;
        tdAcciones.classList.add('acciones');
        tdAcciones.innerHTML = `
            <span id=detalle class=material-icons>article</span>
            <span id=delete class=material-icons>delete</span>

        `

        tr.appendChild(tdFechaIngreso);
        tr.appendChild(tdCliente);
        tr.appendChild(tdTelefono);
        tr.appendChild(tdDireccion);
        tr.appendChild(tdEmail);
        tr.appendChild(tdProducto);
        tr.appendChild(tdNumeroSerie);
        tr.appendChild(tdDetalles);
        tr.appendChild(tdAcciones);
        
        tbody.appendChild(tr);
    }
};

tbody.addEventListener('click',e=>{
    seleccionado && seleccionado.classList.remove('seleccionado');
    seleccionado = e.target.nodeName === "TD" ? e.target.parentNode : e.target.parentNode.parentNode;
    seleccionado.classList.add('seleccionado');

    subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');
    subSeleccionado = e.target.nodeName === "TD" ? e.target : e.target.parentNode;
    subSeleccionado.classList.add('subSeleccionado');

    if (e.target.id === "delete") {
        sweet.fire({
            title:"Quiere Eliminar el servicio",
            confirmButtonText:"Aceptar",
            showCancelButton:true
        }).then(async({isConfirmed})=>{
            if (isConfirmed) {
                try {
                    await axios.delete(`${URL}servicios/id/${seleccionado.id}`);
                    tbody.removeChild(seleccionado);
                } catch (error) {
                    await sweet.fire({
                        title:"No se pudo eliminar el servicio"
                    });
                }
            }
        })
    }else if(e.target.id === "detalle"){
        ipcRenderer.send('abrir-ventana',{
            path:`servicioTecnico/agregarServicio.html`,
            ancho:1200,
            altura:550,
            informacion:seleccionado.id
        })
    }
});

agregar.addEventListener('click',e=>{
    ipcRenderer.send('abrir-ventana',{
        path:"servicioTecnico/agregarServicio.html",
        ancho:1200,
        altura:550
    })
});

salir.addEventListener('click',e=>{
    location.href = '../menu.html';
});