const { ipcRenderer } = require("electron");
const { parsearFecha } = require("../helpers");


const fecha = document.getElementById('fecha');
const numero = document.getElementById('numero');

const cliente = document.getElementById('cliente');
const nombre = document.getElementById('nombre');
const direccion = document.getElementById('direccion');
const telefono = document.getElementById('telefono');
const detalle = document.getElementById('detalle');

const tbody = document.getElementById('tbody');

const sugerencia = document.getElementById('sugerencia');


ipcRenderer.on('imprimir-servicio', async(e, args) => {
    const {servicio, equipos} = JSON.parse(args);
    
    await listarInfoServicio(servicio);
    await listarEquipos(equipos);

    ipcRenderer.send('imprimir-ventana');
});

const listarInfoServicio = (servicio) => {
    fecha.innerText = parsearFecha(servicio.fecha);
    numero.innerText = `ST-${servicio.numero.toString().padStart(4, '0')}`

    nombre.innerText = servicio.datosClientes?.nombre;
    direccion.innerText = servicio.datosClientes?.direccion;
    telefono.innerText = servicio.datosClientes?.telefono;

    sugerencia.innerText = servicio.sugerencias;

};

const listarEquipos = (equipos = []) => {
    const fragment = document.createDocumentFragment();
    tbody.innerHTML = '';
    
    for(let equipo of equipos) {
        const tr = document.createElement('tr');
        
        tr.classList.add('h-2');

        const tdEquipo = document.createElement('td');
        const tdMarca = document.createElement('td');
        const tdSerie = document.createElement('td');
        const tdEstado = document.createElement('td');

        tdEquipo.classList.add('border');
        tdMarca.classList.add('border');
        tdSerie.classList.add('border');
        tdEstado.classList.add('border');

        tdEquipo.innerText = equipo.equipo
        tdMarca.innerText = equipo.marca
        tdSerie.innerText = equipo.serie
        tdEstado.innerText = equipo.estado

        tr.appendChild(tdEquipo),
        tr.appendChild(tdMarca),
        tr.appendChild(tdSerie),
        tr.appendChild(tdEstado),

        fragment.appendChild(tr)
    };

    tbody.appendChild(fragment);
};