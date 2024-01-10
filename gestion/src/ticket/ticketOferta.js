const { ipcRenderer } = require("electron");

const descripcion = document.getElementById('descripcion');
const precioOferta = document.getElementById('precioOferta');
const precioOriginal = document.getElementById('precioOriginal');

ipcRenderer.on('info', (e,args) => {
    const {descripcion:desc,precio,preciO} = args;
    descripcion.innerText = desc;
    precioOferta.innerText = precio;
    precioOriginal.innerText = preciO;

    ipcRenderer.send('imprimir-ventana')
})