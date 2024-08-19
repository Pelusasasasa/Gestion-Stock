require('dotenv').config();
const axios = require("axios");
const { ipcRenderer } = require('electron');
const sweet = require('sweetalert2');

const { agregarMovimientoVendedores } = require('../helpers');

const URL = process.env.GESTIONURL;

const codigo = document.querySelector('#codigo');
const descripcion = document.querySelector('#descripcion');

const inputs = document.querySelectorAll('input[name="operacion"]');

const stock = document.querySelector('#stock');
const cantidad = document.querySelector('#cantidad');
const nuevoStock = document.querySelector('#nuevoStock');

const serie = document.querySelector('#serie');
const provedor = document.querySelector('#provedor');
const agregarSerie = document.querySelector('#agregarSerie');
const tbody = document.querySelector('#tbody');

const aceptar = document.getElementById('aceptar');
const salir = document.getElementById('salir');

let inputAux;
let producto;
let vendedor = '';

const agregarSerieTabla = async() => {
    
    if (serie.value === ""){
        await sweet.fire({
            title: 'Falta poner un numero de serie'
        });
        return;
    };

    if (provedor.value === ""){
        await sweet.fire({
            title: 'Falta poner un provedor'
        });
        return;
    };

    const tr = document.createElement('tr');

    const tdSerie = document.createElement('td');
    const tdProvedor = document.createElement('td');

    tdSerie.innerText = serie.value;
    tdProvedor.innerText = provedor.value.toUpperCase();

    tr.appendChild(tdSerie);
    tr.appendChild(tdProvedor);

    tbody.appendChild(tr);
};

const listarProducto = ({_id, descripcion:desc, stock:sto}) => {
    codigo.value = _id;
    descripcion.value = desc;
    stock.value = sto.toFixed(2)
};

const guardarMovimiento = async() => {

    if (cantidad.value === "") {
        await sweet.fire({
            title: 'Falta poner una cantidad'
        });
        return;
    }

    const producto = (await axios.get(`${URL}productos/${codigo.value}`)).data;
    producto.stock = nuevoStock.value;

    (await axios.put(`${URL}productos/descontarStock`,[producto]));

    await agregarMovimientoVendedores(inputAux.id === 'resta' ? `Resto el stock de ${stock.value} a ${nuevoStock.value} del producto ${descripcion.value}` : `Sumo el stock de ${stock.value} a ${nuevoStock.value}  del producto ${descripcion.value}`, vendedor);

    ipcRenderer.send('informacion-a-ventana', {
        _id: codigo.value,
        descripcion: descripcion.value,
        stock: nuevoStock.value,
    });

    //Hacemos para que se guarden numeros de series si es que los hay
    const trs = document.querySelectorAll('#tbody tr');
    for (let tr of trs){

        const serie = {
            provedor: tr.children[1].innerText,
            nro_serie: tr.children[0].innerText,
            codigo: codigo.value,
            producto: descripcion.value,
            marca: producto.marca,
            vendedor: vendedor
        };
        
        await axios.post(`${URL}nroSerie`, serie);

    }

    window.close();

};

ipcRenderer.on('informacion', async (e,{informacion, vendedor:vend}) => {
    vendedor = vend.nombre;
    producto = (await axios.get(`${URL}productos/${informacion}`)).data;
    listarProducto(producto);
});

agregarSerie.addEventListener('click', agregarSerieTabla);

aceptar.addEventListener('click', guardarMovimiento);

cantidad.addEventListener('keypress', e => {
    if (e.keyCode === 13) {
        cantidad.value = parseFloat(cantidad.value).toFixed(2);
        
        inputs.forEach( input => {
            if( input.checked ) {
                inputAux = input;
            }
        });

        if(inputAux.id === "resta"){
            nuevoStock.value = (parseFloat(stock.value) - parseFloat(cantidad.value)).toFixed(2);
        }else{
            nuevoStock.value = (parseFloat(stock.value) + parseFloat(cantidad.value)).toFixed(2);
        };

        aceptar.focus();
    };
});

document.addEventListener('keydown', e => {
    if(e.keyCode === 27){
        window.close();
    }
});

serie.addEventListener('keypress', (e) => {
    if (e.keyCode === 13) provedor.focus();
});

salir.addEventListener('click', e => {
    window.close();
});
