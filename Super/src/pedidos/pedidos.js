const axios = require('axios');
require("dotenv").config();
const URL = process.env.URL;

let pedidos;

const tbody = document.querySelector('tbody');

window.addEventListener('load',async e=>{
    pedidos = (await axios.get(`${URL}pedidos`)).data;
    listarPedidos(pedidos);
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

        const fecha = pedido.fecha.slice(0,10).split('-',3);

        tdFecha.innerHTML = `${fecha[2]}/${fecha[1]}/${fecha[0]}`;
        tdCodigo.innerHTML = pedido.codigo;
        tdProducto.innerHTML = pedido.producto;
        tdCantidad.innerHTML = pedido.cantidad;
        tdCliente.innerHTML = pedido.cliente;
        tdTelefono.innerHTML = pedido.telefono;
        tdStock.innerHTML = pedido.stock;
        tdEstadoPedido.innerHTML = pedido.estadoPedido;
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
}