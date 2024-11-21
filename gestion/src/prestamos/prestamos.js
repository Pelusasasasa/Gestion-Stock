const axios = require('axios');
const { ipcRenderer } = require('electron');
require('dotenv').config();
const URL = process.env.URL;

const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');

const tbodyMovimientos = document.querySelector('#tbody-movimientos');

let seleccionado = '';
let subSeleccionado = '';
let prestamos = [];

const cambiarObservaciones = async() => {
    const sweet = require('sweetalert2');
    const prestamo = (await axios.get(`${URL}prestamos/forNumber/${seleccionado.id}`)).data;
    
    const {isConfirmed, value} = await sweet.fire({
        title: "Cambiar Observacion",
        input: 'text',
        showCancelButton: true,
        confirmButtonText: 'Aceptar'
    });

    if (isConfirmed){
        prestamo.observaciones = value.toUpperCase();
        await axios.put(`${URL}prestamos/forNumber/${prestamo.nro_comp}`,prestamo);
        seleccionado.children[4].innerText = value.toUpperCase();
    }

};

const clickDerecho = async(e) => {
    seleccionado && seleccionado.classList.remove('seleccionado');
    subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');

    if (e.target.nodeName === 'TD'){
        seleccionado = e.target.parentNode;
        subSeleccionado = e.target;
    };

    subSeleccionado.classList.add('subSeleccionado');
    seleccionado.classList.add('seleccionado');

    const cordenadas = {
        x:e.clientX,
        y:e.clientY,
        ventana: "VerPrestamos"
    };

    ipcRenderer.send('mostrar-menu', cordenadas);
};

const exportarExcel = async() => {
    const prestamosAux = prestamos.filter( prestamo => prestamo.observaciones === seleccionado.children[4].innerText);
    const movimientosAux = [];
    let totalAux = 0;

    for(let elem of prestamosAux){
        const mov = (await axios.get(`${URL}movProductos/${elem.nro_comp}/Prestamo`)).data;
        movimientosAux.push(...mov);
    };

    for(let elem of movimientosAux){
        const pro = (await axios.get(`${URL}productos/${elem.codProd}`)).data;
        elem.precio_unitario = pro.oferta ? pro.precioOferta : pro.precio_venta;
        elem.total = (elem.egreso * elem.precio_unitario);
        totalAux += parseFloat(elem.total);
    }

    const XLSX = require('xlsx');

    if (!seleccionado) return;

    let path = await ipcRenderer.invoke('saveDialog');
    let wb = XLSX.utils.book_new();

    let extencion = 'xlsx';
    
    let resultante = [];

    movimientosAux.forEach( mov => {
        const obj = {};
        obj.fecha = mov.fecha.slice(0,10).split('-',3).reverse().join('/');
        obj.codigo = mov.codProd;
        obj.descripcion = mov.descripcion;
        obj.nro_comp = mov.nro_comp
        obj.cantidad = mov.egreso.toFixed(2);
        obj.precio = mov.precio_unitario.toFixed(2);
        obj.total = mov.total.toFixed(2);
        obj.vendedor = mov.vendedor;

        resultante.push(obj);
    });

    resultante.push({
        '': '',
        '': '',
        'TOTAL':totalAux
    })

    wb.props = {
        Title: 'Movimientos',
        subject: 'Movimientos',
        Author: 'Electro Avenida'
    };

    let newWs = XLSX.utils.json_to_sheet(resultante);

    XLSX.utils.book_append_sheet(wb, newWs, "Movimientos");

    XLSX.writeFile(wb, path + "." + extencion);



};

