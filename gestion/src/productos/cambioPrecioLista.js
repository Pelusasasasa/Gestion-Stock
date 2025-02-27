require('dotenv').config();

const axios = require('axios');
const xlsx = require('xlsx');

const URL = process.env.GESTIONURL;

const tipo = document.getElementById('tipo');
const archivo = document.getElementById('archivo');

const tbody = document.getElementById('tbody');

const guardar = document.getElementById('guardarCambios');

let productosModificados = [];

archivo.addEventListener('change', (e) => {

    let selectedFile = e.target.files[0];
    let fileReader = new FileReader();
    
    fileReader.onload = async(e) => {
        let data = e.target.result;
        let woorbook = xlsx.read(data, {type: 'binary'});

        let {data: res} = await axios.get(`${URL}productos/porMarca/${tipo.value}`);
    
        await llenarLista(res.productos);

        if( tipo.value === 'HIKVISION'){
            let datos = xlsx.utils.sheet_to_json(woorbook.Sheets['MPS']);
            cambiarPrecioshikvision(datos, res.productos);
        }
    };

    fileReader.readAsBinaryString(selectedFile);
});

const cambiarPrecioshikvision = (datos, productos) => {
    for(let producto of productos){
        const productoAux = datos.find( elem => producto._id == elem.EAN);
        
        producto.costoDolar = productoAux ? productoAux.Costo : producto.costoDolar;
        productosModificados.push(producto);

        const tdCostoNuevo = document.createElement('td');

        tdCostoNuevo.value = producto.costoDolar.toFixed(2);

        const tr = document.getElementById(producto._id);
        console.log(tr)

        tr.children[4].innerText = tdCostoNuevo.value;
    }
};

const llenarLista = async (productos) => {

    for(let producto of productos){
        const tr = document.createElement('tr');
        tr.id = producto._id;

        const tdCodigo = document.createElement('td');
        const tdDescripcion = document.createElement('td');
        const tdCosto = document.createElement('td');
        const tdPrecio = document.createElement('td');
        const tdCostoNuevo = document.createElement('td');

        tdCodigo.textContent = producto._id;
        tdDescripcion.textContent = producto.descripcion.slice(0, 30);
        tdCosto.textContent = producto.costoDolar.toFixed(2);
        tdPrecio.textContent = producto.precio.toFixed(2);
        tdCostoNuevo.textContent = '0.00';


        tr.appendChild(tdCodigo);
        tr.appendChild(tdDescripcion);
        tr.appendChild(tdCosto);
        tr.appendChild(tdPrecio);
        tr.appendChild(tdCostoNuevo);

        tbody.appendChild(tr);
    };

};