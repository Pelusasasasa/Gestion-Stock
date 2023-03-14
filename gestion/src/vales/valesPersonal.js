const axios = require('axios');
require('dotenv').config();
const URL = process.env.URL;
console.log(URL);

const tbody = document.querySelector('tbody');
const totalInput = document.getElementById('total');

window.addEventListener('load',async e=>{
    const vales = (await axios.get(`${URL}vales/personal`)).data.filter(vale=>(vale.rsoc === "GONZALO" || vale.rsoc === "CARLA"));
    listarVales(vales);
});

const listarVales = async(lista)=>{
    let total = 0;
    for await (let {fecha,nro_comp,imp,rsoc} of lista){
        const tr = document.createElement('tr');

        const tdFecha = document.createElement('td');
        const tdNumero = document.createElement('td');
        const tdRazon = document.createElement('td');
        const tdImporte = document.createElement('td');

        const date = fecha.slice(0,10).split('-',3);

        tdFecha.innerHTML = `${date[2]}/${date[1]}/${date[0]}`;
        tdNumero.innerHTML = nro_comp;
        tdRazon.innerHTML = rsoc;
        tdImporte.innerHTML = imp.toFixed(2);

        tdImporte.classList.add("text-rigth");

        tr.appendChild(tdFecha);
        tr.appendChild(tdNumero);
        tr.appendChild(tdRazon);
        tr.appendChild(tdImporte);

        tbody.appendChild(tr);
        total+=imp;
    }

    totalInput.value = total.toFixed(2);
}