//Funciones
const listarPrestamos = async(lista) => {
    
    for(let elem of lista){
        const tr = document.createElement('tr');
        tr.id = elem.nro_comp;
        
        const tdFecha = document.createElement('td');
        const tdIdCliente = document.createElement('td');
        const tdCliente = document.createElement('td');
        const tdNumero = document.createElement('td');
        const tdObservaciones = document.createElement('td');
        

        tdFecha.innerText = elem.fecha.slice(0,10).split('-',3).reverse().join('/');
        tdIdCliente.innerText = elem.codigo;
        tdCliente.innerText = elem.cliente;
        tdNumero.innerText = elem.nro_comp;
        tdObservaciones.innerText = elem.observaciones;


        tr.appendChild(tdFecha);
        tr.appendChild(tdIdCliente);
        tr.appendChild(tdCliente);
        tr.appendChild(tdNumero);
        tr.appendChild(tdObservaciones);

        tbody.appendChild(tr);
    }

};

const listarMovimientos = async( num ) => {
    const movimientos = (await axios.get(`${URL}movProductos/${num}/Prestamo`)).data;
    tbodyMovimientos.innerHTML = '';
    tbody.parentElement.parentElement.style.height = '40vh';

    seleccionado.scrollIntoView({
        block:'center',
        behavior:'smooth'
    });

    
    for(let mov of movimientos){
        const tr = document.createElement('tr');
        tr.id = mov._id;

        const tdCodigo = document.createElement('td');
        const tdDescripcion = document.createElement('td');
        const tdCantidad = document.createElement('td');
        const tdStock = document.createElement('td');
        const tdPrecio = document.createElement('td');
        const pro = (await axios.get(`${URL}productos/${mov.codProd}`)).data;
        

        tdCodigo.innerText = mov.codProd;
        tdDescripcion.innerText = mov.descripcion;
        tdCantidad.innerText = mov.egreso.toFixed(2);
        tdStock.innerText = mov.stock.toFixed(2);
        tdPrecio.innerText = pro.precio_venta.toFixed(2);

        tr.appendChild(tdCodigo);
        tr.appendChild(tdDescripcion);
        tr.appendChild(tdCantidad);
        tr.appendChild(tdStock);
        tr.appendChild(tdPrecio);

        tbodyMovimientos.appendChild(tr);
    };
};

//Eventos
window.addEventListener('load', async () => {
    prestamos = (await axios.get(`${URL}prestamos/noAnulados`)).data.filter(prestamo => prestamo.codigo === "L083");
    listarPrestamos(prestamos);
});

thead.addEventListener('click',e => {

    if (e.target.innerText === "Fecha") {
        
        prestamos.sort((a,b) => {

        if (a.fecha > b.fecha) {
            return 1;
            
        }else if(a.fecha < b.fecha){

            return -1;

        };

        return 0;

    });
    };

    if (e.target.innerText === "Nro Comp") {
        
        prestamos.sort((a,b) => {

        if (a.nro_comp > b.nro_comp) {
            return 1;
            
        }else if(a.nro_comp < b.nro_comp){

            return -1;

        };

        return 0;

    });
    };

    if (e.target.innerText === "Observaciones") {
        prestamos.sort((a,b) => {

        if (a.observaciones > b.observaciones) {
            return 1;
            
        }else if(a.observaciones < b.observaciones){

            return -1;

        };

        return 0;

    
    });
    }

    tbody.innerHTML = '';
    listarPrestamos(prestamos)

});

tbody.addEventListener('click', e => {
    
    if (e.target.nodeName === "TD") {
        seleccionado && seleccionado.classList.remove('seleccionado');

        seleccionado = e.target.parentNode;
        seleccionado.classList.add('seleccionado');


        subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');

        subSeleccionado = e.target;
        subSeleccionado.classList.add('subSeleccionado');
    };


    tbodyMovimientos.parentElement.parentElement.classList.remove('none');
    listarMovimientos(seleccionado.id);

});

tbody.addEventListener('contextmenu', clickDerecho);

tbody.addEventListener('dblclick', e => {
    
    exportarExcel()
    
});

document.addEventListener('keydown', e => {
    if (e.keyCode === 27) {
        window.location = `../menu.html`;
    }
});


ipcRenderer.on('cambiarObservacion', cambiarObservaciones);
