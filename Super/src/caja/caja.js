const axios  = require("axios");
require("dotenv").config();
const URL = process.env.URL;

const { cerrarVentana, redondear } = require("../helpers");
const sweet = require('sweetalert2');

let seleccion;
let subSeleccionado;

const tarjeta = document.querySelector('.tarjeta');
const contado = document.querySelector('.contado');

const botonDia = document.querySelector('.botonDia');
const botonMes = document.querySelector('.botonMes');
const botonAnio = document.querySelector('.botonAnio');

const dia = document.querySelector('.dia');
const mes = document.querySelector('.mes');
const anio = document.querySelector('.anio');

let seleccionado = document.querySelector('.seleccionado');

const fecha = document.querySelector('#fecha');
const selectMes = document.querySelector('#mes');
const inputAnio = document.querySelector('#anio');

const tbody = document.querySelector('.tbodyListado');
const tbodyGastos = document.querySelector('.tbodyGastos');
const volver = document.querySelector('.volver');
const borrar = document.querySelector('.borrar');
const total = document.querySelector('#total');

const pestaña = document.querySelector('.pestaña')

let ventas = [];
let recibos = [];
let gastos = [];
let tipoVenta = "CD";
let filtro = "Ingresos";
const fechaHoy = new Date();
let d = fechaHoy.getDate();
let m = fechaHoy.getMonth() + 1;
let a = fechaHoy.getFullYear();

m = m<10 ? `0${m}`: m;
d = d<10 ? `0${d}`: d;

pestaña.addEventListener('click',async e=>{
    if (e.target.parentNode.nodeName === "MAIN") {
        document.querySelector('.pestañaSeleccionada') && document.querySelector('.pestañaSeleccionada').classList.remove('pestañaSeleccionada');
        e.target.parentNode.classList.add('pestañaSeleccionada');
        filtro = e.target.innerHTML;

        if (filtro === "Gastos") {
            document.querySelector('.gastos').classList.remove('none');
            document.querySelector('.listado').classList.add('none');
            //Esconder botones
            tarjeta.classList.add('none');
            contado.classList.add('none');
            let retornar = await verQueTraer();
        
            listarGastos(retornar);
        }else{
            document.querySelector('.listado').classList.remove('none');
            document.querySelector('.gastos').classList.add('none');
            //Mostrar botones
            tarjeta.classList.remove('none');
            contado.classList.remove('none');
            let retornar = await verQueTraer();
            listarVentas(retornar)
        }
    }
});

const verQueTraer = async()=>{
    if (seleccionado.classList.contains("botonDia")) {
        if (filtro === "Ingresos") {
            ventas = (await axios.get(`${URL}ventas/dia/${fecha.value}`)).data;
            recibos = (await axios.get(`${URL}recibo/dia/${fecha.value}`)).data;
            return([...ventas,...recibos])
        }else{
            return ((await axios.get(`${URL}gastos/dia/${fecha.value}`)).data);
        }
    }else if(seleccionado.classList.contains("mes")){
        if (filtro === "Ingresos") {
            ventas = (await axios.get(`${URL}ventas/mes/${selectMes.value}`)).data;
            recibos = (await axios.get(`${URL}recibo/mes/${selectMes.value}`)).data;
            return([...ventas,...recibos])
        }else{
            return ((await axios.get(`${URL}gastos/mes/${selectMes.value}`)).data);
        }
    }else{
        if (filtro === "Ingresos") {
            ventas = (await axios.get(`${URL}ventas/anio/${inputAnio.value}`)).data;
            recibos = (await axios.get(`${URL}recibo/anio/${inputAnio.value}`)).data;
            return([...ventas,...recibos])
        }else{
            return ((await axios.get(`${URL}gastos/anio/${inputAnio.value}`)).data)
        }
    }
};

