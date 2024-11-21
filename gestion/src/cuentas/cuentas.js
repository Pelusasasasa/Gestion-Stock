
const axios = require('axios');
require('dotenv').config();
const URL = process.env.GESTIONURL;

const cuentas = document.getElementById('cuentas');
const agregar = document.getElementById('agregar');
const borrar = document.getElementById('borrar');

const prev = document.getElementById('prev');
const next = document.getElementById('next');

let arreglo = [];


window.addEventListener('load', async() => {

    arreglo = (await axios.get(`${URL}cuenta`)).data;
    ponerPrimerCuenta(arreglo);

});

prev.addEventListener('click', () => {
    antCuenta();
});

next.addEventListener('click', () => {
    sigCuenta();
});

agregar.addEventListener('click', async() => {
    const sweet = require('sweetalert2');

    const {isConfirmed} = await sweet.fire({
        title: 'Nueva Cuenta',
        confirmButtonText: 'Crear Cuenta',
        showCancelButton: true,
        html: `
            <section class="agregarCuenta">
                <div>
                    <label htmlFor="cuenta">Cuenta</label>
                    <input type="text" id="cuenta" name="cuenta" />
                </div>
                <div>
                    <label htmlFor="codigo">Codigo</label>
                    <input type="text" id="codigo" name="codigo" />
                </div>
                <div>
                    <label htmlFor="tipo">Tipo</label>
                    <select name="tipo" id="tipo">
                        <option value="E">Egreso</option>
                        <option value="I">Ingreso</option>
                    </select>
                </div>
            </section>
        `
    });

    if (isConfirmed) {
        const cuenta = {};

        cuenta.cuenta = document.getElementById('cuenta').value.toUpperCase().trim();
        cuenta.idCuenta = document.getElementById('codigo').value.toUpperCase().trim();
        cuenta.tipo = document.getElementById('tipo').value.toUpperCase();

        await axios.post(`${URL}cuenta`,cuenta);

        arreglo.push(cuenta);
    };

});

borrar.addEventListener('click', async() => {
    const sweet = require('sweetalert2');
    
    const {isConfirmed} = await sweet.fire({
        title:"Seguro quiere eliminar la cuenta ",
        confirmButtonText: 'Aceptar',
        showCancelButton: true
    });

    if (isConfirmed) {
        await axios.delete(`${URL}cuenta/idCuenta/${cuentas.id}`);
        const aux = arreglo.findIndex( elem => elem.idCuenta === cuentas.id);
        arreglo = arreglo.filter(elem => elem.idCuenta !== cuentas.id);
        if (arreglo[ aux + 1]) {
            sigCuenta();   
        }else{
            antCuenta();
        }
    }

});

const ponerPrimerCuenta = (lista) => {
    cuentas.value = lista[0].cuenta + ' - ' + lista[0].idCuenta;
    cuentas.id = lista[0].idCuenta;
};

const sigCuenta = () => {
    const aux = cuentas.value.split('-', 2)[0].trim();
    const i = arreglo.findIndex( elem => elem.cuenta === aux);
    cuentas.value = arreglo[i + 1] ? arreglo[i + 1].cuenta + ' - ' + arreglo[i + 1].idCuenta : aux;
    cuentas.id = arreglo[i + 1] ? arreglo[i + 1].idCuenta : cuentas.id;
};

const antCuenta = () => {
    const aux = cuentas.value.split('-', 2)[0].trim();
    const i = arreglo.findIndex( elem => elem.cuenta === aux);
    cuentas.value = arreglo[i - 1] ? arreglo[i - 1].cuenta + ' - ' + arreglo[i - 1].idCuenta : cuentas.value;
    cuentas.id = arreglo[i - 1] ? arreglo[i - 1].idCuenta : cuentas.id;
};