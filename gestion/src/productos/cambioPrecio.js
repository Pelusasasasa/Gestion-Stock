const axios = require('axios');
require('dotenv').config();
const URL = process.env.GESTIONURL;

const tipo = document.getElementById('tipo');
const datos = document.getElementById('datos');
const iva = document.getElementById('iva');

const costo = document.getElementById('costo');
const descuento1 = document.getElementById('descuento1');
const descuento2 = document.getElementById('descuento2');
const descuento3 = document.getElementById('descuento3');

const tbody = document.querySelector('tbody');

const guardar = document.getElementById('guardar');
const salir = document.getElementById('salir');

let productos = [];

const traerListado = async(e) =>{
    datos.innerHTML = '';
    const aux = e.target.value;
    const lista = (await axios.get(`${URL}${aux}`)).data;
    for(let elem of lista){
        const option = document.createElement('option');
        option.value = elem.numero;
        option.text = elem.numero + ' - ' + elem[aux];

        datos.appendChild(option);
    }
};

const listarProductos = async() => {
    
    for(let elem of productos){
        const tr = document.createElement('tr');
        tr.id = elem._id;

        const tdCodigo = document.createElement('td');
        const tdDescripcion = document.createElement('td');
        const tdCosto = document.createElement('td');
        const tdDescuento1 = document.createElement('td');
        const tdDescuento2 = document.createElement('td');
        const tdDescuento3 = document.createElement('td');
        const tdIva = document.createElement('td');
        const tdPrecio = document.createElement('td');

        tdCodigo.innerText = elem._id;
        tdDescripcion.innerText = elem.descripcion
        tdCosto.innerText = elem.costo.toFixed(2);
        
        tdDescuento1.innerText = elem.descuento1.toFixed(2);
        tdDescuento2.innerText = elem.descuento2.toFixed(2);
        tdDescuento3.innerText = elem.descuento3.toFixed(2);

        tdIva.innerText = elem.impuesto.toFixed(2);

        tdPrecio.innerText = elem.precio.toFixed(2);

        tr.appendChild(tdCodigo);
        tr.appendChild(tdDescripcion);
        tr.appendChild(tdCosto);
        tr.appendChild(tdDescuento1);
        tr.appendChild(tdDescuento2);
        tr.appendChild(tdDescuento3);
        tr.appendChild(tdIva);
        tr.appendChild(tdPrecio);

        tbody.appendChild(tr);
    }
};

const cambiarIva = async(e) => {
    if(e.target.value === '')return;

    if (productos.length === 0){
        const sweet = require('sweetalert2');
        sweet.fire({
            title: "No trajo porductos"
        });
    }else{
        for await(let elem of productos){
            
            elem.impuesto = parseFloat(e.target.value);
            const costoDescuento1 = elem.costo - (elem.costo * (elem.descuento1 / 100));
            const costoDescuento2 = costoDescuento1 - (costoDescuento1 * (elem.descuento2 / 100));
            const costoDescuento3 = costoDescuento2 - (costoDescuento2 * (elem.descuento3 / 100));
            const costoIva = costoDescuento3 + (costoDescuento3 * elem.impuesto / 100);
            const costoGancancia = costoIva + (costoIva * elem.ganancia / 100);

            elem.precio = costoGancancia;
        };
        tbody.innerHTML = "";
        listarProductos(productos);
    }

};

const actualizarCosto = async(numero) => {
    for (let elem of productos){

        if (iva.value !== "") {
            elem.impuesto = parseFloat(iva.value);
        };

        elem.costo = elem.costo + (elem.costo * (numero / 100));

        const costoDescuento1 = elem.costo - (elem.costo * (elem.descuento1 / 100));
        const costoDescuento2 = costoDescuento1 - (costoDescuento1 * (elem.descuento2 / 100));
        const costoDescuento3 = costoDescuento2 - (costoDescuento2 * (elem.descuento3 / 100));
        const costoIva = costoDescuento3 + (costoDescuento3 * elem.impuesto / 100);

        const costoGancancia = costoIva + (costoIva * elem.ganancia / 100);

        elem.precio = costoGancancia;
    };

    listarProductos(productos);
};

