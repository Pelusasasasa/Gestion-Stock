//Controlado 8/09/2022
const axios = require('axios');
const { ipcRenderer } = require('electron');
const { clickderecho } = require('../helpers');
require("dotenv").config();
const URL = process.env.GESTIONURL;

const contado = document.getElementById('contado');
const cuentaCorriente = document.getElementById('cuentaCorriente');


const select = document.querySelector('#rubro');
const tbody = document.querySelector('tbody');
const desde = document.querySelector('#desde');
const hasta = document.querySelector('#hasta');
const esteMes = document.querySelector('.mes');
const total = document.querySelector('#total');
const totalCuentaCorriente = document.querySelector('#totalCuentaCorriente');

const volver = document.querySelector('.volver');

let seleccionado;
let subSeleccionado;
let contadoBandera = true;
let totalContado;
let totalCorriente

const hoy = new Date();
let dia = hoy.getDate();
let mes = hoy.getMonth() + 1;
let anio = hoy.getFullYear();

dia = dia<10 ? `0${dia}` : dia;
mes = mes<10 ? `0${mes}` : mes;
mes = mes === 13 ? 1 : mes;

desde.value = `${anio}-${mes}-${dia}`;
hasta.value = `${anio}-${mes}-${dia}`;

window.addEventListener('load',async e => {
    const rubros = (await axios.get(`${URL}rubro`)).data;
    for(let rubro of rubros){
        const option = document.createElement('option');
        option.innerHTML = rubro.numero + "-" + rubro.rubro;
        option.value = rubro.numero;
        select.appendChild(option);
    };
    traerProductos(select.value);
});

cuentaCorriente.addEventListener('click',e =>{
    if (contado.classList.contains('active')) {
        cuentaCorriente.classList.add('active');
        contado.classList.remove('active');
        contadoBandera = false;
        traerProductos(select.value);
    }
});

contado.addEventListener('click',e =>{
    if (cuentaCorriente.classList.contains('active')) {
        contado.classList.add('active');
        cuentaCorriente.classList.remove('active');
        contadoBandera = true;
        traerProductos(select.value);
    }
});

const traerProductos = async(rubro,mesBandera)=>{
    tbody.innerHTML = ""; //LIMPIAMOS EL TBODY
    let totalMovimientos = 0; //ES UN TOTAL PARA  MOSTRAR EN LA PANTALLA
    let auxCuentaCorriente = 0;
    let movimiento;

    if (mesBandera) {
        const primerDiaMes = new Date();
        primerDiaMes.setDate(1);

        let dia = primerDiaMes.getDate();
        let mes = primerDiaMes.getMonth() + 1;

        dia = dia < 10 ? `0${dia}` : dia;
        mes = mes < 10 ? `0${mes}` : mes;
        mes = mes === 13 ? 1 : mes;

        const fechaActual = new Date();
        const ultimoDiaDelMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1,0);

        const fechaDesde = `${primerDiaMes.getFullYear()}-${mes}-${dia}`;
        const fechaHasta = ultimoDiaDelMes.toISOString().slice(0,10).split('/',3).join('-');

        movimiento = (await axios.get(`${URL}movimiento/rubro/${rubro}/${fechaDesde}/${fechaHasta}`)).data;
    }else{
        movimiento = (await axios.get(`${URL}movimiento/rubro/${rubro}/${desde.value}/${hasta.value}`)).data;
    };

    //Sacamos de el arreglo los movimientos que son cancelados
    movimiento = movimiento.filter(mov => mov.tipo_comp !== "CL");

    movimiento.sort((a,b)=>{
        if (a.fecha > b.fecha) {
            return 1;
        }else if(b.fecha < a.fecha){
            return -1
        }
        return 0;
    });

    for(let mov of movimiento){
        const fecha = new Date(mov.fecha);
        let dia = fecha.getDate();
        let mes = fecha.getMonth() + 1;
        let anio = fecha.getFullYear();
        let hora = fecha.getHours();
        let min = fecha.getMinutes();
        let seg =  fecha.getSeconds();

        dia = dia<10 ? `0${dia}` : dia;
        mes = mes === 13 ? 1 : mes;
        mes = mes<10 ? `0${mes}` : mes;

        hora = hora<10 ? `0${hora}` : hora;
        min = min<10 ? `0${min}` : min;
        seg = seg<10 ? `0${seg}` : seg;

        const tr = document.createElement('tr');

        const tdNumero = document.createElement('td');
        const tdFecha = document.createElement('td');
        const tdCliente = document.createElement('td');
        const tdCodigo = document.createElement('td');
        const tdProducto = document.createElement('td');
        const tdCantidad = document.createElement('td');
        const tdPrecio = document.createElement('td');
        const tdTotal = document.createElement('td');
        const tdMarca = document.createElement('td');

        tdNumero.innerHTML = mov.nro_venta;
        tdFecha.innerHTML = `${dia}/${mes}/${anio}`;
        tdCliente.innerHTML =  mov.cliente;
        tdCodigo.innerHTML = mov.codProd;
        tdProducto.innerHTML = mov.producto;
        tdCantidad.innerHTML = mov.cantidad;
        tdPrecio.innerHTML = mov.precio.toFixed(2);
        tdTotal.innerHTML = (mov.precio * mov.cantidad).toFixed(2);
        tdMarca.innerHTML = mov.marca;

        tr.appendChild(tdNumero);
        tr.appendChild(tdFecha);
        tr.appendChild(tdCliente);
        tr.appendChild(tdCodigo);
        tr.appendChild(tdProducto);
        tr.appendChild(tdCantidad);
        tr.appendChild(tdPrecio);
        tr.appendChild(tdTotal);
        tr.appendChild(tdMarca);

        if ((mov.tipo_venta !== "CC" && contadoBandera) || (mov.tipo_venta === "CC" && !contadoBandera)) {
            tbody.appendChild(tr);
        }

        if (mov.tipo_venta !== "CC") {
            totalMovimientos += mov.cantidad * mov.precio;//sumamos el total del movimiento al total para despues mostrarlo
        }else{
            auxCuentaCorriente += mov.cantidad * mov.precio;
        }
    };

    total.value = totalMovimientos.toFixed(2);
    totalCuentaCorriente.value = auxCuentaCorriente.toFixed(2);
};

