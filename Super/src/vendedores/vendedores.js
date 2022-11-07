const axios = require('axios');
require("dotenv").config();
const URL = process.env.URL;
const sweet = require('sweetalert2');

const {cerrarVentana} = require('../helpers')

const tbody = document.querySelector('tbody');

//botones
const agregar = document.querySelector('.agregar');
const modificar = document.querySelector('.modificar');
const eliminar = document.querySelector('.eliminar');

let seleccionado

window.addEventListener('load',async e=>{
    let vendedores = (await axios.get(`${URL}vendedores`)).data
    console.log(vendedores)
    listarVendedores(vendedores)
});


const listarVendedores = (lista)=>{
    tbody.innerHTML = "";
    for(let vendedor of lista){
        const tr = document.createElement('tr');
        tr.id = vendedor._id;

        const tdCodigo = document.createElement('td');
        const tdNombre = document.createElement('td');
        const tdPermiso = document.createElement('td');


        tdCodigo.innerHTML = vendedor.codigo;
        tdNombre.innerHTML = vendedor.nombre;
        tdPermiso.innerHTML = vendedor.permiso;

        tr.appendChild(tdCodigo);
        tr.appendChild(tdNombre);
        tr.appendChild(tdPermiso);

        tbody.appendChild(tr)
    }
};

agregar.addEventListener('click',e=>{
    sweet.fire({
        html:
            `<section>
                <main>
                    <label htmlFor="nombre">Nombre</label>
                    <input type="text" name="nombre" id="nombre" />
                </main>
                <main>
                    <label htmlFor="codigo">Codigo</label>
                    <input type="text" name="codigo" id="codigo" />
                </main>
                <main>
                    <label htmlFor="permisos">Permisos</label>
                    <input type="number" name="permisos" id="permisos" />
                </main>
            </section>`,
            confirmButtonText: "Aceptar",
            showCancelButton:true
    }).then(async({isConfirmed})=>{
        if (isConfirmed) {
            const vendedorNuevo = {};
            vendedorNuevo.nombre = document.getElementById('nombre').value.toUpperCase();
            vendedorNuevo.codigo = document.getElementById('codigo').value;
            vendedorNuevo.permiso = document.getElementById('permisos').value;
            try {
                await axios.post(`${URL}vendedores`,vendedorNuevo);
                listarVendedores(vendedor);
            } catch (error) {
                console.log(error);
                await sweet.fire({
                    title:"No se pudo agregar Vendedor"
                })
            }
            
        }
    })
});

tbody.addEventListener('click',e=>{
    seleccionado && seleccionado.classList.remove('seleccionado')
    seleccionado = e.target.nodeName === "TD" ? e.target.parentNode : e.target;
    seleccionado.classList.add('seleccionado');
});

modificar.addEventListener('click',e=>{
    if (seleccionado) {
        sweet.fire({
            title:"Modificar Vendedor",
            html:`
                <section>
                    <main>
                        <label htmlFor="nombre">Nombre</label>
                        <input type="text" name="nombre" value=${seleccionado.children[1].innerHTML} id="nombre" />
                    </main>
                    <main>
                        <label htmlFor="codigo">Codigo</label>
                        <input type="text" name="codigo" value=${seleccionado.children[0].innerHTML} id="codigo" />
                    </main>
                    <main>
                        <label htmlFor="permisos">Permisos</label>
                        <input type="number" name="permisos" value=${seleccionado.children[2].innerHTML} id="permisos" />
                    </main>
                </section>
            `,
            showCancelButton:true,
            confirmButtonText:"Modificar"
        }).then(async({isConfirmed})=>{
            if (isConfirmed) {
                const vendedorNuevo = {}
                vendedorNuevo.nombre = document.getElementById('nombre').value.toUpperCase();
                vendedorNuevo.codigo = document.getElementById('codigo').value;
                vendedorNuevo.permiso = document.getElementById('permisos').value;

                try {
                    await axios.put(`${URL}vendores/id/${seleccionado.id}`,vendedorNuevo);
                } catch (error) {
                    console.log(error)
                    sweet.fire({
                        title: "No se pudo modficar el vendedor"
                    })
                }
            }
        })
    }
});

eliminar.addEventListener('click',async e=>{
    if (seleccionado) {
        try {
            await axios.delete(`${URL}vendedores/id/${seleccionado.id}`);
        } catch (error) {
            console.log(error);
            await sweet.fire({
                title:"No se pudo eliminar el vendedor"
            })
        }
    }
});

document.addEventListener('keyup',e=>{
    cerrarVentana(e)
})