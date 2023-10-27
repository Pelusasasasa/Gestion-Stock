const sweet = require('sweetalert2');
const { ipcRenderer } = require('electron/renderer');

const axios = require('axios');
require("dotenv").config();
const URL = process.env.GESTIONURL;

const {cerrarVentana,apretarEnter, redondear, configAxios} = require('../helpers');

const buscar = document.querySelector('#buscar');
const compensada = document.querySelector('.compensada');
const historica = document.querySelector('.historica');
const volver = document.querySelector('.volver');
const borrar = document.querySelector('.borrar');
const tbodyVenta = document.querySelector(".listaVentas tbody");
const tbodyProducto = document.querySelector(".listaProductos tbody");
const tbodyMovRecibo = document.querySelector(".listaMovRecibos tbody");
const actualizar = document.querySelector('.actualizar');
const alerta = document.querySelector('.alerta');
const clienteInput = document.querySelector('#cliente');
const saldo = document.querySelector('#saldo');
const actualizarTodo = document.getElementById('actualizarTodo');

let trSeleccionado = "";
let clienteTraido = {};
let listaCompensada = [];
let listaHistorica = [];
let movimientos

let tipoLista = "compensada";

historica.addEventListener('click',e=>{
    historica.classList.add('none');
    compensada.classList.remove('none');
    tipoLista = "historica";

    listarVentas(listaHistorica);
});

compensada.addEventListener('click',e=>{
    tipoLista = "compensada";
    historica.classList.remove('none');
    compensada.classList.add('none');

    listarVentas(listaCompensada);
});


buscar.addEventListener('keypress',async e=>{
    if (e.key === "Enter") {
        if (buscar.value !== "") {
            clienteTraido = (await axios.get(`${URL}clientes/id/${buscar.value}`)).data;
            saldo.value = (clienteTraido.saldo).toFixed(2);
            clienteInput.value = clienteTraido.nombre;
            if (clienteTraido === "") {
                sweet.fire({title:"Cliente no encontrado"});
                buscar.value = "";
                buscar.focus();
            }else{
                listaCompensada = (await axios.get(`${URL}compensada/traerCompensadas/${clienteTraido._id}`)).data;
                listaHistorica = (await axios.get(`${URL}historica/traerPorCliente/${clienteTraido._id}`)).data;
                if (tipoLista === "compensada") {
                    listarVentas(listaCompensada);
                }else{
                    listarVentas(listaHistorica);
                }
            }
        }else{
            const options = {
                path: './clientes/clientes.html',
                botones:false,
            }
            ipcRenderer.send('abrir-ventana',options)
        }
    }
});


//Recibimos el cliente si lo buscamos por nombre
ipcRenderer.on('recibir',async (e,args)=>{
    const {tipo,informacion} = JSON.parse(args);
    if (tipo === "cliente") {
        listaCompensada = (await axios.get(`${URL}compensada/traerCompensadas/${informacion}`)).data;
        listaHistorica = (await axios.get(`${URL}historica/traerPorCliente/${informacion}`)).data;
        const cliente = (await axios.get(`${URL}clientes/id/${informacion}`)).data;
        saldo.value = cliente.saldo;
        buscar.value = cliente._id;
        clienteInput.value = cliente.nombre;
        
        listarVentas(listaCompensada)
        
    }
})

const listarVentas = async(lista)=>{
    tbodyVenta.innerHTML = "";
    lista.forEach(venta=>{
        const tr = document.createElement('tr');
        tr.id = venta.nro_venta;
        const tdNumero = document.createElement('td');
        const tdFecha = document.createElement('td');
        const tdCliente = document.createElement('td');
        const tdTipo = document.createElement('td');
        const tdImporte = document.createElement('td');
        const tdPagado = document.createElement('td');
        const tdSaldo = document.createElement('td');   

        const date = new Date(venta.fecha);
        let day = date.getDate();
        let month = date.getMonth()+1;
        let year = date.getFullYear();

        day = day < 10 ? `0${day}` : day;
        month = month < 10 ? `0${month}` : month;
        month = month === 13 ? 1 : month;

        tdFecha.innerHTML = `${day}/${month}/${year}`;
        tdNumero.innerHTML = venta.nro_venta;
        tdCliente.innerHTML = venta.cliente;
        tdTipo.innerHTML = venta.tipo_comp ? venta.tipo_comp : "";
        if (venta.tipo_comp === "Nota Credito C") {
            tdImporte.innerHTML = venta.importe ? redondear(venta.importe*-1,2) : redondear(venta.debe*-1,2);
        }else{
            tdImporte.innerHTML = venta.importe ? venta.importe.toFixed(2) : venta.debe.toFixed(2);
        }
        tdPagado.innerHTML = venta.pagado !== undefined ? venta.pagado.toFixed(2) : venta.haber.toFixed(2);

        if (venta.tipo_comp === "Nota Credito C") {
            tdSaldo.innerHTML = redondear(venta.saldo * -1,2) ;
        }else{
            tdSaldo.innerHTML = venta.saldo.toFixed(2); 
        }
        tr.appendChild(tdFecha);
        tr.appendChild(tdNumero);
        tr.appendChild(tdCliente);
        tr.appendChild(tdTipo);
        tr.appendChild(tdImporte);
        tr.appendChild(tdPagado);
        tr.appendChild(tdSaldo);

        tbodyVenta.appendChild(tr)
    })
};


