const axios = require('axios');
const Swal = require('sweetalert2')
const { ipcRenderer } = require('electron');
const { getParameterByName, parsearFecha } = require('../helpers');
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

const vendedor = getParameterByName('vendedor');
const apretarTecla = async(e) => {

    if (e.keyCode === 27){
        if (listMov.classList.contains('none')) {
            location.href = '../menu.html';
        }else{
            listMov.classList.add('none');
            listRem.classList.add('h-80vh');
            listRem.classList.remove('h-30vh');
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
    if (e.target.nodeName === 'BUTTON'){
        seleccionado && seleccionado.classList.remove('seleccionado');
        subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');
        
        seleccionado = e.target.parentNode.parentNode.parentNode;
        subSeleccionado = e.target;

        seleccionado.classList.add('seleccionado');
        subSeleccionado.classList.add('subSeleccionado');
    };

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

        seleccionado = e.target.parentNode.parentNode;
        subSeleccionado = e.target.parentNode;

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

const handleCheckbox = async(e) => {
    const codCliente = e.target.parentNode.parentNode.children[1].innerText;

    const inputs = document.querySelectorAll('td input');

    for(let elem of inputs){
        if (elem.parentNode.parentNode.children[1].innerText !== codCliente){
            elem.disabled = !elem.disabled;
        }
    }


};

const imprimirRemito = async(e) => {
    
    if(e.target.nodeName === 'BUTTON'){
        const id = e.target.parentNode.parentNode.parentNode.id
        const {data} = await axios.get(`${URL}remitos/forId/${id}`)
        const { data: cliente} = await axios.get(`${URL}clientes/id/${data.idCliente}`);
        const { data: movs } = await axios.get(`${URL}movimiento/${data.numero}/RT`);
        ipcRenderer.send('imprimir', ['negro', data, cliente, movs, false]);
    }
}

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
        const tdSerie = document.createElement('td');

        const textAreaSerie = document.createElement('textarea');

        tdCod.classList.add('border');
        tdDesc.classList.add('border');
        tdMarca.classList.add('border');
        tdPrecio.classList.add('border');
        tdCant.classList.add('border');
        tdTotal.classList.add('border');
        tdSerie.classList.add('border');

        // tdAcciones.classList.add('flex');
        // tdAcciones.classList.add('justify-center');
        // tdAcciones.classList.add('cursor-pointer');

        tdPrecio.classList.add('text-rigth');
        tdCant.classList.add('text-rigth');
        tdTotal.classList.add('text-rigth');

        textAreaSerie.classList.add('w-full')

        tdCod.innerText = elem.codProd;
        tdDesc.innerText = elem.producto;
        tdMarca.innerText = elem.marca;
        tdPrecio.innerText = elem.precio.toFixed(2);
        tdCant.innerText = elem.cantidad.toFixed(2);
        tdTotal.innerText = (elem.precio * elem.cantidad).toFixed(2);
        textAreaSerie.innerText = elem.series;


        tdSerie.appendChild(textAreaSerie);

        tr.appendChild(tdCod);
        tr.appendChild(tdDesc);
        tr.appendChild(tdMarca);
        tr.appendChild(tdPrecio);
        tr.appendChild(tdCant);
        tr.appendChild(tdTotal);
        tr.appendChild(tdSerie);

        tbodyMov.appendChild(tr);
    }

};

const listarRemitos = (lista) => {
    tbody.innerHTML = '';

    for (let elem of lista){
        const fecha = parsearFecha(elem.fecha)
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
        const inpPasar = document.createElement('input');
        const pPasado = document.createElement('p');
        const tdReimprimir = document.createElement('td');

        tdReimprimir.addEventListener('click', imprimirRemito);

        inpPasar.type = 'checkbox';
        inpPasar.classList.add('scale-1-5');
        inpPasar.classList.add('flex');
        inpPasar.classList.add('justify-center');
        inpPasar.classList.add('w-full');
        inpPasar.name = 'pasar';
        inpPasar.id = elem._id;

        pPasado.innerText = 'PASADO';

        pPasado.classList.add('m-0');
        pPasado.classList.add('text-center');

        inpPasar.addEventListener('change', handleCheckbox);

        tdNumero.classList.add('text-rigth');

        tdFecha.classList.add('border');
        tdCodCliente.classList.add('border');
        tdCliente.classList.add('border');
        tdNumero.classList.add('border');
        tdObseraciones.classList.add('border');
        tdPasar.classList.add('border');
        tdReimprimir.classList.add('border');
        
        tdFecha.innerText = fecha;
        tdCodCliente.innerText = elem.idCliente;
        tdCliente.innerText = elem.cliente;
        tdNumero.innerText = elem.numero.toString().padStart(8, '0');
        tdObseraciones.innerText = elem.observaciones;
        tdReimprimir.innerHTML = 
        `
            <div class="flex justify-center">
                <button class="border">Re imprimir</button>
            </div>
        `

        
        tdPasar.appendChild(remitoC.checked ? pPasado : inpPasar);

        tr.appendChild(tdFecha);
        tr.appendChild(tdCodCliente);
        tr.appendChild(tdCliente);
        tr.appendChild(tdNumero);
        tr.appendChild(tdObseraciones);
        tr.appendChild(tdPasar);
        tr.appendChild(tdReimprimir);

        tbody.appendChild(tr);
    };
};


const pasarCuenta = async() => {
    const trSeleccinados = document.querySelectorAll('tr input[type="checkbox"]:checked');
    const filasSeleccionadas = Array.from(trSeleccinados).map(checkbox => checkbox.closest('tr'));
    const idFilas = filasSeleccionadas.map(elem => elem.id);
    location.href = `../venta/index.html?remito=true&remitos=${JSON.stringify(idFilas)}&vendedor=${vendedor}`;
};

buscador.addEventListener('keyup', filtrarRemitos);
document.addEventListener('keyup', apretarTecla);
remitoC.addEventListener('change', cambioTipoRemito);
pasarCTA.addEventListener('click', pasarCuenta);
tbody.addEventListener('click', clickTbody);
window.addEventListener('load', cargarPagina);