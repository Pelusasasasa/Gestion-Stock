const { ipcRenderer } = require('electron');

const axios = require('axios');
const { fechaHoy, apretarEnter } = require('../helpers');
require('dotenv').config();
const URL = process.env.GESTIONURL;

let lista = [];

const desde = document.getElementById('desde');
const hasta = document.getElementById('hasta');
const imprimir = document.getElementById('imprimir');
const tarjetas = document.querySelector('.tarjetas');

window.addEventListener('load',cargadoVentana);
imprimir.addEventListener('click',imprimirTickets);

desde.addEventListener('keypress',e=>{
    apretarEnter(e,hasta);
});

hasta.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        traerProductos(desde.value,hasta.value);
    }
});

document.addEventListener('keyup',e=>{
    if (e.keyCode === 27) {
        location.href = '../menu.html';
    }

    if (e.keyCode === 117){
        imprimir.click();
    }
});

async function cargadoVentana() {
    let fecha = fechaHoy().slice(0,10);
    desde.value = fecha;
    hasta.value = fecha;

    traerProductos(desde.value,hasta.value);
};

async function traerProductos(desde,hasta) {
    lista = (await axios.get(`${URL}productosModificados/forDate/${desde}/${hasta}`)).data;
    tarjetas.innerHTML = "";
    for(let elem of lista){
        tarjetas.innerHTML += `
            <div class=ticketPrecio>
                <p class=titulo>
                    <span>L</span>
                    <span>E</span>
                    <span>R</span>
                    <span>O</span>
                    <span>M</span>
                </p>
                <main class=descripcion>
                    <p id="descripcion">${elem.descripcion}</p>
                    <h2 id="precio">$${elem.precio}</h2>
                </main>
            </div>
        `
    }
};

async function imprimirTickets(){
    //Completar
}