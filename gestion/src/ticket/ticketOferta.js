const { ipcRenderer } = require("electron");

const descripcion = document.getElementById('descripcion');
const marca = document.getElementById('marca');
const oferta = document.getElementById('precioOferta');
const precioOriginal = document.getElementById('precioOriginal');

ipcRenderer.on('info', (e,args) => {
    const {descripcion:desc,precio,precioOferta,marca:marc} = args;
    descripcion.innerText = desc;
    marca.innerText = marc;
    oferta.innerText = precioOferta.toFixed(2);
    precioOriginal.innerText = precio.toFixed(2);

    ipcRenderer.send('imprimir-ventana')
})