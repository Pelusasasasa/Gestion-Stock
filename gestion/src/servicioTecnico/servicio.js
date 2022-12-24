const axios = require('axios');
const { ipcRenderer } = require('electron');
require("dotenv").config();
const URL = process.env.URL;
const sweet = require('sweetalert2');

const {caja,vendedores} = require('../configuracion.json');
const { verificarUsuarios } = require('../helpers');

const tbody = document.querySelector('tbody');

//botones
const agregar = document.getElementById('agregar');
const salir = document.getElementById('salir');

let servicios;
let seleccionado;
let subSeleccionado;

let vendedor;

window.addEventListener('load',async e=>{

    if (vendedores) {
        vendedor = await verificarUsuarios();
        if (vendedor === "") {
            await sweet.fire({
                title:"Contraseña equivocada"
            }); 
            location.reload();
        }else if(!vendedor){
            location.href = '../menu.html';
        }
    }

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
        const tdProducto = document.createElement('td');
        const tdNumeroSerie = document.createElement('td');
        const tdDetalles = document.createElement('td');
        const tdMarca  = document.createElement('td');
        const tdModelo  = document.createElement('td');
        const tdFechaEgreso  = document.createElement('td');
        const tdCodigoRMA = document.createElement('td'); 
        const tdVendedor = document.createElement('td');
        const tdCaja = document.createElement('td');
        const tdAcciones = document.createElement('td');
        

        tdFechaIngreso.innerHTML = `${fechaIngreso[2]}/${fechaIngreso[1]}/${fechaIngreso[0]}`;
        tdCliente.innerHTML = servicio.cliente;
        tdTelefono.innerHTML = servicio.telefono;
        tdDireccion.innerHTML = servicio.direccion;
        tdProducto.innerHTML = servicio.producto;
        tdMarca.innerHTML = servicio.marca;
        tdModelo.innerHTML = servicio.modelo;
        tdNumeroSerie.innerHTML = servicio.numeroSerie;
        tdDetalles.innerHTML = servicio.detalles;
        tdFechaEgreso.innerHTML = servicio.tdFechaEgreso ? servicio.tdFechaEgreso : "";
        tdCodigoRMA.innerHTML = servicio.codigoRMA;
        tdCaja.innerHTML = servicio.caja;
        tdAcciones.classList.add('acciones');
        tdAcciones.innerHTML = `
            <span id=edit class=material-icons>edit</span>
            <span id=delete class=material-icons>delete</span>
        `

        tdVendedor.innerHTML = servicio.vendedor;

        tr.appendChild(tdFechaIngreso);
        tr.appendChild(tdCliente);
        tr.appendChild(tdTelefono);
        tr.appendChild(tdDireccion);
        tr.appendChild(tdProducto);
        tr.appendChild(tdModelo);
        tr.appendChild(tdMarca);
        tr.appendChild(tdNumeroSerie);
        tr.appendChild(tdDetalles);
        tr.appendChild(tdVendedor);
        tr.appendChild(tdFechaEgreso);
        tr.appendChild(tdCodigoRMA);
        tr.appendChild(tdCaja);
        tr.appendChild(tdAcciones);
        
        tbody.appendChild(tr);
    }
};

tbody.addEventListener('dblclick',e=>{
    if (e.target.nodeName === "TD") {
        ipcRenderer.send('abrir-ventana',{
            path:`servicioTecnico/agregarServicio.html`,
            ancho:1200,
            altura:550,
            informacion:seleccionado.id,
            vendedor:vendedor.nombre
        });
    }
});

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
    }else if(e.target.id === "edit"){
        ipcRenderer.send('abrir-ventana',{
            path:`servicioTecnico/agregarServicio.html`,
            ancho:1200,
            altura:550,
            informacion:seleccionado.id,
            vendedor:vendedor.nombre
        })
    }
});

agregar.addEventListener('click',e=>{
    ipcRenderer.send('abrir-ventana',{
        path:"servicioTecnico/agregarServicio.html",
        ancho:1200,
        altura:550,
        vendedor:vendedor.nombre,
        reinicio:true
    })
});

salir.addEventListener('click',e=>{
    location.href = '../menu.html';
});