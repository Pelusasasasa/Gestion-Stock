const axios = require('axios');
require('dotenv').config()
const URL = process.env.URL;

const sweet = require('sweetalert2');

const select = document.querySelector('#marcas');
const porcentaje = document.querySelector('#porcentaje');

const aceptar = document.querySelector('.aceptar');
const salir = document.querySelector('.salir');

//Cuando carga la pagina trae las marcas
window.addEventListener('load',async e=>{
    const marcas = (await axios.get(`${URL}productos/marcas`)).data;
    for await (let marca of marcas){
        const option = document.createElement('option');
        option.value = marca;
        option.text = marca;
        select.appendChild(option)
    }
});

aceptar.addEventListener('click',async e=>{
    if (porcentaje.value !== "") {
        const mensaje = (await axios.put(`${URL}productos/marcas`,{
            porcentaje:parseFloat(porcentaje.value),
            marca:marcas.value
        })).data;
        if (mensaje.estado) {
            await sweet.fire({
                title:mensaje.mensaje
            }).then(e=>{
                window.close();
            })
        }
    }
});


document.addEventListener('keyup',e=>{
    if(e.key === "Escape"){
        window.close();
    }
});

salir.addEventListener('click',async e=>{
  window.close();
});