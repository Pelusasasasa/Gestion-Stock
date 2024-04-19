const axios = require('axios');
require("dotenv").config();
const URL = process.env.GESTIONURL;
const sweet = require('sweetalert2');

const tbody = document.querySelector('tbody');

const tipo = document.querySelector('#tipo');
const numero = document.querySelector('#numero');
const nombre = document.querySelector('#nombre');

const guardar = document.querySelector('.guardar');
const modificar = document.querySelector('.modificar');

let seleccionado = "";

//Funcion que lista todos los rubros pasados por parametros
const listar = async(tipos)=>{
    tbody.innerHTML = "";
    for await(let objeto of tipos){
        const {_id, numero} = objeto;
        const tr = document.createElement('tr');
        tr.id = _id;

        const tdNumero = document.createElement('td');
        const tdNombre = document.createElement('td');
        const tdAcciones = document.createElement('td');

        tdAcciones.classList.add('acciones');

        tdNumero.innerHTML = numero;
        console.log(objeto)
        tdNombre.innerHTML = objeto[tipo.value];
        tdAcciones.innerHTML = `
            <div class=tool>
                <span class=material-icons>edit</span>
                <p class=tooltip>Modificar</p>
            </div>
            <div class=tool>
                <span class=material-icons>delete</span>
                <p class=tooltip>Eliminar</p>
            </div>
        `

        tr.appendChild(tdNumero);
        tr.appendChild(tdNombre);
        tr.appendChild(tdAcciones);

        tbody.appendChild(tr);
    }
};

const pasarAlaLista = async( nuevo ) => {
    
    const tr = document.createElement('tr');
    tr.id = nuevo._id;

    const tdNumero = document.createElement('td');
    const tdNombre = document.createElement('td');
    const tdAcciones = document.createElement('td');

    tdAcciones.classList.add('acciones');

    tdNumero.innerText = nuevo.numero;
    tdNombre.innerText = nuevo[tipo.value];
    tdAcciones.innerHTML = `
            <div class=tool>
                <span class=material-icons>edit</span>
                <p class=tooltip>Modificar</p>
            </div>
            <div class=tool>
                <span class=material-icons>delete</span>
                <p class=tooltip>Eliminar</p>
            </div>
        `

    tr.appendChild(tdNumero);
    tr.appendChild(tdNombre);
    tr.appendChild(tdAcciones);

    tbody.appendChild(tr);

}

tipo.addEventListener('keypress',async e => {
    e.preventDefault();
    if (e.key === 'Enter') {

        numero.value = parseInt((await axios.get(`${URL}${tipo.value}/last`)).data) + 1;
        const tipos = (await axios.get(`${URL}${tipo.value}`)).data;
        listar(tipos);

        nombre.focus();
    }
});

guardar.addEventListener('click',async e=>{
    if (nombre.value !== "") {
        const aux = tipo.value;
        const nuevoTipo = {};
        nuevoTipo[aux] = nombre.value;
        nuevoTipo.numero = numero.value;

        const nuevo = (await axios.post(`${URL}${aux}`,nuevoTipo)).data;

        pasarAlaLista(nuevo);

    }else{
        await sweet.fire({
            title:"Debe agregar un nombre al Rubro",
            returnFocus:false
        });
    }
    nombre.value = "";
    nombre.focus();
});

tbody.addEventListener('click',async e=>{

    seleccionado && seleccionado.classList.remove('seleccionado');

    if (e.target.nodeName === "TD") {
        seleccionado = e.target.parentNode;
    }else if(e.target.nodeName === "SPAN"){
        seleccionado = e.target.parentNode.parentNode.parentNode;
    }else if(e.target.nodeName === "DIV"){
        seleccionado = e.target.parentNode.parentNode;
    }
    seleccionado.classList.add('seleccionado');

    guardar.classList.add('none');
    modificar.classList.remove('none');
    numero.value = seleccionado.children[0].innerHTML;
    nombre.value = seleccionado.children[1].innerHTML;

    if (e.target.innerHTML === "edit") {
        
    }else if(e.target.innerHTML === "delete"){
        await sweet.fire({
            title:"Eliminar Rubro ?",
            showCancelButton:true,
            confirmButtonText:"Aceptar"
        }).then(async({isConfirmed})=>{
            if (isConfirmed) {
                try {
                    await axios.delete(`${URL}rubro/codigo/${seleccionado.id}`);
                    tbody.removeChild(seleccionado);
                    nombre.value = "";
                    modificar.classList.add('none');
                    guardar.classList.remove('none');
                } catch (error) {
                    console.log(error);
                    sweet.fire({
                        title:"No se pudo borrar el rubro"
                    })
                }
            }
        });
    }
});

modificar.addEventListener('click',e=>{
    if(nombre.value !== ""){
        const tipoModificado = {};
        tipoModificado[tipo.value] = nombre.value;
        tipoModificado.numero = parseInt(numero.value);
        axios.put(`${URL}${tipo.value}/numero/${numero.value}`,tipoModificado);
        tbody.innerHTML = "";
        location.reload();
    }
});

document.addEventListener('keyup',e=>{
    if (e.key === "Escape") {
        window.close();
    }
});

nombre.addEventListener('keypress',e=>{
   if (e.keyCode === 13) {
    if (guardar.classList.contains('none')) {
        modificar.focus();
    }else{
        guardar.focus();
    }
   }
});

nombre.addEventListener('focus',e=>{
    nombre.select();
});