tbodyVenta.addEventListener('click',async e=>{
    if ((e.target.nodeName === "TD")) {
        const id = e.target.parentNode.id;
        trSeleccionado && trSeleccionado.classList.remove('seleccionado')
        trSeleccionado = e.target.parentNode;
        trSeleccionado.classList.add('seleccionado');

        tbodyProducto.innerHTML = "";
        tbodyMovRecibo.innerHTML = "";
        if (trSeleccionado.children[3].innerText === "Recibo") {
            tbodyMovRecibo.parentElement.parentElement.classList.remove('none');
            tbodyProducto.parentElement.parentElement.classList.add('none');
            movimientos = (await axios.get(`${URL}movRecibo/forNumberAndClient/${id}/${clienteTraido._id}`)).data;
            listarMovRecibo(movimientos);
        }else{
            tbodyMovRecibo.parentElement.parentElement.classList.add('none');
            tbodyProducto.parentElement.parentElement.classList.remove('none');
            movimientos = (await axios.get(`${URL}movimiento/${id}/CC`)).data;
            listarProductos(movimientos)
        }
    }
});

//Listamos los productos cuando tocamos un  en una cuenta compensada o historica
const listarProductos = async(movimientos)=>{
    tbodyProducto.innerHTML = "";
    movimientos.forEach(movimiento=>{
        const date = new Date(movimiento.fecha);
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        day = day < 10 ? `0${day}` : day;
        month = month < 10 ? `0${month}` : month;
        month = month === 13 ? 1 : month;

        const tr = document.createElement('tr');
        tr.id = movimiento._id;

        const tdFecha = document.createElement('td');
        const tdCodigo = document.createElement('td');
        const tdProducto = document.createElement('td');
        const tdCantidad = document.createElement('td');
        const tdPrecio = document.createElement('td');
        const tdTotal = document.createElement('td');
        const tdSeries = document.createElement('td');

        tdSeries.classList.add('acciones');
        tdFecha.innerHTML = `${day}/${month}/${year}`;
        tdCodigo.innerHTML = movimiento.codProd;
        tdProducto.innerHTML = movimiento.producto;
        tdCantidad.innerHTML = movimiento.cantidad.toFixed(2);
        tdPrecio.innerHTML = movimiento.precio.toFixed(2);
        tdTotal.innerHTML = (movimiento.precio * movimiento.cantidad).toFixed(2);

        tr.appendChild(tdFecha);
        tr.appendChild(tdCodigo);
        tr.appendChild(tdProducto);
        tr.appendChild(tdCantidad);
        tr.appendChild(tdPrecio);
        tr.appendChild(tdTotal);

        tbodyProducto.appendChild(tr);
    })
};

const listarMovRecibo = async(lista) => {
    for await(let elem of lista){
        console.log(elem)
        const tr = document.createElement('tr');

        const tdFecha = document.createElement('td');
        const tdTipo = document.createElement('td');
        const tdNumero = document.createElement('td');
        const tdImporte = document.createElement('td');
        const tdPagado = document.createElement('td');
        const tdSaldo = document.createElement('td');

        tdFecha.innerText = elem.fecha.slice(0,10).split('-',3).reverse().join('/');
        tdTipo.innerText = elem.tipo;
        tdNumero.innerText = elem.nro_comp;
        tdImporte.innerText = elem.importe.toFixed(2);
        tdPagado.innerText = elem.pagado.toFixed(2);
        tdSaldo.innerText = elem.saldo.toFixed(2);

        tr.appendChild(tdFecha);
        tr.appendChild(tdTipo);
        tr.appendChild(tdNumero);
        tr.appendChild(tdImporte);
        tr.appendChild(tdPagado);
        tr.appendChild(tdSaldo);

        tbodyMovRecibo.appendChild(tr);
    }
};

