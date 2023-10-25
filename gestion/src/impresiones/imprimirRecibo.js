const { ipcRenderer } = require("electron");



const numeroRecibo = document.getElementById('numeroRecibo');
const fecha = document.getElementById('fecha');
const nombre = document.getElementById('nombre');
const codigo = document.getElementById('codigo');
const cuit = document.getElementById('cuit');
const dni = document.getElementById('dni');
const direccion = document.getElementById('direccion');
const localidad = document.getElementById('localidad');
const iva = document.getElementById('iva');
const valores = document.getElementById('valores');
const total = document.getElementById('total');


const tbody = document.getElementById('tbody');



ipcRenderer.on('imprimir-recibo',listar);



async function listar(e,args){
    const [recibo,cliente,lista] = JSON.parse(args);
    
    await listarDatosRecibo(recibo);
    await listarCliente(cliente);
    await listarcomprobantes(lista);
    ipcRenderer.send('imprimir-ventana');
}

function listarDatosRecibo(recibo) {
    numeroRecibo.innerText = "R" + recibo.numero;
    fecha.innerText = recibo.fecha.slice(0,10).split('-',3).reverse().join('/') + " - " + recibo.fecha.slice(11,19);
    valores.innerText = recibo.valorRecibido;
    total.innerText = recibo.precio.toFixed(2);
};

function listarCliente(cliente){
    nombre.innerText = cliente.nombre;
    codigo.innerText = (cliente._id).toString().padStart(4,'0');
    cliente.cuit.length === 11 ? dni.parentElement.classList.add('none') : cuit.parentElement.classList.add('none')
    cuit.innerText = cliente.cuit;
    dni.innerText = cliente.cuit;
    direccion.innerText = cliente.direccion;
    localidad.innerText = cliente.localidad;
    iva.innerText = cliente.condicionIva;
};

function listarcomprobantes(lista) {
    lista.map(elem =>{
        tbody.innerHTML += `
            <tr>
                <td>${elem.fecha.slice(0,10).split('-',3).reverse().join('/')}</td>
                <td>${elem.tipo}</td>
                <td>${elem.numero.padStart(8,'0')}</td>
                <td>${elem.precio.toFixed(2)}</td>
                <td>${elem.saldo.toFixed(2)}</td>
            </tr>
        `
    })
}