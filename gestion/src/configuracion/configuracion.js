const archivo = require('../configuracion.json');
const fs = require('fs');
const { cerrarVentana } = require('../helpers');
const path = require('path');

const caja = document.getElementById('caja');
const multiple = document.querySelectorAll("input[name=multipleVendedores]");
const multipleStockNegativos = document.querySelectorAll("input[name=stockNegativo]");


const si = document.getElementById('si');
const no = document.getElementById('no');

const siStockNegativo = document.getElementById('siStockNegativo');
const noStockNegativo = document.getElementById('noStockNegativo');
const puntoVenta = document.getElementById('puntoVenta');
const cuit = document.getElementById('cuit');

const modificar = document.querySelector('.modificar');


window.addEventListener('load',e=>{
    caja.value = archivo.caja;  
    archivo.vendedores === false ? no.checked = true : si.checked = true;
    archivo.stockNegativo === false ? noStockNegativo.checked = true : siStockNegativo.checked = true;
    cuit.value = archivo.cuit;
    puntoVenta.value = archivo.puntoVenta;

});


modificar.addEventListener('click',async e=>{
    const objeto = {};
    objeto.caja = caja.value;
    objeto.vendedores = await verMultiplesUsuarios(multiple);
    objeto.stockNegativo = await verMultiplesUsuarios(multipleStockNegativos);
    objeto.puntoVenta = puntoVenta.value;
    objeto.cuit = cuit.value;
    
    fs.writeFile(path.join(__dirname, '../configuracion.json'),JSON.stringify(objeto),(error)=>{
        if(error) throw error;
        console.log("Informacion Recibida");
    })
})


const verMultiplesUsuarios = (lista)=>{
    for(let elem of lista){
        if (elem.checked && elem.value === "true") {
            return true
        }
        return false
    }
};


document.addEventListener('keyup',e=>{
    cerrarVentana(e)
});