//cuando tocamos actualizar una venta, actualizamos con los precios de hoy en dia
actualizar.addEventListener('click',async e=>{
    if(trSeleccionado){
        //traemos las compensa que seleccionamos
        const cuentaCompensada = (await axios.get(`${URL}compensada/traerCompensada/id/${trSeleccionado.id}`)).data;
        //Traemos la historica que seleccionamos
        const cuentaHistorica = (await axios.get(`${URL}historica/PorId/id/${trSeleccionado.id}`)).data;
        //traemos los movimientos de productos de esa cuenta compensada
        const movimientos = (await axios.get(`${URL}movimiento/${trSeleccionado.id}/CC`)).data;
        //Traemos la venta de lo seleccionado
        const venta = (await axios.get(`${URL}ventas/numeroYtipo/${trSeleccionado.id}/CC`)).data;
        //Traemos el cliente
        const  cliente = (await axios.get(`${URL}clientes/id/${cuentaCompensada.idCliente}`)).data;

        let total = 0;
        for await(let movimiento of movimientos){
            const precio = (await axios.get(`${URL}productos/traerPrecio/${movimiento.codProd}`)).data;
            movimiento.precio = precio !== "" ? precio : movimiento.precio;
            total += (movimiento.precio*movimiento.cantidad);
        };
        
        sweet.fire({
            title:"Grabar Importe?",
            "showCancelButton":true,
            "confirmButtonText":"Aceptar"
        }).then(async (result)=>{
            if (result.isConfirmed){ //si decimos aceptar actualizamos la venta
            total = parseFloat(total.toFixed(2));
            let cuentasHistoricasRestantes = (await axios.get(`${URL}historica/traerPorCliente/${cuentaHistorica.idCliente}`)).data;
            cuentasHistoricasRestantes = cuentasHistoricasRestantes.filter(cuenta=>(cuenta.nro_venta>cuentaHistorica.nro_venta && cuenta.fecha >= cuentaHistorica.fecha));
            //modificamos el saldo del cliente
            cliente.saldo -= parseFloat(cuentaCompensada.importe.toFixed(2));
            //modificamos el nuevo importe de la compensada
            cuentaCompensada.importe = total;
            cuentaCompensada.saldo = parseFloat((total - cuentaCompensada.pagado).toFixed(2));
            //Modificamos el saldo y debe de la cuenta historica
            cuentaHistorica.saldo = parseFloat((cuentaHistorica.saldo - cuentaHistorica.debe+total).toFixed(2));
            cuentaHistorica.debe = parseFloat(total.toFixed(2));
            //Le ponemos al cliente el saldo del importe nuevo
            cliente.saldo = (cliente.saldo + cuentaCompensada.importe).toFixed(2);
            //esto sirve para poner en las nuevas cuentas historicas el saldo
            let saldoAnterior = cuentaHistorica.saldo;

            for await(let cuenta of cuentasHistoricasRestantes){
                cuenta.saldo = cuenta.tipo_comp === "Recibo" ? parseFloat((saldoAnterior - cuenta.haber).toFixed(2)) : parseFloat((saldoAnterior + cuenta.debe).toFixed(2));
                saldoAnterior = cuenta.saldo;
                await axios.put(`${URL}historica/PorId/id/${cuenta._id}`,cuenta);
            };
            
            await axios.put(`${URL}movimiento`,movimientos);
            await axios.put(`${URL}clientes/id/${cliente._id}`,cliente);
            await axios.put(`${URL}ventas/id/${venta.numero}/CC`,venta);
            await axios.put(`${URL}compensada/traerCompensada/id/${cuentaCompensada.nro_venta}`,cuentaCompensada);
            await axios.put(`${URL}historica/PorId/id/${cuentaHistorica._id}`,cuentaHistorica);
            const cuentaModificada = (await axios.get(`${URL}compensada/traerCompensada/id/${trSeleccionado.id}`)).data;
            listarProductos(movimientos)
            trSeleccionado.children[4].innerHTML = cuentaModificada.importe;
            trSeleccionado.children[6].innerHTML = cuentaModificada.saldo;
            saldo.value = cliente.saldo;
        }
        })
    }
});

volver.addEventListener('click',e=>{
    location.href = "../menu.html";
});


