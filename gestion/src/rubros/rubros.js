const axios = require('axios');
require("dotenv").config();
const URL = process.env.URL;
const sweet = require('sweetalert2');

const tbody = document.querySelector('tbody');
const numero = document.querySelector('#numero');
const nombre = document.querySelector('#nombre');
const agregar = document.querySelector('.agregar');
const modificar = document.querySelector('.modificar');

let seleccionado = "";

window.addEventListener('load',async e=>{
    numero.value = (await axios.get(`${URL}rubro/id`)).data;
    const rubros = (await axios.get(`${URL}rubro`)).data;
    listar(rubros);
});

//Funcion que lista todos los rubros pasados por parametros
const listar = async(rubros)=>{
    for await(let {numero,rubro} of rubros){
        console.log(numero,rubro)
        const tr = document.createElement('tr');

        const tdNumero = document.createElement('td');
        const tdNombre = document.createElement('td');

        tdNumero.innerHTML = numero;
        tdNombre.innerHTML = rubro;

        tr.appendChild(tdNumero);
        tr.appendChild(tdNombre);

        tbody.appendChild(tr);
    }
};

agregar.addEventListener('click',async e=>{
    if (nombre.value !== "") {
        const nuevoRubro = {
            rubro:nombre.value,
            numero:numero.value
        };
        await axios.post(`${URL}rubro`,nuevoRubro);
        tbody.innerHTML = "";
        location.reload();
    }else{
        await sweet.fire({
            title:"Debe agregar un nombre al Rubro",
            returnFocus:false
        });
    }
    nombre.value = "";
    nombre.focus();
});

tbody.addEventListener('click',e=>{
    seleccionado = e.path[1];
    agregar.classList.add('none');
    modificar.classList.remove('none');
    numero.value = seleccionado.children[0].innerHTML;
    nombre.value = seleccionado.children[1].innerHTML;
});

modificar.addEventListener('click',e=>{
    if(nombre.value !== ""){
        const rubroModificado = {
            rubro: nombre.value,
            numero:numero.value
        }
        axios.put(`${URL}rubro/${numero.value}`,rubroModificado);
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
    if (agregar.classList.contains('none')) {
        modificar.focus();
    }else{
        agregar.focus();
    }
   }
});

nombre.addEventListener('focus',e=>{
    nombre.select();
});