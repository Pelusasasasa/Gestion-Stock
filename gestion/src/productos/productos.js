function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

let vendedor = getParameterByName("vendedor")
let permiso = getParameterByName("permiso");
permiso = permiso === "" ? 0 : parseInt(permiso);

const { ipcRenderer } = require("electron");
const sweet = require('sweetalert2');

const axios = require('axios');
const { recorrerFlechas,copiar, redondear, agregarMovimientoVendedores } = require("../helpers");
require("dotenv").config();
const URL = process.env.GESTIONURL;

let seleccionado;
let subSeleccionado;
let ventanaSecundaria = false;

const seleccion = document.querySelector('#seleccion');
const body = document.querySelector('body');
const tbody = document.querySelector('tbody');
const agregar = document.querySelector('.agregar');
const salir = document.querySelector('.salir');
const buscador = document.querySelector('#buscarProducto');

window.addEventListener('load',async e=>{
    filtrar();
    copiar();
});

//Vemos si llega una informacion de que se abrio desde otra ventana 
ipcRenderer.on('informacion',(e,args)=>{
    const botones = args.botones;
    if(!botones){
        const botones = document.querySelector('.botones');
        botones.classList.add('none');
        ventanaSecundaria = true;
        seleccion.value = "descripcion";
    }
});

ipcRenderer.on('informacion-a-ventana',(e,args)=>{
    const producto = JSON.parse(args);
    const trModificado = document.getElementById(producto._id);
    trModificado.children[1].innerText = producto.descripcion;
    trModificado.children[2].innerText = producto.precio;
    trModificado.children[3].innerText = producto.stock;
    trModificado.children[4].innerText = producto.marca;
});

const listar = (productos)=>{
    tbody.innerHTML = "";
    for(let {_id,descripcion,marca,rubro,stock,precio} of productos){
        const tr = document.createElement('tr');
        tr.id = _id;

        const tdId = document.createElement('td');
        const tdDescripcion = document.createElement('td');
        const tdPrecio = document.createElement('td');
        const tdStock = document.createElement('td');
        const tdRubro = document.createElement('td');
        const tdMarca = document.createElement('td');
        const tdAcciones = document.createElement('td');
        
        tdPrecio.classList.add('text-rigth');
        tdStock.classList.add('text-rigth');
        tdAcciones.classList.add('acciones')

        tdId.innerHTML = _id;
        tdDescripcion.innerHTML = descripcion;
        tdPrecio.innerHTML = redondear(precio,2);
        tdStock.innerHTML = redondear(stock,2);
        tdMarca.innerHTML = marca;
        tdRubro.innerText = rubro;
        tdAcciones.innerHTML = `
            <div id=edit class=tool>
                <span id=edit class=material-icons>edit</span>
                <p class=tooltip>Modificar</p>
            </div>
            <div id=delete class="tool ${permiso !== 0 && "none"}">
                <span id=delete class=material-icons>delete</span>
                <p class=tooltip>Eliminar</p>
            </div>
        `

        tr.appendChild(tdId);
        tr.appendChild(tdDescripcion);
        tr.appendChild(tdPrecio);
        tr.appendChild(tdStock);
        tr.appendChild(tdMarca);
        tr.appendChild(tdRubro);
        tr.appendChild(tdAcciones)
        
        tbody.appendChild(tr);
    }
}

const filtrar = async()=>{
    tbody.innerHTML = '';
    let condicion = seleccion.value;
    if (condicion === "codigo") {
        condicion="_id";
    };
    const descripcion = buscador.value !== "" ? buscador.value : "textoVacio";
    const producto = (await axios.get(`${URL}productos/${descripcion}/${condicion}`)).data;
    producto.length !== 0 && listar(producto);
}

buscador.addEventListener('keyup',e=>{
    if ((buscador.value === "" && e.keyCode === 40) || (buscador.value === "" && e.keyCode === 39)) {
        buscador.blur();
    }
});

buscador.addEventListener('change',e=>{
    filtrar();
});

//cuando ahcemos un click en un tr lo ponemos como que esta seleccionado
tbody.addEventListener('click',e=>{
    seleccionado && seleccionado.classList.toggle('seleccionado');
    subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');

    if (e.target.nodeName === "TD") {
        seleccionado = e.target.parentNode;
        subSeleccionado = e.target;

    }else if(e.target.nodeName === "DIV"){
        seleccionado = e.target.parentNode.parentNode;
        subSeleccionado = e.target.parentNode;
    }else if(e.target.nodeName === "SPAN"){
        seleccionado = e.target.parentNode.parentNode.parentNode;
        subSeleccionado = e.target.parentNode.parentNode;
    };

    seleccionado.classList.toggle('seleccionado');
    subSeleccionado.classList.add('subSeleccionado');

    if (e.target.innerHTML === "delete") {
        sweet.fire({
            title:"Seguro Borrar " + seleccionado.children[1].innerHTML,
            "showCancelButton":true,
            "confirmButtonText":"Aceptar"
        }).then(async (result)=>{
            if (result.isConfirmed) {
                try {
                    const mensaje = (await axios.delete(`${URL}productos/${seleccionado.id}`)).data;
                    await sweet.fire({title:mensaje});
                    tbody.removeChild(seleccionado);
                    vendedor && await agregarMovimientoVendedores(`Elimino el producto ${seleccionado.children[1].innerHTML} con el precio ${seleccionado.children[2].innerHTML}`,vendedor);
                } catch (error) {
                    console.log(error);
                    sweet.fire({
                        title:"No se pudo borrar el producto"
                    })
                }
            }
        })
    }else if(e.target.innerHTML === "edit"){
        const opciones = {
            path: "./productos/modificarProducto.html",
            botones:true,
            informacion:seleccionado.id,
            altura:600,
            vendedor:vendedor
        }
        ipcRenderer.send('abrir-ventana',opciones);
    }

})

agregar.addEventListener('click',e=>{
    const opciones = {
        path: "./productos/agregarProducto.html",
        botones:true,
        altura:600,
        vendedor:vendedor
    }
    ipcRenderer.send('abrir-ventana',opciones);
})

body.addEventListener('keypress',e=>{
    if (e.key === "Enter" && ventanaSecundaria){    
        if (seleccionado && document.activeElement.nodeName !== "INPUT") {
            ipcRenderer.send('enviar',{
                        tipo:"producto",
                        informacion:seleccionado.id,
            });
            window.close();
        }
    }
})

salir.addEventListener('click',e=>{
    location.href = "../menu.html";
});

document.addEventListener("keydown",e=>{
    if (e.key === "Escape" && ventanaSecundaria) {
        window.close();
    }else if(e.key === "Escape" && !ventanaSecundaria){
        location.href = "../menu.html";
    }
    recorrerFlechas(e.keyCode);
});

