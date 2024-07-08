const { ipcRenderer } = require('electron');
const sweet = require('sweetalert2');
const { redondear } = require('../helpers');

const numero = document.getElementById('numero');
const date = document.getElementById('fecha');
const tipoPago = document.getElementById('tipoPago');
const vendedor = document.getElementById('vendedor');
const subTotal = document.getElementById('subtotal');
const descuento = document.getElementById('descuento');
const total = document.getElementById('total');

const cliente = document.getElementById('cliente');
const idCliente = document.getElementById('idCliente');
const cuit = document.getElementById('cuit');
const direccion = document.getElementById('direccion');
const localidad = document.getElementById('localidad');
const cond_iva = document.getElementById('cond_iva');

const tbody = document.querySelector('tbody');


window.addEventListener('load',e=>{
    ipcRenderer.on('imprimir',async(e,args)=>{
        let datosClientes = JSON.parse(args)[2];
        let datosVenta = JSON.parse(args)[1];
        let movimientos = JSON.parse(args)[3];
        await ponerDatosVenta(datosVenta);
        await ponerDatosClientes(datosClientes);
        await ponerDatosArticulos(movimientos);

        ipcRenderer.send('imprimir-ventana',JSON.parse(args)[0]);
    });
});

const ponerDatosVenta = (datos)=>{
    const now = new Date(datos.fecha);
    const aux = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();
    const fecha = aux.slice(0,10).split('-',3);
    const hora = aux.slice(11,19).split(':',3);
    numero.innerHTML = datos.numero.toString().padStart(8,'0');
    date.innerHTML = `${fecha[2]}/${fecha[1]}/${fecha[0]} - ${hora[0]}:${hora[1]}:${hora[2]}`;
    tipoPago.innerHTML = datos.tipo_venta;
    vendedor.innerHTML = datos.vendedor;

    subTotal.innerHTML = redondear(datos.precio + datos.descuento,2);
    descuento.innerHTML = datos.descuento.toFixed(2);
    total.innerHTML = datos.precio.toFixed(2);
}

const ponerDatosClientes = (datos)=>{
    cliente.innerHTML = datos.nombre
    idCliente.innerHTML = datos._id.toString().padStart(4,'0');
    cuit.innerHTML = datos.cuit;
    direccion.innerHTML = datos.direccion;
    localidad.innerHTML = datos.localidad;
    cond_iva.innerHTML = datos.condicionIva.toUpperCase();
};

const ponerDatosArticulos = (datos)=>{
    datos.forEach(movimiento => {
        const tr = document.createElement('tr');

        const tdCantidad = document.createElement('td');
        const tdCodigo = document.createElement('td');
        const tdDescripcion = document.createElement('td');
        const tdPrecio = document.createElement('td');
        const tdIva = document.createElement('td');
        const tdTotal = document.createElement('td');

        tdCantidad.innerHTML = movimiento.unidad === "horas" ? "" : movimiento.cantidad.toFixed(2);
        tdCodigo.innerHTML = movimiento.codProd ?  movimiento.codProd : "" ;
        tdDescripcion.innerHTML = movimiento.producto;
        tdIva.innerHTML = movimiento.iva.toFixed(2);
        tdPrecio.innerHTML = movimiento.unidad === "horas" ? "" : movimiento.precio.toFixed(2);
        tdTotal.innerHTML = redondear(movimiento.cantidad * movimiento.precio,2);

        tr.appendChild(tdCantidad);
        tr.appendChild(tdCodigo);
        tr.appendChild(tdDescripcion);
        tr.appendChild(tdPrecio);
        tr.appendChild(tdIva);
        tr.appendChild(tdTotal);

        tbody.appendChild(tr);
    });
}