const actualizarDescuento1 = async(numero) => {
    for (let elem of productos){
        elem.descuento1 = numero;
        elem.descuento2 = parseFloat(descuento2.value);
        elem.descuento3 = parseFloat(descuento3.value);

        if (iva.value !== "") {
            elem.impuesto = parseFloat(iva.value);
        };

        const costoDescuento1 = elem.costo - (elem.costo * (numero / 100));
        const costoDescuento2 = costoDescuento1 - (costoDescuento1 * (elem.descuento2 / 100));  
        const costoDescuento3 = costoDescuento2 - (costoDescuento2 * (elem.descuento3 / 100));
        
        const costoIva = costoDescuento3 + (costoDescuento3 * elem.impuesto / 100);
        const costoGancancia = costoIva + (costoIva * elem.ganancia / 100);

        elem.precio = costoGancancia;
    };
    tbody.innerHTML = "";
    listarProductos(productos)
};

const actualizarDescuento2 = async(numero) => {
    for (let elem of productos){
        elem.descuento1 = parseFloat(descuento1.value);
        elem.descuento2 = numero;
        elem.descuento3 = parseFloat(descuento3.value);

        if (iva.value !== "") {
            elem.impuesto = parseFloat(iva.value);
        };

        const costoDescuento1 = elem.costo - (elem.costo * (elem.descuento1  / 100));  
        const costoDescuento2 = costoDescuento1 - (costoDescuento1 * (elem.descuento2 / 100));
        const costoDescuento3 = costoDescuento2 - (costoDescuento2 * (elem.descuento3 / 100));
        
        const costoIva = costoDescuento3 + (costoDescuento3 * elem.impuesto / 100);
        const costoGancancia = costoIva + (costoIva * elem.ganancia / 100);

        elem.precio = costoGancancia;
    };
    tbody.innerHTML = "";;
    listarProductos(productos);
};

const actualizarDescuento3 = async(numero) => {
    for (let elem of productos){
        elem.descuento1 = parseFloat(descuento1.value);
        elem.descuento2 = parseFloat(descuento2.value);
        elem.descuento3 = numero;

        if (iva.value !== "") {
            elem.impuesto = parseFloat(iva.value);
        };
        

        const costoDescuento1 = elem.costo - (elem.costo * (elem.descuento1  / 100));  
        const costoDescuento2 = costoDescuento1 - (costoDescuento1 * (elem.descuento2 / 100));
        const costoDescuento3 = costoDescuento2 - (costoDescuento2 * (elem.descuento3 / 100));
        
        const costoIva = costoDescuento3 + (costoDescuento3 * elem.impuesto / 100);
        const costoGancancia = costoIva + (costoIva * elem.ganancia / 100);

        elem.precio = costoGancancia;
    };
    tbody.innerHTML = "";;
    listarProductos(productos);
};

const guardarCambios = async () => {

    for(let elem of productos){
        const res = (await axios.put(`${URL}productos/${elem._id.replace(/\//g,'%2F')}`,elem)).data;
        console.log(res)
    }

    location.reload();

};

tipo.addEventListener('change', traerListado);

tipo.addEventListener('keypress', e => {
    if (e.keyCode === 13) {
        e.preventDefault();
        traerListado(e);
        datos.focus();
    };
});

datos.addEventListener('keypress', async e => {
    if (e.keyCode === 13) {
        e.preventDefault()
        costo.focus();
        productos = (await axios.get(`${URL}productos/traerPorTipo/${tipo.value}/${e.target.value}`)).data;
        listarProductos();
    };
});

iva.addEventListener('change', cambiarIva);

costo.addEventListener('keypress', e => {
    if (e.keyCode === 13) {
        e.preventDefault()
        descuento1.focus();
        tbody.innerHTML = "";
        actualizarCosto(parseFloat(e.target.value));
    };


});

descuento1.addEventListener('keypress', e => {
    if (e.keyCode === 13) {
        e.preventDefault();
        actualizarDescuento1(parseFloat(e.target.value));
        descuento2.focus();
    };
});

descuento2.addEventListener('keypress', e => {
    if (e.keyCode === 13) {
        e.preventDefault()
        actualizarDescuento2(parseFloat(e.target.value));
        descuento3.focus();
    };
});

descuento3.addEventListener('keypress', e => {
    if (e.keyCode === 13) {
        actualizarDescuento3(parseFloat(e.target.value));
    }
});

document.addEventListener('keyup', e => {
    if (e.keyCode === 27) {
        location.href = '../menu.html';
    };
});

guardar.addEventListener('click', guardarCambios);

salir.addEventListener('click', e => {

    location.href = '../menu.html';

});