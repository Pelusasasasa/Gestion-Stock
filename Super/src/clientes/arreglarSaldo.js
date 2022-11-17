const {cerrarVentana,apretarEnter} = require('../helpers');
const sweet = require('sweetalert2');

const axios = require('axios');
const { ipcRenderer } = require('electron');
require("dotenv").config();
const URL = process.env.URL;

const codigo = document.getElementById('id');
const nombre = document.getElementById('nombre');
const saldoViejo = document.getElementById('saldoViejo');
const saldoNuevo = document.getElementById('saldoNuevo');

//botones
const modificar = document.querySelector('.modificar');
const salir = document.querySelector('.salir');

let cliente;

const listarCliente = async(cliente)=>{
    nombre.value = cliente.nombre;
    saldoViejo.value = cliente.saldo.toFixed(2);
}

codigo.addEventListener('keyup',async e=>{
    console.log(e.keyCode)
    if (e.keyCode === 13 && codigo.value !== "") {
        cliente = (await axios.get(`${URL}clientes/id/${codigo.value}`)).data;
        if (cliente) {
            listarCliente(cliente);
            saldoNuevo.focus();
        }else{
            await sweet.fire({
                title:"Cliente No Econtrado"
            });
        }
    }
});


modificar.addEventListener('click',async e=>{
    cliente.saldo = saldoNuevo.value;
    (await axios.put(`${URL}clientes/id/${cliente._id}`,cliente));
    window.close();
});

saldoNuevo.addEventListener('keyup',e=>{
    if (e.keyCode === 13) {
        saldoNuevo.value = saldoNuevo.value !== "" ? saldoNuevo.value : saldoViejo.value;
        modificar.focus();
    }
});

document.addEventListener('keyup',e=>{
    if (e.keyCode === 27) {
        window.close();
    } 
});

salir.addEventListener('click',e=>{
    window.close();
})