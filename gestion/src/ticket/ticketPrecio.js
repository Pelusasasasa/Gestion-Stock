const { ipcRenderer } = require('electron');

const descripcion = document.getElementById('descripcion');
const precio = document.getElementById('precio');



ipcRenderer.on('imprimir',(e,producto)=>{
    const elem = JSON.parse(producto);
    console.log(elem)
    descripcion.innerText = elem.descripcion;
    precio.innerText = "$" + elem.precio.toFixed(2);
    // ipcRenderer.send('imprimir-ventana');
});