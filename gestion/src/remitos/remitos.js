const axios = require('axios');
const { ipcRenderer } = require('electron');
require('dotenv').config();

const URL = process.env.GESTIONURL;

const buscador = document.getElementById('buscador');
const remitoC = document.getElementById('remitoC');
const listRem = document.getElementById('listRem');
const tbody = document.getElementById('tbody');

const listMov = document.getElementById('listMov');
const tbodyMov = document.getElementById('tbodyMov');

const pasarCTA = document.getElementById('pasarCTA');

let remitos = [];
let movs = [];
let seleccionado = '';
let subSeleccionado = '';

const apretarTecla = async(e) => {

    if (e.keyCode === 27){
        if (listMov.classList.contains('none')) {
            location.href = '../menu.html';
        }else{
            listMov.classList.add('none');
            listRem.classList.add('h-50');
            listRem.classList.remove('h-24');
        }
    }

};

const cargarPagina = async() => {
    remitos =(await axios.get(`${URL}remitos`)).data;
    listarRemitos(remitos.filter(elem => !elem.pasado));
};

const cambioTipoRemito = async(e) => {
    if (e.target.checked){
        listarRemitos(remitos.filter(elem => elem.pasado));
    }else{
        listarRemitos(remitos.filter(elem => !elem.pasado));
    }
};

const clickTbody = async(e) => {
    if (e.target.nodeName === 'TD'){
        seleccionado && seleccionado.classList.remove('seleccionado');
        subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');

        seleccionado = e.target.parentNode;
        subSeleccionado = e.target;

        seleccionado.classList.add('seleccionado');
        subSeleccionado.classList.add('subSeleccionado');
    };

    if (e.target.nodeName === 'INPUT'){
        seleccionado && seleccionado.classList.remove('seleccionado');
        subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');

        seleccionado = e.target.parentNode.parentNode.parentNode;
        subSeleccionado = e.target.parentNode.parentNode;

        seleccionado.classList.add('seleccionado');
        subSeleccionado.classList.add('subSeleccionado');
    };

    let aux = remitos.find( elem => elem._id === seleccionado.id);
    
    movs = (await axios.get(`${URL}movimiento/${aux.numero}/${aux.tipoVenta}`)).data;
    listarMovs( movs );
};

const filtrarRemitos = async(e) => {
    const filtro = remitos.filter(elem => elem.cliente.startsWith(buscador.value.toUpperCase()))
    listarRemitos(filtro);
};

const listarMovs = (lista) => {
    tbodyMov.innerHTML = '';

    for(let elem of lista){
        listMov.classList.remove('none');
        tbody.parentElement.parentElement.classList.remove('h-80vh');
        tbody.parentElement.parentElement.classList.add('h-30vh');

        const tr = document.createElement('tr');
        tr.id = elem._id;

        const tdCod = document.createElement('td');
        const tdDesc = document.createElement('td');
        const tdMarca = document.createElement('td');
        const tdPrecio = document.createElement('td');
        const tdCant = document.createElement('td');
        const tdTotal = document.createElement('td');

        tdCod.classList.add('border');
        tdDesc.classList.add('border');
        tdMarca.classList.add('border');
        tdPrecio.classList.add('border');
        tdCant.classList.add('border');
        tdTotal.classList.add('border');

        tdPrecio.classList.add('text-rigth');
        tdCant.classList.add('text-rigth');
        tdTotal.classList.add('text-rigth');

        tdCod.innerText = elem.codProd;
        tdDesc.innerText = elem.producto;
        tdMarca.innerText = elem.marca;
        tdPrecio.innerText = elem.precio.toFixed(2);
        tdCant.innerText = elem.cantidad.toFixed(2);
        tdTotal.innerText = (elem.precio * elem.cantidad).toFixed(2);

        tr.appendChild(tdCod);
        tr.appendChild(tdDesc);
        tr.appendChild(tdMarca);
        tr.appendChild(tdPrecio);
        tr.appendChild(tdCant);
        tr.appendChild(tdTotal);

        tbodyMov.appendChild(tr);
    }

};

const listarRemitos = (lista) => {
    tbody.innerHTML = '';

    for (let elem of lista){
        const tr = document.createElement('tr');

        tr.classList.add('cursor-pointer');
        tr.classList.add('hover-bg-gray');

        tr.id = elem._id;

        const tdFecha = document.createElement('td');
        const tdCodCliente = document.createElement('td');
        const tdCliente = document.createElement('td');
        const tdNumero = document.createElement('td');
        const tdObseraciones = document.createElement('td');
        const tdPasar = document.createElement('td');

        tdNumero.classList.add('text-rigth');

        tdFecha.classList.add('border');
        tdCodCliente.classList.add('border');
        tdCliente.classList.add('border');
        tdNumero.classList.add('border');
        tdObseraciones.classList.add('border');
        tdPasar.classList.add('border');

        tdFecha.innerText = elem.fecha.slice(0,10).split('-', 3).reverse().join('/  ');
        tdCodCliente.innerText = elem.idCliente;
        tdCliente.innerText = elem.cliente;
        tdNumero.innerText = elem.numero.toString().padStart(8, '0');
        tdObseraciones.innerText = elem.observaciones;
        tdPasar.innerHTML = `
            <div class="flex justify-center">
                <input type="checkbox" class="scale-1-5" name="pasar" id=${elem.id} />
            </div>
        `

        tr.appendChild(tdFecha);
        tr.appendChild(tdCodCliente);
        tr.appendChild(tdCliente);
        tr.appendChild(tdNumero);
        tr.appendChild(tdObseraciones);
        tr.appendChild(tdPasar);

        tbody.appendChild(tr);
    };
};

const pasarCuenta = async() => {
    const trSeleccinados = document.querySelectorAll('tr input[type="checkbox"]:checked');
    const filasSeleccionadas = Array.from(trSeleccinados).map(checkbox => checkbox.closest('tr'));
    const idFilas = filasSeleccionadas.map(elem => elem.id);
    
    location.href = `../venta/index.html?remito=true&remitos=${JSON.stringify(idFilas)}`;
};

buscador.addEventListener('keyup', filtrarRemitos);
document.addEventListener('keyup', apretarTecla);
remitoC.addEventListener('change', cambioTipoRemito);
pasarCTA.addEventListener('click', pasarCuenta);
tbody.addEventListener('click', clickTbody);
window.addEventListener('load', cargarPagina);