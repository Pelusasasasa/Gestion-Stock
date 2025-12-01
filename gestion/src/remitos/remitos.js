const axios = require('axios');
const Swal = require('sweetalert2')
const { ipcRenderer } = require('electron');
const { getParameterByName, parsearFecha } = require('../helpers');
require('dotenv').config();

const URL = process.env.GESTIONURL;

const volver = document.getElementById('volver');
const buscador = document.getElementById('buscador');
const remitoC = document.getElementById('remitoC');
const listRem = document.getElementById('listRem');
const tbody = document.getElementById('tbody');

const listMov = document.getElementById('listMov');
const tbodyMov = document.getElementById('tbodyMov');

const pasarCTA = document.getElementById('pasarCTA');

const modal = document.getElementById('modal');
const cambiarObservaciones = document.getElementById('cambiarObservaciones');
const aceptarCambioObservaciones = document.getElementById('aceptarCambioObservaciones');


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
    listarRemitos(remitos.filter(elem => elem.pasado === remitoC.checked));
};

const cambioTipoRemito = async(e) => {
    const filtro = remitos.filter(elem => elem.cliente.startsWith(buscador.value.toUpperCase()));
    listarRemitos(filtro.filter(elem => elem.pasado === remitoC.checked));
};

const clickModal = (e) => {
    if(e.target.classList.contains('cerrarModal')){
        cambiarObservaciones.value = '';
        modal.classList.add('none');
    };
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
    movs = (await axios.get(`${URL}movimiento/${aux.numero}/${aux.tipo_venta}`)).data;
    listarMovs( movs );
};

const dobleclickTbody = (e) => {
    modal.classList.remove('none');
    cambiarObservaciones.value = seleccionado.children[4].innerText;
    cambiarObservaciones.focus();
};

const filtrarRemitos = async(e) => {
    const filtro = remitos.filter(elem => elem.cliente.startsWith(buscador.value.toUpperCase()));
    listarRemitos(filtro.filter(elem => elem.pasado === remitoC.checked));
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
        let cliente = '';
        const id = e.target.parentNode.parentNode.parentNode.id
        const { data } = await axios.get(`${URL}remitos/forId/${id}`);

        if(!data.ok) return await Swal.fire('No se pudo obtener el remito', data.msg, 'error');

        try {
            const { data: clienteTraido } = await axios.get(`${URL}clientes/id/${data.remito.idCliente}`);
            if(clienteTraido.ok){
                cliente = clienteTraido.cliente;
            }else{
                return await Swal.fire('Error al obtener el cliente', clienteTraido.msg, 'error');
            }
        } catch (error) {
            console.log(error);
            return await Swal.fire('Error al obtener el cliente', error?.response?.clienteTraido?.msg, 'error');
        }
        const { data: movs } = await axios.get(`${URL}movimiento/${data.remito.numero}/RT`);
        ipcRenderer.send('imprimir', ['negro', data.remito, cliente, movs, false]);
    }
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

        textAreaSerie.addEventListener('keyup', modificarNroSerie);


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
        tdCliente.innerText = `${elem.cliente.length > 50 ? `${elem.cliente.slice(0,50)}...` : elem.cliente}` ;
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

const modificarObservacionesRemitos = async() => {
    try {
        const { data } = await axios.patch(`${URL}remitos/observaciones/${seleccionado.id}`, {observaciones: cambiarObservaciones.value.toUpperCase()});
        if(data.ok){
            await Swal.fire(`Se modifico las observaciones del remito ${seleccionado.children[3].innerText}`, '', 'success');
            modal.classList.add('none');
            seleccionado.children[4].innerText = cambiarObservaciones.value.toUpperCase();
        }else{
            return await Swal.fire('Error al modificar las observaciones', data.msg, 'error');
        }
    } catch (error) {
        console.log(error);
        return await Swal.fire('Error al modificar las observaciones', error?.response?.data?.msg, 'error');
        
    }
};

const modificarNroSerie = async(e) => {
    const valor = e.target.value.split('\n');
    const id = e.currentTarget.parentNode.parentNode.id;
    await axios.patch(`${URL}movimiento/${id}/RT`, {series: valor});
};

const pasarCuenta = async() => {
    const trSeleccinados = document.querySelectorAll('tr input[type="checkbox"]:checked');
    const filasSeleccionadas = Array.from(trSeleccinados).map(checkbox => checkbox.closest('tr'));
    const idFilas = filasSeleccionadas.map(elem => elem.id);
    location.href = `../venta/index.html?remito=true&remitos=${JSON.stringify(idFilas)}&vendedor=${vendedor}`;
};

aceptarCambioObservaciones.addEventListener('click', modificarObservacionesRemitos);
buscador.addEventListener('keyup', filtrarRemitos);
document.addEventListener('keyup', apretarTecla);
modal.addEventListener('click', clickModal)
remitoC.addEventListener('change', cambioTipoRemito);
pasarCTA.addEventListener('click', pasarCuenta);
tbody.addEventListener('click', clickTbody);
tbody.addEventListener('dblclick', dobleclickTbody);
window.addEventListener('load', cargarPagina);

volver.addEventListener('click', () => {
    location.href = '../menu.html';
});