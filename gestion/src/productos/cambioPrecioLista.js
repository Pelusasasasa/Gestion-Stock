require('dotenv').config();

const swet = require('sweetalert2');
const axios = require('axios');
const xlsx = require('xlsx');

const URL = process.env.GESTIONURL;

const tipo = document.getElementById('tipo');
const archivo = document.getElementById('archivo');

const mensaje = document.getElementById('mensaje');

const tbody = document.getElementById('tbody');

const guardar = document.getElementById('guardar');

let productosModificados = [];

let dolar = 0;

archivo.addEventListener('change', (e) => {

    let selectedFile = e.target.files[0];
    let fileReader = new FileReader();

    fileReader.onload = async (e) => {
        let data = e.target.result;
        let woorbook = xlsx.read(data, { type: 'binary' });

        let { data: res } = await axios.get(`${URL}productos/porMarca/${tipo.value}`);

        await llenarLista(res.productos);

        if (tipo.value === 'HIKVISION') {
            let datos = xlsx.utils.sheet_to_json(woorbook.Sheets['MPS']);
            cambiarPrecioshikvision(datos, res.productos);
        }
    };

    fileReader.readAsBinaryString(selectedFile);
});

const apretarTecla = (e) => {
    if (e.keyCode === 27) {
        window.close();
    }
}

const cambiarPrecioshikvision = (datos, productos) => {
    for (let producto of productos) {
        const productoAux = datos.find(elem => producto._id == elem.EAN);

        if (producto.costoDolar !== 0) {
            producto.costoDolar = productoAux ? productoAux.Costo : producto.costoDolar;
        } else {
            producto.costo = productoAux ? productoAux.Costo : producto.costoDolar;
        };

        productosModificados.push(producto);

        const tdCostoNuevo = document.createElement('td');
        const tdPrecioNuevo = document.createElement('td');
        const tdPorcentaje = document.createElement('td');

        const costo_Iva = producto.costoDolar !== 0
            ? (producto.costoDolar + (producto.costoDolar * producto.impuesto / 100)) * dolar
            : (producto.costoDolar + (producto.costoDolar * producto.impuesto / 100));

        const utilidad = (costo_Iva + (costo_Iva * producto.ganancia / 100));

        producto.precio = parseFloat(utilidad.toFixed(2));
        let porcentaje = 0;

        tdCostoNuevo.value = producto.costoDolar.toFixed(2);
        tdPrecioNuevo.value = utilidad.toFixed(2);

        const tr = document.getElementById(producto._id);

        porcentaje = (producto.precio - parseFloat(tr.children[3].innerText)) / parseFloat(tr.children[3].innerText) * 100;
        tdPorcentaje.value = porcentaje.toFixed(2) + " %";

        tr.children[4].innerText = tdCostoNuevo.value;
        tr.children[5].innerText = tdPrecioNuevo.value;
        tr.children[6].innerText = tdPorcentaje.value;
    }
};

const cargarArchvio = async () => {
    const { data } = await axios.get(`${URL}numero`);
    dolar = data.Dolar;
};

const guardarCambios = async () => {

    if (productosModificados.length === 0) return swet.fire('No hay productos a modificar');

    const { data } = await axios.put(`${URL}productos`, productosModificados);

    if (data.ok) {
        await swet.fire('Modificar Varios Productos', `${data.msg}`, 'success');
    } else {
        await swet.fire('Modificar Varios Productos', `${data.msg}`, 'error');
    };

    window.close();

};

const llenarLista = async (productos) => {

    for (let producto of productos) {
        const tr = document.createElement('tr');
        tr.id = producto._id;

        const tdCodigo = document.createElement('td');
        const tdDescripcion = document.createElement('td');
        const tdCosto = document.createElement('td');
        const tdPrecio = document.createElement('td');
        const tdCostoNuevo = document.createElement('td');
        const tdPrecioNuevo = document.createElement('td');
        const tdPorcentaje = document.createElement('td');

        tdCodigo.textContent = producto._id;
        tdDescripcion.textContent = producto.descripcion.slice(0, 30);
        tdCosto.textContent = producto.costoDolar !== 0 ? producto.costoDolar.toFixed(2) : producto.costo.toFixed(2);
        tdPrecio.textContent = producto.precio.toFixed(2);
        tdCostoNuevo.textContent = '0.00';
        tdPrecioNuevo.textContent = '0.00';
        tdPorcentaje.textContent = '0.00';


        tr.appendChild(tdCodigo);
        tr.appendChild(tdDescripcion);
        tr.appendChild(tdCosto);
        tr.appendChild(tdPrecio);
        tr.appendChild(tdCostoNuevo);
        tr.appendChild(tdPrecioNuevo);
        tr.appendChild(tdPorcentaje);

        tbody.appendChild(tr);
    };

};

const mostrarMensaje = (e) => {

    if (e.target.value === 'HIKVISION') {
        mensaje.innerText = 'La Columa del codigo de barra tiene que llamarse EAN y la del precio final Costo, tambien la hoja del excel tiene que llamarse MPS'
    }

};

document.addEventListener('keyup', apretarTecla);

guardar.addEventListener('click', guardarCambios);

tipo.addEventListener('focus', mostrarMensaje);

window.addEventListener('load', cargarArchvio);