//Cuando se hace click en el boton tarjeta, lo que hacemos es mostrar las ventas con tarjetas
tarjeta.addEventListener('click',e=>{
    if(!tarjeta.classList.contains('buttonSeleccionado')){
        contado.classList.remove('buttonSeleccionado');
        tarjeta.classList.add('buttonSeleccionado');
        tipoVenta = "T";
        listarVentas(ventas)
    };
});

//Cuando hacemos click en contado mostramos las ventas en contado
contado.addEventListener('click',e=>{
    if(!contado.classList.contains('buttonSeleccionado')){
        tarjeta.classList.remove('buttonSeleccionado');
        contado.classList.add('buttonSeleccionado');
        tipoVenta = "CD";
        listarVentas(ventas)
    };
});

//muestra las ventas del mes cuando tocamos en el boton
botonMes.addEventListener('click',async e=>{
    seleccionado.classList.remove('seleccionado');
    seleccionado = botonMes;
    seleccionado.classList.add('seleccionado');

    mes.classList.remove('none');
    dia.classList.add('none');
    anio.classList.add('none');


    //vemos que tipo de filtro es y ahi vemos si traemos los ingresos o gastos
    if (filtro === "Ingresos") {
        ventas = (await axios.get(`${URL}ventas/mes/${selectMes.value}`)).data;
        recibos = (await axios.get(`${URL}recibo/mes/${selectMes.value}`)).data;
        listarVentas([...ventas,...recibos]);
    }else{
        gastos = (await axios.get(`${URL}gastos/mes/${selectMes.value}`)).data;
        listarGastos(gastos);
    }
});

//muestra las ventas del dia cuando tocamos en el boton
botonDia.addEventListener('click',async e=>{
    seleccionado.classList.remove('seleccionado');
    seleccionado = botonDia;
    dia.classList.remove('none');
    mes.classList.add('none');
    anio.classList.add('none');
    seleccionado.classList.add('seleccionado');
    if (filtro === "Ingresos") {
        ventas = (await axios.get(`${URL}ventas/dia/${fecha.value}`)).data;
        recibos = (await axios.get(`${URL}recibo/dia/${fecha.value}`)).data;
        listarVentas([...ventas,...recibos]);
    }else{
        gastos = (await axios.get(`${URL}gastos/dia/${fecha.value}`)).data;
        listarGastos(gastos);
    }
});

//muestra las ventas del año cuando tocamos en el boton
botonAnio.addEventListener('click',async e=>{
    seleccionado.classList.remove('seleccionado');
    seleccionado = botonAnio;
    anio.classList.remove('none');
    dia.classList.add('none');
    mes.classList.add('none');
    seleccionado.classList.add('seleccionado');
    if (filtro === "Ingresos") {
        ventas = (await axios.get(`${URL}ventas/anio/${inputAnio.value}`)).data;
        recibos = (await axios.get(`${URL}recibo/anio/${inputAnio.value}`)).data
        listarVentas([...ventas,...recibos]);
    }else{
        gastos = (await axios.get(`${URL}gastos/anio/${inputAnio.value}`)).data;
        listarGastos(gastos);
    }
});

window.addEventListener('load',async e=>{
    fecha.value = `${a}-${m}-${d}`;
    selectMes.value = m;
    inputAnio.value = a;
    ventas = (await axios.get(`${URL}ventas/dia/${fecha.value}`)).data;
    recibos = (await axios.get(`${URL}recibo/dia/${fecha.value}`)).data;
    ventas = [...ventas,...recibos];
    gastos = (await axios.get(`${URL}gastos/dia/${fecha.value}`)).data;
    listarVentas(ventas);
});

fecha.addEventListener('keypress',async e=>{
    if ((e.key === "Enter")) {
        if (filtro === "Ingresos") {
            ventas = (await axios.get(`${URL}ventas/dia/${fecha.value}`)).data;
            recibos = (await axios.get(`${URL}recibo/dia/${fecha.value}`)).data;
            listarVentas([...ventas,...recibos]);
        }else{
            gastos = (await axios.get(`${URL}gastos/dia/${fecha.value}`)).data;
            listarGastos(gastos);
        }
    }
});