borrar.addEventListener('click', async e=>{
    if (trSeleccionado) {
        await sweet.fire({
            title:"Segura que quiere borrar",
            showCancelButton:true,
            confirmButtonText:"Aceptar"
        }).then(async ({isConfirmed})=>{
            if (isConfirmed) {
                const saldoAModificar = parseFloat(trSeleccionado.children[6].innerHTML);
                clienteTraido.saldo =  (clienteTraido.saldo - saldoAModificar).toFixed(2);
                await axios.put(`${URL}clientes/id/${clienteTraido._id}`,clienteTraido);
                await axios.delete(`${URL}compensada/traerCompensada/id/${trSeleccionado.id}`);
                trSeleccionado.remove();
                saldo.value = clienteTraido.saldo;

            }
        })
    }else{
        await sweet.fire({
            title:"Ninguna venta seleccionado"
        })
    }
});

actualizarTodo.addEventListener('click',actualizarTodosLosTrs);

async function actualizarTodosLosTrs(e) {
    const trs = document.querySelectorAll('.listaVentas tbody tr');
    alerta.classList.remove('none');
    for await (let cuenta of listaCompensada){
        if(cuenta.tipo_comp === "Comprobante"){
            await actualizarCuenta(cuenta,cuenta.importe); 
        }
    };
    alerta.classList.add('none');

    compensada.classList.add('none');
    historica.classList.remove('none');
    tipoLista = "compensada";
    listarVentas(listaCompensada);
};

async function actualizarCuenta(cuenta,importeViejo) {
     //Traemos la historica que seleccionamos
     const cuentaHistorica = (await axios.get(`${URL}historica/PorId/id/${cuenta.nro_venta}`)).data;
     //traemos los movimientos de productos de esa cuenta compensada
     const movimientos = (await axios.get(`${URL}movimiento/${cuenta.nro_venta}/CC`)).data;
     //Traemos la venta de lo seleccionado
     const venta = (await axios.get(`${URL}ventas/numeroYtipo/${cuenta.nro_venta}/CC`)).data;
     //Traemos el cliente
     const  cliente = (await axios.get(`${URL}clientes/id/${cuenta.idCliente}`)).data;
    let total = 0;

    for await (let mov of movimientos){
        const precio = (await axios.get(`${URL}productos/traerPrecio/${mov.codProd}`)).data;
        mov.precio = precio ? precio : mov.precio;
        total += mov.precio * mov.cantidad;
    }
    cuenta.importe = parseFloat(total.toFixed(2));
    cuenta.saldo = parseFloat(redondear(total - cuenta.pagado,2));
    
    venta.precio = total; //Cambiamos el precio de venta

    //Modificamos el saldo y debe de la cuenta historica
    cuentaHistorica.saldo = parseFloat((cuentaHistorica.saldo - cuentaHistorica.debe+total).toFixed(2));
    cuentaHistorica.debe = parseFloat(total.toFixed(2));


    let cuentasHistoricasRestantes = (await axios.get(`${URL}historica/traerPorCliente/${cuentaHistorica.idCliente}`)).data;
    cuentasHistoricasRestantes.sort((a,b)=>{
        if (a.fecha>b.fecha) {
            return 1
        }else if(a.fecha<b.fecha){
            return -1
        };
        return 0
    })
    cuentasHistoricasRestantes = cuentasHistoricasRestantes.filter(cuenta=>(cuenta.fecha > cuentaHistorica.fecha));
    cliente.saldo = redondear(cliente.saldo + total - importeViejo,2)//Nuvo saldo del cliente
    saldo.value = cliente.saldo;

    await axios.put(`${URL}movimiento`,movimientos);
    await axios.put(`${URL}clientes/id/${cliente._id}`,cliente);
    await axios.put(`${URL}ventas/id/${venta.numero}/CC`,venta);
    await axios.put(`${URL}compensada/traerCompensada/id/${cuenta.nro_venta}`,cuenta);
    await axios.put(`${URL}historica/PorId/id/${cuentaHistorica._id}`,cuentaHistorica,configAxios);

    let saldoAnterior = cuentaHistorica.saldo;
    let aux = -1;
    for await(let elem of cuentasHistoricasRestantes){
        if (!(aux === elem.nro_venta)) {
            elem.saldo = elem.tipo_comp === "Comprobante" ? parseFloat(redondear(elem.debe + saldoAnterior,2)) : parseFloat(redondear(saldoAnterior - elem.haber,2));
            saldoAnterior = elem.saldo;
            await axios.put(`${URL}historica/PorId/id/${elem._id}`,elem,configAxios);
        }
        aux = elem.nro_venta;
    }
};