const { ipcRenderer } = require("electron");
const { parsearFecha } = require("../helpers");


const fecha = document.getElementById('fecha');
const numero = document.getElementById('numero');

const cliente = document.getElementById('cliente');
const direccion = document.getElementById('direccion');
const telefono = document.getElementById('telefono');
const detalle = document.getElementById('detalle');

const tbody = document.getElementById('tbody');

const sugerencia = document.getElementById('sugerencia');



ipcRenderer.on('imprimir-servicio', async(e, args) => {
    const servicio = JSON.parse(args);

    await listarInfoServicio(servicio);

    ipcRenderer.send('imprimir-ventana');
});


const listarInfoServicio = (servicio) => {

    fecha.innerText = parsearFecha(servicio.fecha);
    numero.innerText = `ST-${servicio.numero.toString().padStart(4, '0')}`

};