selectMes.addEventListener('click',async e=>{
    if (filtro === "Ingresos") {
        ventas = (await axios.get(`${URL}ventas/mes/${selectMes.value}`)).data;
        recibos = (await axios.get(`${URL}recibo/mes/${selectMes.value}`)).data;
        listarVentas([...ventas,...recibos]);
    }else{
        gastos = (await axios.get(`${URL}gastos/mes/${selectMes.value}`)).data;
        listarGastos(gastos)
    }
});

inputAnio.addEventListener('keypress',async e=>{
    if (e.key === "Enter") {
        if (filtro === "Ingresos") {
            ventas = (await axios.get(`${URL}ventas/anio/${inputAnio.value}`)).data;
            recibos = (await axios.get(`${URL}recibo/anio/${inputAnio.value}`)).data;
            listarVentas([...ventas,...recibos]);
        }else{
            gastos = (await axios.get(`${URL}gastos/anio/${inputAnio.value}`)).data;
            listarGastos(gastos)
        }
    }
});

tbody.addEventListener('click',async e=>{
    const id = e.target.nodeName === "TD" ? e.target.parentNode.id : e.target.id;
    
    seleccion && seleccion.classList.remove('seleccionado');
    seleccion = document.getElementById(id);
    seleccion.classList.add('seleccionado');
    const trs = document.querySelectorAll("tbody .venta" + id)

    for await(let tr of trs){
        tr.classList.toggle('none');
    }
});

borrar.addEventListener('click',async e=>{
    let title = filtro === "Ingresos" ? "Venta" : "Gasto";
    

    await sweet.fire({
        title:`Borrar ${title}?`,
        confirmButtonText:"Aceptar",
        showCancelButton:true
    }).then(async({isConfirmed})=>{
        if (!seleccion.children[4]) {
            try {
                await axios.delete(`${URL}gastos/id/${seleccion.id}`);
                location.reload();
            } catch (error) {
                
            }
        }else if (isConfirmed && seleccion.children[4].innerHTML !== "Recibo") {
           try {
                await axios.delete(`${URL}ventas/id/${seleccion.id}/${seleccion.children[3].innerHTML}`);
                location.reload();
           } catch (error) {
            console.log(error)
            sweet.fire({title:"No se puedo eliminar " + title})
           }
        }else if(isConfirmed && seleccion.children[4].innerHTML === "Recibo"){
            await sweet.fire({
                title:"No se puede borrar un recibo"
            })
        }
    });
});

tbodyGastos.addEventListener('click',e=>{
    seleccion && seleccion.classList.remove('seleccionado')
    seleccion = e.target.nodeName === "TD" ? e.target.parentNode : e.target
    seleccion.classList.add('seleccionado')
});

