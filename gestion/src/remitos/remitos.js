const axios = require('axios');
require('dotenv').config();

const URL = process.env.GESTIONURL;

const buscador = document.getElementById('buscador');
const tbody = document.getElementById('tbody');

const pasarCTA = document.getElementById('pasarCTA');

let remitos = [];
let seleccionado = '';
let subSeleccionado = '';

const cargarPagina = async() => {
    remitos =(await axios.get(`${URL}remitos`)).data;
    listarRemitos(remitos)
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

        seleccionado = e.target.parentNode.parentNode;
        subSeleccionado = e.target.parentNode;

        seleccionado.classList.add('seleccionado');
        subSeleccionado.classList.add('subSeleccionado');
    }
}

const filtrarRemitos = async(e) => {
    const filtro = remitos.filter(elem => elem.cliente.startsWith(buscador.value.toUpperCase()))
    listarRemitos(filtro);
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

}

window.addEventListener('load', cargarPagina);
buscador.addEventListener('keyup', filtrarRemitos);
pasarCTA.addEventListener('click', pasarCuenta);
tbody.addEventListener('click', clickTbody);