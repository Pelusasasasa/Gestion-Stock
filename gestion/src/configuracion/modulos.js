const fs = require('fs');
const sweet = require('sweetalert2');
const path = require('path');
require('dotenv').config();

const URL = process.env.GESTIONURL;
const modulos = require('../config.json');


const configPath = path.join(__dirname, '../config.json');

const venta = document.getElementById('venta');
const cliente = document.getElementById('cliente');
const producto = document.getElementById('producto');
const caja = document.getElementById('caja');
const movimiento = document.getElementById('movimiento');
const consultar = document.getElementById('consultar');
const recibo = document.getElementById('recibo');
const remito = document.getElementById('remito');
const gasto = document.getElementById('gasto');

const guardar = document.getElementById('guardar');
const salir = document.getElementById('salir');

const cargarPagina = () => {
    console.log(modulos)
    if (modulos.ventas){
        venta.checked = true;
    };

    if (modulos.clientes){
        cliente.checked = true;
    };

    if (modulos.productos){
        producto.checked = true;
    };
    if (modulos.caja){
        caja.checked = true;
    };

    if (modulos.movimientos){
        movimiento.checked = true;
    };

    if (modulos.recibos){
        recibo.checked = true;
    };

    if (modulos.consultas){
        consultar.checked = true;
    };

    if (modulos.remitos){
        remito.checked = true;
    };

    if (modulos.gastos){
        gasto.checked = true;
    };

};

const updateConfig = async() => {
    const modulos = {
        ventas: venta.checked,
        clientes: cliente.checked,
        productos: producto.checked,
        caja: caja.checked,
        movimientos: movimiento.checked,
        recibos: recibo.checked,
        consultas: consultar.checked,
        remitos: remito.checked,
        gastos: gasto.checked
    };

    fs.writeFileSync(configPath, JSON.stringify(modulos, null, 2), 'utf-8');

    await sweet.fire({
        title: 'Modulos Actualizados',
        icon: 'success'
    });

    window.close();
}

guardar.addEventListener('click', updateConfig);
salir.addEventListener('click', () => {
    window.close();
});
window.addEventListener('load', cargarPagina);