hasta.addEventListener('keypress',e=>{
    if (e.key==="Enter") {
        traerProductos(select.value);
    };
    esteMes.children[0].classList.remove('active');
});

desde.addEventListener('keypress',e=>{
    if (e.key==="Enter") {
        hasta.focus();
    };
});

esteMes.addEventListener('click',e=>{
    traerProductos(select.value,true);
    esteMes.children[0].classList.add('active');
});

select.addEventListener('click',e=>{
    if (esteMes.children[0].classList.contains('active')) {
        traerProductos(select.value,true);
    }else{
        traerProductos(select.value);
    };
});

document.addEventListener('keyup',e=>{
    if (e.keyCode === 27) {
        location.href = "../menu.html";
    }
});

volver.addEventListener('click',e=>{
    location.href = "../menu.html";
});

tbody.addEventListener('click',async e =>{
    console.log(e.target)
    if(e.target.nodeName === "TD"){
        seleccionado && seleccionado.classList.remove('seleccionado');
        subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');
        
        seleccionado = e.target.parentNode;
        subSeleccionado = e.target;

        seleccionado.classList.add('seleccionado');
        subSeleccionado.classList.add('subSeleccionado');
    };

});

tbody.addEventListener('contextmenu',async e =>{

    if(e.target.nodeName === "TD"){
        seleccionado && seleccionado.classList.remove('seleccionado');
        subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');
        
        seleccionado = e.target.parentNode;
        subSeleccionado = e.target;

        seleccionado.classList.add('seleccionado');
        subSeleccionado.classList.add('subSeleccionado');
    };

    clickderecho(e,'movimientos');
});

ipcRenderer.on('sumarMovimiento',sumarMovimientos);

async function sumarMovimientos(e) {
    const sweet = require('sweetalert2');
    const trs = document.querySelectorAll('tbody tr');
    const tr = seleccionado;
    const texto = tr.children[4].innerText;
    
    let total = 0;
    let cantidad = 0;
    for(let elem of trs){
        if (elem.children[4].innerText === texto) {
            total += parseFloat(elem.children[7].innerText);
            cantidad += parseFloat(elem.children[5].innerText);
        }
    }

    await sweet.fire({
        title: `Se vendio la cantidad de ${cantidad} del producto ${texto} con un total de $${total}`
    })
};
