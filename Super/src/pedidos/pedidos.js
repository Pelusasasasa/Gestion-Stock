const axios = require('axios');
const { ipcRenderer } = require('electron');
require("dotenv").config();
const URL = process.env.URL;

const sweet = require('sweetalert2');

let pedidos;

const tbody = document.querySelector('tbody');

const agregar = document.getElementById('agregar');
const eliminar = document.getElementById('eliminar');
const salir = document.getElementById('salir');

let seleccionado;
let subSeleccionado;
let inputSeleccionado;


window.addEventListener('load',async e=>{
    pedidos = (await axios.get(`${URL}pedidos`)).data;
    await listarPedidos(pedidos);
});

const listarPedidos = (lista) => {
    for(let pedido of lista){
        const tr = document.createElement('tr');
        
        tr.id = pedido._id;

        const tdFecha = document.createElement('td');
        const tdCodigo = document.createElement('td');
        const tdProducto = document.createElement('td');
        const tdCantidad = document.createElement('td');
        const tdCliente = document.createElement('td');
        const tdTelefono = document.createElement('td');
        const tdStock = document.createElement('td');
        const tdEstadoPedido = document.createElement('td');
        const tdObservaciones = document.createElement('td');

        const inputEstado = document.createElement('input');

        inputEstado.value = pedido.estadoPedido;

        const fecha = pedido.fecha.slice(0,10).split('-',3);

        tdFecha.innerHTML = `${fecha[2]}/${fecha[1]}/${fecha[0]}`;
        tdCodigo.innerHTML = pedido.codigo;
        tdProducto.innerHTML = pedido.producto;
        tdCantidad.innerHTML = pedido.cantidad;
        tdCliente.innerHTML = pedido.cliente;
        tdTelefono.innerHTML = pedido.telefono;
        tdStock.innerHTML = pedido.stock;
        tdEstadoPedido.appendChild(inputEstado);
        tdObservaciones.innerHTML = pedido.observaciones

        tr.appendChild(tdFecha);
        tr.appendChild(tdCodigo);
        tr.appendChild(tdProducto);
        tr.appendChild(tdCantidad);
        tr.appendChild(tdCliente);
        tr.appendChild(tdTelefono);
        tr.appendChild(tdStock);
        tr.appendChild(tdEstadoPedido);
        tr.appendChild(tdObservaciones);

        tbody.appendChild(tr);
    }

    seleccionado = tbody.firstElementChild;
    inputSeleccionado = seleccionado.children[7].children[0];
};

tbody.addEventListener('click',e=>{
    seleccionado && seleccionado.classList.remove('seleccionado');
    seleccionado = e.target.nodeName === "TD" ? e.target.parentNode : e.target.parentNode.parentNode;
    seleccionado.classList.add('seleccionado');

    inputSeleccionado = seleccionado.children[7].children[0];

    subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');
    subSeleccionado = e.target.nodeName === "TD" ? e.target : e.target.parentNode;
    subSeleccionado.classList.add('subSeleccionado');

    inputSeleccionado.addEventListener('change',async e=>{
        const pedido = pedidos.find(pedido => pedido._id === seleccionado.id);
        pedido.estadoPedido = inputSeleccionado.value.toUpperCase();
        await axios.put(`${URL}pedidos/id/${seleccionado.id}`,pedido);
        location.reload();
    });

    e.target.nodeName === "INPUT" && e.target.select()
    
});


agregar.addEventListener('click',e=>{
    ipcRenderer.send('abrir-ventana',{
        path:"pedidos/agregarPedidos.html",
        ancho:500,
        altura:550,
        reinicio:true
    });
});

eliminar.addEventListener('click',async e=>{
    if (seleccionado) {
        sweet.fire({
            title:"Seguro Eliminar pedido?",
            confirmButtonText:"Aceptar",
            showCancelButton:true
        }).then(async({isConfirmed})=>{
            if (isConfirmed) {
                try {
                    await axios.delete(`${URL}pedidos/id/${seleccionado.id}`);
                    tbody.removeChild(seleccionado);
                } catch (error) {
                    sweet.fire({
                        title:"No se puedo eliminar el pedido"
                    })
                }
            }
        })
    }
});

salir.addEventListener('click',e=>{
    location.href = '../menu.html';
});