const listarVentas = async (ventas)=>{
    tbody.innerHTML = ``;
    let lista = [];
    //organizamos las ventas por fecha
    ventas.sort((a,b)=>{
        if (a.fecha>b.fecha) {
            return 1;
        }else if(b.fecha>a.fecha){
            return -1;
        }
        return 0;
    });

    //filtramos las ventas si son contadas o tarjeta
    if (tipoVenta === "CD") {
        lista = ventas.filter(venta=>(venta.tipo_venta === "CD"));
    }else{
        lista = ventas.filter(venta=>venta.tipo_venta === "T");
    }

    let totalVenta = 0;


    for await(let venta of lista){
        const fecha = new Date(venta.fecha);
        const hora = fecha.getHours();
        const minutos = fecha.getMinutes();
        let segundos = fecha.getSeconds(); 
        segundos=segundos<10 ? `0${segundos}` : segundos;

        const tr = document.createElement('tr');
        tr.id = venta._id;
        tr.classList.add('bold')

        const tdNumero =  document.createElement('td');
        const tdFecha =  document.createElement('td');
        const tdCliente =  document.createElement('td');
        const tdCodProducto =  document.createElement('td');
        const tdProducto =  document.createElement('td');
        const tdCantidad =  document.createElement('td');
        const tdPrecio =  document.createElement('td');
        const tdPrecioTotal =  document.createElement('td');

        tdNumero.innerHTML = venta.numero;
        tdFecha.innerHTML = `${hora}:${minutos}:${segundos}`;
        tdCliente.innerHTML = venta.cliente;
        tdCodProducto.innerHTML = venta.tipo_comp;
        tdProducto.innerHTML = "";
        tdPrecioTotal.innerHTML = venta.tipo_comp === "Nota Credito C" ? redondear(venta.precio * -1,2) : venta.precio.toFixed(2);

        tr.appendChild(tdNumero);
        tr.appendChild(tdFecha);
        tr.appendChild(tdCliente);
        tr.appendChild(tdCodProducto);
        tr.appendChild(tdProducto);
        tr.appendChild(tdCantidad);
        tr.appendChild(tdPrecio);
        tr.appendChild(tdPrecioTotal);
        tbody.appendChild(tr);

        //aca listamos los productos de cada venta
        if (venta.listaProductos) {
           for await(let {cantidad,producto} of  venta.listaProductos){
                if (producto.length !== 0) {
                    const trProducto = document.createElement('tr');
                    trProducto.classList.add('none');
                    trProducto.classList.add(`venta${venta._id}`);

                    const tdNumeroProducto = document.createElement('td');
                    const tdFechaProducto = document.createElement('td');
                    const tdClienteProducto = document.createElement('td');
                    const tdIdProducto = document.createElement('td');
                    const tdDescripcion = document.createElement('td');
                    const tdCantidad = document.createElement('td');
                    const tdPrecioProducto = document.createElement('td');
                    const tdTotalProducto = document.createElement('td');

                    tdNumeroProducto.innerHTML = venta.numero;
                    tdFechaProducto.innerHTML = tdFecha.innerHTML;
                    tdClienteProducto.innerHTML = venta.cliente;
                    tdIdProducto.innerHTML = producto._id === undefined ? " " : producto._id;
                    tdDescripcion.innerHTML = producto.descripcion;
                    tdCantidad.innerHTML = cantidad.toFixed(2);
                    tdPrecioProducto.innerHTML = producto.precio.toFixed(2);
                    tdTotalProducto.innerHTML = (cantidad*producto.precio).toFixed(2);

                    trProducto.appendChild(tdNumeroProducto);
                    trProducto.appendChild(tdFechaProducto);
                    trProducto.appendChild(tdClienteProducto);
                    trProducto.appendChild(tdIdProducto);
                    trProducto.appendChild(tdDescripcion);
                    trProducto.appendChild(tdCantidad);
                    trProducto.appendChild(tdPrecioProducto);
                    trProducto.appendChild(tdTotalProducto);

                    tbody.appendChild(trProducto);
            };
            };
        }
        

        totalVenta += venta.tipo_comp === "Nota Credito C" ? venta.precio * -1 : venta.precio;
    };
    total.value = totalVenta.toFixed(2);
}

const listarGastos = (gastos)=>{
    tbodyGastos.innerHTML = "";
    let totalVenta = 0;
    for(let gasto of gastos){
        const fecha = gasto.fecha.slice(0,10).split('-',3);
        const tr = `
        <tr id=${gasto._id}>
            <td>${fecha[2]}/${fecha[1]}/${fecha[0]}</td>
            <td>${gasto.descripcion}</td>
            <td>${redondear(gasto.importe * -1,2)}</td>
        </tr>
    `
    tbodyGastos.innerHTML += tr;
    totalVenta -= gasto.importe;
    }
    total.value = redondear(totalVenta,2);
};

volver.addEventListener('click',e=>{
    location.href = "../menu.html";
});

document.addEventListener('keyup',e=>{
    if (e.key === "Escape" && !document.activeElement.classList.contains('swal2-confirm')) {
        location.href = '../menu.html';
    }
});
