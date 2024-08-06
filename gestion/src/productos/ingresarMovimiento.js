require('dotenv').config();
const axios = require("axios");
const { ipcRenderer } = require('electron');
const { agregarMovimientoVendedores } = require('../helpers');

const URL = process.env.GESTIONURL;

const codigo = document.querySelector('#codigo');
const descripcion = document.querySelector('#descripcion');

const inputs = document.querySelectorAll('input[name="operacion"]');

const stock = document.querySelector('#stock');
const cantidad = document.querySelector('#cantidad');
const nuevoStock = document.querySelector('#nuevoStock');


const aceptar = document.getElementById('aceptar');
const salir = document.getElementById('salir');

let inputAux;
let vendedor = '';

const listarProducto = ({_id, descripcion:desc, stock:sto}) => {
    codigo.value = _id;
    descripcion.value = desc;
    stock.value = sto.toFixed(2)
};

const guardarMovimiento = async() => {

    const producto = (await axios.get(`${URL}productos/${codigo.value}`)).data;
    producto.stock = nuevoStock.value;

    (await axios.put(`${URL}productos/descontarStock`,[producto]));

    await agregarMovimientoVendedores(inputAux.id === 'resta' ? `Resto el stock de ${stock.value} a ${nuevoStock.value} del producto ${descripcion.value}` : `Sumo el stock de ${stock.value} a ${nuevoStock.value}  del producto ${descripcion.value}`, vendedor);

    ipcRenderer.send('informacion-a-ventana', {
        _id: codigo.value,
        descripcion: descripcion.value,
        stock: nuevoStock.value,
    })

    window.close();

};

ipcRenderer.on('informacion', async (e,{informacion, vendedor:vend}) => {
    vendedor = vend.nombre;
    const producto = (await axios.get(`${URL}productos/${informacion}`)).data;
    listarProducto(producto)
});

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

aceptar.addEventListener('click', guardarMovimiento);

salir.addEventListener('click', e => {

    window.close();

});
