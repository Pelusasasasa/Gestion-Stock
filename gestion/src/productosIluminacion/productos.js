const axios = require('axios');

const URL = process.env.URL;

const tipo = document.getElementById('tipo');
const buscador = document.getElementById('buscador');
const tbody = document.getElementById('tbody');

let productos = [];

const apretartecla = async(e) => {
    if(e.keyCode === 27){
        location.href = `../menu.html`;
    };  
};

const cargarPagina = async() => {
    
    if (buscador.value === ''){
        productos = (await axios.get(`${URL}productos/buscarProducto/textoVacio/descripcion`)).data;
    }else{
        productos = (await axios.get(`${URL}productos/buscarProducto/${buscador.value}/${tipo.value}`)).data;
    }

    listarProductos(productos);
};

const filtrar = async() => {

    const texto = buscador.value.toUpperCase();
    const nuevoTexto = texto === '' ? 'textoVacio' : texto.replace('/', 'ALT47');
    const condicion = tipo.value === 'codigo' ? '_id' : tipo.value;

    productos = (await axios.get(`${URL}productos/buscarProducto/${nuevoTexto}/${condicion}`)).data;
    listarProductos(productos);
};

const listarProductos = async(lista) => {
    tbody.innerHTML = '';
    for(let elem of lista){
        const tr = document.createElement('tr');
        tr.id = elem._id;

        tr.classList.add('cursor-pointer');
        tr.classList.add('hover-bg-gray');

        const tdCodigo = document.createElement('td');
        const tdDescripcion = document.createElement('td');
        const tdMarca = document.createElement('td');
        const tdStock = document.createElement('td');
        const tdPrecio = document.createElement('td');

        tdCodigo.classList.add('border');
        tdDescripcion.classList.add('border');
        tdMarca.classList.add('border');
        tdStock.classList.add('border');
        tdPrecio.classList.add('border');

        tdStock.classList.add('text-rigth');
        tdPrecio.classList.add('text-rigth');

        tdCodigo.innerText = elem._id;
        tdDescripcion.innerText = elem.descripcion;
        tdMarca.innerText = elem.marca;
        tdStock.innerText = elem.stock;
        tdPrecio.innerText = elem.precio_venta?.toFixed(2);

        tr.appendChild(tdCodigo);
        tr.appendChild(tdDescripcion);
        tr.appendChild(tdMarca);
        tr.appendChild(tdStock);
        tr.appendChild(tdPrecio);

        tbody.appendChild(tr);
    }
};

buscador.addEventListener('keyup', filtrar);
document.addEventListener('keyup',apretartecla);
window.addEventListener('load', cargarPagina);