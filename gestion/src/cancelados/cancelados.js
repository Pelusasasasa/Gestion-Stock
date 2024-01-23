const sweet = require('sweetalert2');
const axios  = require("axios");
require('dotenv').config();
const URL = process.env.GESTIONURL;

const { fechaHoy, cerrarVentana, configAxios } = require("../helpers");


const desde = document.getElementById('desde');
const hasta = document.getElementById('hasta');
const tbody = document.querySelector('tbody');
const volver = document.getElementById('volver');

let cancelados = [];

window.addEventListener('load', async() => {
    const date = fechaHoy().slice(0,10);
    desde.value = date;
    hasta.value = date;

    cancelados = (await axios.get(`${URL}Cancelado/forDay/${desde.value}/${hasta.value}`)).data;
    listarCancelados(cancelados);
    
});

desde.addEventListener('keypress',e => {
    if (e.keyCode === 13) {
        hasta.focus();
    };
});

hasta.addEventListener('keypress',async e => {
    if (e.keyCode === 13) {
        cancelados = (await axios.get(`${URL}Cancelado/forDay/${desde.value}/${hasta.value}`)).data;
        listarCancelados(cancelados);
    }
});

const listarCancelados = async(cancelados) => {
    tbody.innerHTML = '';

    cancelados.sort( (a,b) => {
        if (a.fecha > b.fecha) return 1;
        if (a.fecha < b.fecha) return -1;
        return 0;
    });

    for (let elem of cancelados){
        const tr = document.createElement('tr');
        tr.id = elem.numero;

        const tdFecha = document.createElement('td');
        const tdCliente = document.createElement('td');
        const tdNumero = document.createElement('td');
        const tdPrecio = document.createElement('td');
        const tdVenedor = document.createElement('td');
        const tdCaja = document.createElement('td');
        const tdHora = document.createElement('td');
        const tdAcciones = document.createElement('td');

        tdPrecio.classList.add('text-rigth');
        
        tdFecha.classList.add('text-bold');
        tdCliente.classList.add('text-bold');
        tdNumero.classList.add('text-bold');
        tdPrecio.classList.add('text-bold');
        tdVenedor.classList.add('text-bold');
        tdCaja.classList.add('text-bold');
        tdHora.classList.add('text-bold');

        tdFecha.innerHTML = elem.fecha.slice(0,10).split('-',3).reverse().join('/');
        tdCliente.innerText = elem.cliente;
        tdNumero.innerText = elem.numero ? elem.numero.toString().padStart(8,'0') : '00000000';  
        tdPrecio.innerText = elem.precio.toFixed(2);
        tdVenedor.innerText = elem.vendedor;
        tdCaja.innerText = elem.caja;
        tdHora.innerText = elem.fecha.slice(11,19);
        tdAcciones.innerHTML = `
        <div class=tool id="hacerVenta">
            <span class=material-icons>edit</span>
            <p class=tooltip>Hacer Venta</p>
        </div>
        `;


        tr.appendChild(tdFecha);
        tr.appendChild(tdCliente);
        tr.appendChild(tdNumero);
        tr.appendChild(tdPrecio);
        tr.appendChild(tdVenedor);
        tr.appendChild(tdCaja);
        tr.appendChild(tdHora);
        tr.appendChild(tdAcciones);

        tbody.appendChild(tr);

        await listarMovimientos(elem.numero,elem.tipo_venta);

        tdAcciones.addEventListener('click',hacerVenta);

    }

};

const listarMovimientos = async(numero,tipo) => {
    const movimientos = (await axios.get(`${URL}movimiento/${numero}/${tipo}`)).data;
    
    for(let mov of movimientos){
        const tr = document.createElement('tr');

        const tdFecha = document.createElement('td');
        const tdProducto = document.createElement('td');
        const tdCodProducto = document.createElement('td');
        const tdCantidad = document.createElement('td');
        const tdPrecio = document.createElement('td');
        const tdTotal = document.createElement('td');

        tdFecha.innerText = mov.fecha.slice(0,10).split('-',3).reverse().join('/');
        tdProducto.innerText = mov.producto;
        tdCodProducto.innerText = mov.codProd;
        tdCantidad.innerText = mov.cantidad;
        tdPrecio.innerText = mov.precio.toFixed(2);
        tdTotal.innerText = (mov.precio * mov.cantidad).toFixed(2);

        tr.appendChild(tdFecha);
        tr.appendChild(tdProducto);
        tr.appendChild(tdCodProducto);
        tr.appendChild(tdCantidad);
        tr.appendChild(tdPrecio);
        tr.appendChild(tdTotal);

        tbody.appendChild(tr);
    }
};

const hacerVenta = async(e) => {
    let numero = '';
    if (e.target.tagName === 'SPAN') {
        numero = e.target.parentElement.parentElement.parentElement.id;
    }else if(e.target.tagName === 'P'){
        numero = e.target.parentElement.parentElement.parentElement.id;
    }else if (e.target.tagName === 'DIV'){
        numero = (parseInt(e.target.parentElement.parentElement.id));
    };
    
    const res = await sweet.fire({
        title: 'Seguro quiere pasar a venta',
        confirmButtonText: "Aceptar",
        showCancelButton: true,        
    });

    if(res.isConfirmed){
        const cancelado = (await axios.get(`${URL}Cancelado/forNumber/${numero}`,configAxios)).data;
        const numComp = (await axios.get(`${URL}numero/Contado`,configAxios)).data;
        const venta = {};

        venta.cliente = cancelado.cliente;
        venta.idCliente = cancelado.idCliente;
        venta.concidcionIva = cancelado.condicionIva;
        venta.cod_doc = cancelado.cod_doc;
        venta.num_doc = cancelado.num_doc;
        venta.cod_comp = cancelado.cod_comp;

        venta.precio = cancelado.precio;
        venta.descuento = 0;

        venta.caja = cancelado.caja;
        venta.vendedor = cancelado.vendedor;

        venta.numero = numComp + 1;
        venta.tipo_venta = 'CD';
        venta.tipo_comp = 'Comprobante';
        venta.descuento = 0;

        venta.F = false;
        venta.gravado21 = cancelado.gravado21;
        venta.gravado105 = cancelado.gravado105;
        venta.iva21 = cancelado.iva21;
        venta.iva105 = cancelado.iva105;
        venta.cantIva = cancelado.cantIva;

        
        //Actualizamos el numero de contado, creamos la venta y borramos el cancelado
        await axios.put(`${URL}numero/Contado`,{Contado:venta.numero},configAxios);
        await axios.post(`${URL}ventas`,venta,configAxios);
        await axios.delete(`${URL}Cancelado/forId/${cancelado._id}`);
    }
}

volver.addEventListener('click', () => {
    location.href = '../menu.html';
});

document.addEventListener('keyup', e => {
    if (e.keyCode === 27) {
        location.href = '../menu.html';
    }
});