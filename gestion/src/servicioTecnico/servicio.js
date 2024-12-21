const axios = require('axios');
const { ipcRenderer } = require('electron');
require("dotenv").config();
const URL = process.env.GESTIONURL;
const sweet = require('sweetalert2');

const {caja,vendedores} = require('../configuracion.json');
const { verificarUsuarios } = require('../helpers');

const buscador = document.getElementById('buscador');

const tbody = document.querySelector('tbody');

//botones
const agregar = document.getElementById('agregar');
const modificar = document.getElementById('modificar');
const salir = document.getElementById('salir');

let servicios;
let seleccionado;
let subSeleccionado;

let vendedor;

window.addEventListener('load',async e=>{

    vendedor = await verificarUsuarios();

    if (vendedores && vendedor === "") {
        await sweet.fire({
        title:"Contraseña incorrecta"
        });
        location.reload();
        
    }else if(vendedores && !vendedor){
        location.href = '../menu.html';
    };

    const movVendedor = {
        descripcion: `El vendedor ${vendedor.nombre} Ingreso a la lista de Servicio Tecnico`,
        vendedor: vendedor.nombre,
        tipo: 'Servicio'
    };

    await axios.post(`${URL}movVendedores`, movVendedor);

    buscador.focus();

    servicios = (await axios.get(`${URL}servicios`)).data;
    listarServicios(servicios);
});

const listarServicios = (lista)=>{

    tbody.innerHTML = "";

    for(let servicio of lista){
        const tr = document.createElement('tr');
        tr.id = servicio._id;

        servicio.estado === 3 && tr.classList.add('bg-green');
        servicio.estado === 2 && tr.classList.add('bg-gray');
        servicio.estado === 1 && tr.classList.add('bg-yellow');
        servicio.estado === 0 && tr.classList.add('bg-red');

        const fechaIngreso  = servicio.fecha.slice(0,10).split('-',3);
        const fechaEgreso = servicio.fechaEgreso?.slice(0,10).split('-',3);

        const tdNum = document.createElement('td');
        const tdFechaIngreso = document.createElement('td');
        const tdCliente = document.createElement('td');
        const tdTelefono = document.createElement('td');
        const tdDireccion = document.createElement('td');
        const tdProducto = document.createElement('td');
        const tdMarca = document.createElement('td');
        const tdModelo = document.createElement('td');
        const tdEgreso = document.createElement('td');
        const tdVendedor = document.createElement('td');
        const tdEstado = document.createElement('td');
        
        let estadoAux = "";

        if (servicio.estado === 0) {
            estadoAux = "Sin Revisar";
        }else if (servicio.estado === 1) {
            estadoAux = "Revisado";
        }else if (servicio.estado === 2) {
            estadoAux = "Finalizado";
        }else if (servicio.estado === 3) {
            estadoAux = "Egresado";
        }; {
            
        }
        tdNum.innerText = servicio.numero;
        tdFechaIngreso.innerText = `${fechaIngreso[2]}/${fechaIngreso[1]}/${fechaIngreso[0]}`;
        tdCliente.innerText = servicio.cliente;
        tdTelefono.innerText = servicio.idCliente.telefono;
        tdDireccion.innerText = servicio.idCliente.direccion;
        tdProducto.innerText = servicio.codProd.descripcion;
        tdMarca.innerText = servicio.codProd.marca;
        tdModelo.innerText = servicio.modelo;
        tdEgreso.innerText = fechaEgreso ?  `${fechaEgreso[2]}/${fechaEgreso[1]}/${fechaEgreso[0]}` : "" ;
        tdVendedor.innerText = servicio.vendedor;
        tdEstado.innerText = estadoAux;


        tr.appendChild(tdNum);
        tr.appendChild(tdFechaIngreso);
        tr.appendChild(tdCliente);
        tr.appendChild(tdTelefono);
        tr.appendChild(tdDireccion);
        tr.appendChild(tdProducto);
        tr.appendChild(tdMarca);
        tr.appendChild(tdModelo);
        tr.appendChild(tdEgreso);
        tr.appendChild(tdEstado);
        
        tbody.appendChild(tr);
    }
};

const buscarServicios = async(e) => {
    let text = e.target.value === "" ? "vacio" : e.target.value;
    if (e.keyCode === 13) {

        const servicios = (await axios.get(`${URL}servicios/forText/${text}`)).data;
        listarServicios(servicios);

        const numerosServicios = (servicios.map( ser => ser.numero)).join(',');

        const movVendedor = {
            descripcion: `El vendedor ${vendedor.nombre} busco los servicios ${text.toUpperCase()} Y se encontraron los servicios ${numerosServicios}`,
            vendedor: vendedor.nombre,
            tipo: 'Servicio'
        };

        await axios.post(`${URL}movVendedores`, movVendedor);
    };
};

tbody.addEventListener('dblclick',e=>{
    if (e.target.nodeName === "TD") {
        ipcRenderer.send('abrir-ventana',{
            path:`servicioTecnico/agregarServicio.html`,
            ancho:1200,
            altura:550,
            reinicio:true,
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
            vendedor:vendedor
        })
    }
});

buscador.addEventListener('keypress', buscarServicios);

agregar.addEventListener('click', async e=>{
    const ven = await verificarUsuarios();
    
    if (ven) {
        const movVendedor = {
        descripcion: `El vendedor ${ven.nombre} Ingreso a Agregar un Servicio Tecnico`,
        vendedor: ven.nombre
        };

        await axios.post(`${URL}movVendedores`, movVendedor);
        location.href = `agregarServicio.html?vendedor=${ven.codigo}`;
    }else{
        await sweet.fire({
            title: "Contraseña incorrecta"
        })
    }
});

modificar.addEventListener('click', async e => {
    const ven = await verificarUsuarios();
    location.href = `agregarServicio.html?vendedor=${ven.codigo}&id=${seleccionado.id}`;
});

salir.addEventListener('click',e=>{
    location.href = '../menu.html';
});

document.addEventListener('keyup', e => {

    if (e.keyCode === 27) {
        location.href = '../menu.html';
    };

});