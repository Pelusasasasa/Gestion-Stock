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

        ipcRenderer.send('imprimir-ventana')
    });
});

const ponerDatosVenta = (datos)=>{
    const fecha = datos.fecha.slice(0,10).split('-',3);
    const hora = datos.fecha.slice(11,19).split(':',3);
    console.log(datos)
    numero.innerHTML = datos.numero.toString().padStart(8,'0');
    date.innerHTML = `${fecha[2]}/${fecha[1]}/${fecha[0]} - ${hora[0]}:${hora[1]}:${hora[2]}`;
    tipoPago.innerHTML = datos.tipo_venta;
    vendedor.innerHTML = datos.vendedor;

    subTotal.innerHTML = datos.precio + datos.descuento;
    descuento.innerHTML = datos.descuento;
    total.innerHTML = datos.precio;
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
        const tdTotal = document.createElement('td');

        tdCantidad.innerHTML = movimiento.cantidad.toFixed(2);
        tdCodigo.innerHTML = movimiento.codProd ?  movimiento.codProd : "" ;
        tdDescripcion.innerHTML = movimiento.producto;
        tdPrecio.innerHTML = movimiento.precio;
        tdTotal.innerHTML = redondear(movimiento.cantidad * movimiento.precio,2);

        tr.appendChild(tdCantidad);
        tr.appendChild(tdCodigo);
        tr.appendChild(tdDescripcion);
        tr.appendChild(tdPrecio);
        tr.appendChild(tdTotal);

        tbody.appendChild(tr);
    });
}