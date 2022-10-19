const sweet = require('sweetalert2');
const { ipcRenderer } = require('electron');

const axios = require('axios');
require('dotenv').config()
const URL = process.env.URL;

const {recorrerFlechas, copiar} = require('../helpers');

const tbody = document.querySelector('tbody');

const agregar = document.querySelector('.agregar');
const nombre = document.querySelector('#nombre');
const botones = document.querySelector('.botones');
const modificar = document.querySelector('.modificar');
const eliminar = document.querySelector('.eliminar');
const salir = document.querySelector('.salir');

//variables
let ventanaSecundaria = false
let seleccionado;
let subSeleccionado;

window.addEventListener('load',e=>{
    copiar();
    filtrar();
});

const filtrar = async()=>{
    tbody.innerHTML = "";
    let clientes;
    if (nombre.value !== "") {
        clientes = (await axios.get(`${URL}clientes/buscar/${nombre.value}`)).data; 
    }else{
        clientes = (await axios.get(`${URL}clientes/buscar/NADA`)).data; 
    }
    listarClientes(clientes);
}

nombre.addEventListener('keyup',filtrar);


//Esto sirve para ver si estamos en una ventana secundaria o en la principal
//la cual va a mostrar o no la parte de botones
//Y luego podemos mandarle el cliente a la ventana principal si esta es ventana secundaria
ipcRenderer.on('informacion',(e,args)=>{
    if (!args.botones) {
        botones.classList.add('none');
        ventanaSecundaria = true;
    } 
});


//abrimos una ventana para agregar cliente
agregar.addEventListener('click',e=>{
    ipcRenderer.send('abrir-ventana',{path:"./clientes/agregarCliente.html",altura:500,ancho:1200});
});

//abrimos una ventana para moficiar el cliente
modificar.addEventListener('click',e=>{
    seleccionado ? ipcRenderer.send('abrir-ventana',{path:"clientes/modificarCliente.html",informacion:seleccionado.id}) : sweet.fire({title:"Cliente no seleccionado"});
});

//Eliminamos un cliente
eliminar.addEventListener('click',async e=>{
    if (seleccionado) {
        await sweet.fire({
            title:"Seguro eliminar " + seleccionado.children[1].innerHTML,
            confirmButtonText:"Aceptar",
            showCancelButton:true
        }).then(async({isConfirmed})=>{
            if (isConfirmed) {
                const mensaje = (await axios.delete(`${URL}clientes/id/${seleccionado.id}`)).data;
                await sweet.fire({
                    title:mensaje
                });
                location.reload();
            }
        })
    }else{
        await sweet.fire({
            title:"Cliente no seleccionado"
        });
    }
})

//listamos los clientes, con sus datos
const listarClientes = async(clientes)=>{
    for await(let {_id,nombre,telefono,direccion,cuit,condicionIva,saldo} of clientes){
        const tr = document.createElement('tr');
        tr.id = _id;

        const tdId = document.createElement('td');
        const tdNombre = document.createElement('td');
        const tdDireccion = document.createElement('td');
        const tdTelefono = document.createElement('td');
        const tdCuit = document.createElement('td');
        const tdCondicionIva = document.createElement('td');
        const tdSaldo = document.createElement('td');
    
        tdId.innerHTML = _id;
        tdNombre.innerHTML = nombre;
        tdDireccion.innerHTML = direccion;
        tdTelefono.innerHTML = telefono;
        tdCuit.innerHTML = cuit ? cuit : ""
        tdCondicionIva.innerHTML = cuit ? cuit : ""
        tdSaldo.innerHTML = saldo.toFixed(2);

        tr.appendChild(tdId);
        tr.appendChild(tdNombre);
        tr.appendChild(tdDireccion);
        tr.appendChild(tdTelefono);
        tr.appendChild(tdCuit);
        tr.appendChild(tdCondicionIva);
        tr.appendChild(tdSaldo);

        tbody.appendChild(tr);
    };
    seleccionado = tbody.firstElementChild;
    seleccionado.classList.add('seleccionado');

    subSeleccionado = seleccionado.children[0];
    subSeleccionado.classList.add('subSeleccionado');
}

//si hacemos click en un tr que se cambie el seleccionado
tbody.addEventListener('click',e=>{
    if(e.target.nodeName === "TD"){
        seleccionado && seleccionado.classList.remove('seleccionado');
        seleccionado = e.target.parentNode;
        seleccionado.classList.add('seleccionado');

        subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');
        subSeleccionado = e.target;
        subSeleccionado.classList.add('subSeleccionado');
    }
});

document.addEventListener('keydown',e=>{
    if(e.key === "Escape" && ventanaSecundaria){
        ipcRenderer.send('enviar',{
            tipo:"Ningun cliente",
            informacion:""
        })
        window.close();  
    }else if(e.key === "Escape" && !ventanaSecundaria){
        location.href ='../menu.html';
    }
});


document.addEventListener('keydown',e=>{
        if(e.keyCode === 13 && seleccionado && ventanaSecundaria){
            ipcRenderer.send('enviar',{
                tipo:"cliente",
                informacion:seleccionado.id
            });
            window.close();
        }
        if (document.activeElement.nodeName !== "INPUT") {
            recorrerFlechas(e.keyCode);
        }
        if (document.activeElement.nodeName === "INPUT" && e.keyCode === 40) {
            nombre.blur();
        }
});

//recibimos el cliente una vez modificado
ipcRenderer.on('recibir-ventana-secundaria',(e,args)=>{
    const clienteModificado = JSON.parse(args);
    const tr = document.getElementById(`${clienteModificado._id}`);
    tr.children[0].innerHTML = clienteModificado._id;
    tr.children[1].innerHTML = clienteModificado.nombre;
    tr.children[2].innerHTML = clienteModificado.direccion;
    tr.children[3].innerHTML = clienteModificado.telefono;
    tr.children[4].innerHTML = clienteModificado.saldo;
});

salir.addEventListener('click',e=>{
    location.href = "../menu.html";
});