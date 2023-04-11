function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

let vendedor = getParameterByName('vendedor');

const axios = require('axios');
require("dotenv").config();
const URL = process.env.GESTIONURL;
const sweet = require('sweetalert2');

const { ipcRenderer } = require('electron');
const {apretarEnter,redondear,cargarFactura, ponerNumero, verCodigoComprobante, verTipoComprobante, verSiHayInternet} = require('../helpers');
const archivo = require('../configuracion.json');

//Parte Cliente
const codigo = document.querySelector('#codigo');
const nombre = document.querySelector('#nombre');
const telefono = document.querySelector('#telefono');
const localidad = document.querySelector('#localidad');
const direccion = document.querySelector('#direccion');
const cuit = document.querySelector('#cuit');
const condicionIva = document.querySelector('#condicion');
const lista = document.querySelector('#lista');


//Parte Producto
const cantidad = document.querySelector('#cantidad');
const codBarra = document.querySelector('#cod-barra')
const precioU = document.querySelector('#precio-U');
const iva = document.querySelector('#iva');
const tbody = document.querySelector('.tbody');

//parte totales
const total = document.querySelector('#total');
const inputRecibo = document.querySelector('#recibo');
const porcentaje = document.querySelector('#porcentaje');
const radio = document.querySelectorAll('input[name="condicion"]');
const cuentaCorrientediv = document.querySelector('.cuentaCorriente');

//botones
const facturar = document.querySelector('.facturar');
const volver = document.querySelector('.volver');
const impresion = document.querySelector("#impresion");
const checkboxDolar = document.querySelector("#dolar");

//alerta
const alerta = document.querySelector('.alerta');

//body
const body = document.querySelector('body');


let tipoFactura = getParameterByName("tipoFactura");
let facturaAnterior;

let movimientos = [];
let descuentoStock = [];
let totalGlobal = 0;
let idProducto = 0;
let situacion = "blanco";
let porcentajeH = 0;
let descuento = 0;
let dolar = 0;
let listaProductos = [];

//Por defecto ponemos el A Consumidor Final y tambien el select
window.addEventListener('load',async e=>{

    dolar = (await axios.get(`${URL}numero/Dolar`)).data;

    if (tipoFactura === "notaCredito") {

        await sweet.fire({
            title:"Numero de Factura Anterior",
            input:"text",
            confirmButtonText:"Aceptar",
            showCancelButton:true
        }).then(({isConfirmed,value})=>{
            console.log(isConfirmed)
            if (isConfirmed) {
                facturaAnterior = value.padStart(8,'0');
            }else{
                location.href = '../menu.html';
            }
        });
    }
    
    listarCliente(1);//listanos los clientes
    
    cambiarSituacion(situacion);//
});

document.addEventListener('keydown',e=>{
    if (e.keyCode === 18) {
        document.addEventListener('keydown',event=>{
            if (event.keyCode === 120) {
                body.classList.toggle('negro');
                situacion = situacion === "negro" ? "blanco" : "negro";
                cambiarSituacion(situacion);
            }
        },{once:true})
    }else if(e.keyCode === 113){
        const opciones = {
            path:"clientes/agregarCliente.html",
            ancho: 900,
            altura: 600
        }
        ipcRenderer.send('abrir-ventana',opciones);
    }else if(e.keyCode === 114){
        const opciones = {
            path:"productos/agregarProducto.html",
            ancho:900,
            altura:650
        };
        ipcRenderer.send('abrir-ventana',opciones);
    }else if(e.keyCode === 115){
        const opciones = {
            path: "productos/cambio.html",
            ancho:1000,
            altura:550,
        }
        ipcRenderer.send('abrir-ventana',opciones); 
    }else if(e.keyCode === 116){
        const opciones = {
            path:"gastos/gastos.html",
            ancho:500,
            altura:400
        }
        ipcRenderer.send('abrir-ventana',opciones);   
    }else if(e.keyCode === 117){
        impresion.checked = !impresion.checked;
    }
});

//Buscamos un cliente, si sabemos el codigo directamente apretamos enter
codigo.addEventListener('keypress',async e=>{
    if (e.key === "Enter") {
        if (codigo.value === "") {
            const opciones = {
                path: './clientes/clientes.html',
                botones:false,
            }
            ipcRenderer.send('abrir-ventana',opciones)
        }else{
            listarCliente(codigo.value)
        }
    }
});

codBarra.addEventListener('keypress',async e=>{
    if(e.key === "Enter" && codBarra.value !== "" && codBarra.value !== "999-999"){
        cantidad.focus();
    }else if(e.key === "Enter" && codBarra.value === ""){
        //Esto abre una ventana donde lista todos los productos
        const opciones = {
            path: "./productos/productos.html",
            botones: false
        }
        ipcRenderer.send('abrir-ventana',opciones);
    }else if(codBarra.value === "999-999"){
        cantidad.focus();
    }

    if(e.keyCode === 37){
        cantidad.focus();
    }
});

descripcion.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        precioU.focus();
    }
});

precioU.addEventListener('keypress',async e=>{
    if ((e.key === "Enter")) {
        if (precioU.value !== "") {
            crearProducto();
        }else{
            await sweet.fire({
                title:"Poner un precio al Producto",
            });
        }
    }
});

iva.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        e.preventDefault();
        precioU.focus();
    }
});

const crearProducto = ()=>{
    idProducto++;
    const producto = {
        descripcion:descripcion.value.toUpperCase(),
        precio: parseFloat(redondear(parseFloat(precioU.value) + (parseFloat(precioU.value) * parseFloat(porcentaje.value)/100),2)),
        rubro:"Cualquiera",
        idTabla:`${idProducto}`,
        impuesto:iva.value,
        impuesto:parseFloat(iva.value),
        productoCreado:true
    };
    listaProductos.push({cantidad:parseFloat(cantidad.value),producto});
        tbody.innerHTML += `
        <tr id=${idProducto}>
            <td></td>
            <td>${cantidad.value}</td>
            <td>${descripcion.value.toUpperCase()}</td>
            <td></td>
            <td>${producto.impuesto.toFixed(2)}</td>
            <td>${parseFloat(producto.precio).toFixed(2)}</td>
            <td>${redondear((producto.precio * parseFloat(cantidad.value)),2)}</td>
            <td class=acciones>
                <div class=tool>
                        <span class=material-icons>post_add</span>
                        <p class=tooltip>Agregar Nº serie</p>
                </div>
                <div class=tool>
                    <span class=material-icons>delete</span>
                    <p class=tooltip>Eliminar</p>
                </div>
            </td>
        </tr>
    `;
    tbody.scrollIntoView({
        block:"end"
    });

    total.value = redondear((parseFloat(total.value) + parseFloat(producto.precio) * parseFloat(cantidad.value)),2);
    totalGlobal = parseFloat(total.value);
    cantidad.value = "1.00";
    codBarra.value = "";
    precioU.value = "";
    iva.value = "21.00";
    // rubro.value = "";
    descripcion.value = "";
    console.log(descripcion.value)
    codBarra.focus();
};

ipcRenderer.on('recibir',(e,args)=>{
    const {tipo ,informacion} = JSON.parse(args);
    tipo === "cliente" && listarCliente(informacion);
    tipo === "producto" && listarProducto(informacion);
    tipo === "Ningun cliente" && nombre.focus();
});

porcentaje.addEventListener('change',async e=>{
        porcentaje.value = porcentaje.value === "" ? "0.00"  : porcentaje.value;
        descuento = redondear(parseFloat(total.value) * parseFloat(porcentaje.value) / 100,2);
        for await(let {cantidad,producto} of listaProductos){       
            totalGlobal -= parseFloat(redondear(producto.precio*cantidad,2))
            producto.precio = parseFloat(redondear(producto.precio / (porcentajeH/100 + 1),2));
            producto.precio = parseFloat(redondear(producto.precio + producto.precio*parseFloat(porcentaje.value)/100,2));
            const tr = document.getElementById(producto.idTabla)
            tr.children[4].innerHTML = producto.precio.toFixed(2);
            tr.children[5].innerHTML = redondear(producto.precio*cantidad,2);
            totalGlobal = parseFloat(redondear(totalGlobal + producto.precio*cantidad,2));
            total.value = totalGlobal.toFixed(2);
        }
        porcentajeH = parseFloat(porcentaje.value);
});

//Vemos que input tipo radio esta seleccionado
const verTipoVenta = ()=>{
    let retornar;
    radio.forEach(input =>{
        if (input.checked) {
            retornar = input.value;
        }
    });
    return retornar;
};

facturar.addEventListener('click',async e=>{
    if (codigo.value === "") {
        sweet.fire({
            title:"Poner un codigo de cliente"
        });
    }else if(!verSiHayInternet() && situacion === "blanco"){
        await sweet.fire({
            title:"No se puede hacer la factura porque no hay internet"
        })
    }else if(cuit.value.length === 8 && condicionIva.value === "Responsable Inscripto" && archivo.condIva === "Inscripto"){
        if (tipoFactura) {
            await sweet.fire({
                title:"No se puede hacer Nota Credito B a un Inscripto"
            });
        }else{
            await sweet.fire({
                title:"No se puede hacer Factura B a un Inscripto"
            });
        }
    }else{
        alerta.classList.remove('none');
        const numeros = (await axios.get(`${URL}numero`)).data;
        const venta = {};

        venta.cliente = nombre.value;
        venta.fecha = new Date();
        venta.idCliente = codigo.value;
        venta.precio = parseFloat(total.value);
        venta.descuento = descuento;
        venta.tipo_venta = await verTipoVenta();
        venta.listaProductos = listaProductos;
        
        //Ponemos propiedades para la factura electronica
        venta.cod_comp = situacion === "blanco" ? await verCodigoComprobante(tipoFactura,cuit.value,condicionIva.value === "Responsable Inscripto" ? "Inscripto" : condicionIva.value) : 0;
        venta.tipo_comp = situacion === "blanco" ? await verTipoComprobante(venta.cod_comp) : "Comprobante";
        venta.num_doc = cuit.value !== "" ? cuit.value : "00000000";
        venta.cod_doc = await verCodigoDocumento(cuit.value);
        venta.condicionIva = condicionIva.value === "Responsable Inscripto" ? "Inscripto" : condicionIva.value
        const [iva21,iva0,gravado21,gravado0,iva105,gravado105,cantIva] = await sacarIva(listaProductos); //sacamos el iva de los productos
        venta.iva21 = iva21;
        venta.iva0 = iva0;
        venta.gravado0 = gravado0;
        venta.gravado21 = gravado21;
        venta.iva105 = iva105;
        venta.gravado105 = gravado105;
        venta.cantIva = cantIva;
        venta.direccion = direccion.value;

        venta.caja = require('../configuracion.json').caja; //vemos en que caja se hizo la venta
        venta.vendedor = vendedor ? vendedor : "";
        
        venta.facturaAnterior = facturaAnterior ? facturaAnterior : "";
        if (venta.tipo_venta === "CC") {
            venta.numero = numeros["Cuenta Corriente"] + 1;
        }else if(venta.tipo_venta === "PP"){
            venta.numero = numeros["Presupuesto"] + 1;
        }else if(venta.tipo_venta === "CD"){
            venta.numero = numeros["Contado"] + 1;
        };

        if (venta.tipo_venta === "CC") {
            await axios.put(`${URL}numero/Cuenta Corriente`,{"Cuenta Corriente":venta.numero});
        }else if(venta.tipo_venta === "PP"){
            await axios.put(`${URL}numero/Presupuesto`,{"Presupuesto":venta.numero});
        }else{
            await axios.put(`${URL}numero/Contado`,{Contado:venta.numero});
        }
            try {
                if (situacion === "blanco") {
                    alerta.classList.remove('none');
                    venta.afip = await cargarFactura(venta,facturaAnterior ? true : false);
                    venta.F = true;
                }else{
                    alerta.children[1].innerHTML = "Generando Venta";
                }

                for (let producto of listaProductos){
                    await cargarMovimiento(producto,venta.numero,venta.cliente,venta.tipo_venta,venta.tipo_comp,venta.caja,venta.vendedor);
                    if (!(producto.producto.productoCreado)) {
                        await descontarStock(producto);
                    }
                    //producto.producto.precio = producto.producto.precio - redondear((parseFloat(descuentoPor.value) * producto.producto.precio / 100,2));
                }

                venta.tipo_venta !== "PP" && await axios.put(`${URL}productos/descontarStock`,descuentoStock)
                await axios.post(`${URL}movimiento`,movimientos);
                
            //sumamos al cliente el saldo y agregamos la venta a la lista de venta
                venta.tipo_venta === "CC" && await sumarSaldo(venta.idCliente,venta.precio,venta.numero);


            //Ponemos en la cuenta conpensada si es CC
                venta.tipo_venta === "CC" && await ponerEnCuentaCompensada(venta);
                venta.tipo_venta === "CC" && await ponerEnCuentaHistorica(venta,parseFloat(saldo.value));

                if (venta.tipo_venta === "CC" &&  parseFloat(inputRecibo.value) !== 0) {
                    await hacerRecibo(numeros.Recibo);
                }
        
                const cliente = {};
                cliente.nombre = nombre.value;
                cliente.localidad = localidad.value;
                cliente.cuit = cuit.value;
                cliente.condicionIva = condicionIva.value;
                cliente.direccion = direccion.value;
                cliente._id = codigo.value;

                if (venta.tipo_venta === "PP") {
                    await axios.post(`${URL}Presupuesto`,venta);
                }else{
                    await axios.post(`${URL}ventas`,venta);
                }

                if (impresion.checked) {
                    ipcRenderer.send('imprimir',[situacion,venta,cliente,movimientos]);
                }

                location.reload();  
            } catch (error) {
                
                await sweet.fire({
                    title:"No se pudo generar la venta"
                });
                console.log(error)
            }finally{
                alerta.classList.add('none');
            }
    }
})

//Lo que hacemos es listar el cliente traido
const listarCliente = async(id)=>{
    codigo.value = id;
    const cliente = (await axios.get(`${URL}clientes/id/${id}`)).data;
    if (cliente !== "") {
        nombre.value = cliente.nombre;
        saldo.value = cliente.saldo;
        telefono.value = cliente.telefono;
        localidad.value = cliente.localidad;
        cuit.value = cliente.cuit === "" ? "00000000" : cliente.cuit;
        condicionIva.value = cliente.condicionIva ? cliente.condicionIva : "Consumidor Final";
        codBarra.focus();
        cliente.condicionFacturacion === 1 ? cuentaCorrientediv.classList.remove('none') : cuentaCorrientediv.classList.add('none')
    }else{
        codigo.value = "";
        codigo.focus();
    }
};

//creamos la cuenta compensada cuedo la venta se hace en cuenta corriente
const ponerEnCuentaCompensada = async(venta)=>{
    const cuenta = {};
    cuenta.cliente = venta.cliente;
    cuenta.idCliente = venta.idCliente;
    cuenta.nro_venta = venta.numero;
    cuenta.importe = venta.precio;
    cuenta.pagado = inputRecibo.value;
    cuenta.tipo_comp = venta.tipo_comp;
    cuenta.saldo = venta.precio - parseFloat(inputRecibo.value);
    await axios.post(`${URL}compensada`,cuenta);
};

const ponerEnCuentaHistorica = async(venta,saldo)=>{
    const cuenta = {};
    cuenta.cliente = venta.cliente;
    cuenta.idCliente = venta.idCliente;
    cuenta.nro_venta = venta.numero;
    cuenta.tipo_comp = venta.tipo_comp;
    cuenta.debe = venta.precio;
    cuenta.saldo = facturaAnterior ? saldo - venta.precio : venta.precio + saldo;
    (await axios.post(`${URL}historica`,cuenta)).data;
}

//Cargamos el movimiento de producto a la BD
const cargarMovimiento = async({cantidad,producto,series},numero,cliente,tipo_venta,tipo_comp,caja,vendedor="")=>{
    const movimiento = {};
    movimiento.tipo_venta = tipo_venta;
    movimiento.codProd = producto._id;
    movimiento.producto = producto.descripcion;
    movimiento.cliente = cliente
    movimiento.cantidad = cantidad;
    movimiento.marca = producto.marca;
    if (checkboxDolar.checked) {
        movimiento.precio = producto.precio / dolar;
    }else{
        movimiento.precio = lista.value === "1" ? producto.precio : sacarCosto(producto.costo,producto.costoDolar,producto.impuesto,dolar);
    }
    movimiento.rubro = producto.rubro;
    movimiento.nro_venta = numero;
    movimiento.impuesto = producto.impuesto;
    movimiento.tipo_comp = tipo_comp;
    movimiento.caja = caja;
    movimiento.iva = producto.impuesto;
    movimiento.series = series;
    movimiento.vendedor = vendedor;
    movimientos.push(movimiento);
};

//Descontamos el stock
const descontarStock = async({cantidad,producto})=>{
    delete producto.idTabla;
    if (facturaAnterior) {
        producto.stock += cantidad;
    }else{
        producto.stock -= cantidad;
    }
    descuentoStock.push(producto)
}

//Lo que hacemos es listar el producto traido
const listarProducto =async(id)=>{
        let producto = (await axios.get(`${URL}productos/${id}`)).data;//buscamos el producto por codigo
        producto = producto === "" ? (await axios.get(`${URL}productos/buscar/porNombre/${id}`)).data : producto;//buscamos el producto por descripcion
        //ponemos el precio del producto con un descuento si es que hay
        producto.precio = parseFloat(redondear(producto.precio + producto.precio * parseFloat(porcentaje.value)/100,2));
        //Buscamos si el produto ya esta cargado
        if (producto !== "") {
        const productoYaUsado = listaProductos.find(({producto: product})=>{
           if (product._id === producto._id) {
               return product
           };
        });

        if(producto !== "" && !productoYaUsado){
            if (producto.stock === 0 && archivo.stockNegativo) {
                await sweet.fire({
                    title:"Producto con Stock en 0"
                });
            };
            if (producto.stock - (parseFloat(cantidad.value)) < 0 && archivo.stockNegativo) {
                await sweet.fire({
                    title:"Producto con Stock menor a 0",
                });
            }

            listaProductos.push({cantidad:parseFloat(cantidad.value),producto});

            codBarra.value = producto._id;

            //ponemos en el input el precio de el producto ya se para consumidor final o para instalador
            if (checkboxDolar.checked) {
                precioU.value = redondear(producto.precio / dolar,2);
            }else{
                precioU.value = lista.value === "1" ? redondear(producto.precio,2) : sacarCosto(producto.costo,producto.costoDolar,producto.impuesto,dolar)
            }
            
            idProducto++;
            producto.idTabla = `${idProducto}`; 

                tbody.innerHTML += `
                <tr id=${producto.idTabla}>
                    <td>${codBarra.value}</td>
                    <td>${cantidad.value}</td>
                    <td>${producto.descripcion.toUpperCase()}</td>
                    <td>${producto.marca}</td>
                    <td>${producto.impuesto.toFixed(2)}</td>
                    <td>${parseFloat(precioU.value).toFixed(2)}</td>
                    <td>${redondear(parseFloat(precioU.value) * parseFloat(cantidad.value),2)}</td>
                    <td class=acciones>
                        <div class=tool>
                            <span class=material-icons>post_add</span>
                            <p class=tooltip>Series</p>
                        </div>
                        <div class=tool>
                            <span class=material-icons>delete</span>
                            <p class=tooltip>Eliminar</p>
                        </div>
                    </td>
                </tr>
            `;

            tbody.scrollIntoView({//hacemos un scroll al final del producto cargado ultimo
                block:"end"
            });

            total.value = redondear(parseFloat(total.value) + (parseFloat(cantidad.value) * parseFloat(precioU.value)),2);
            totalGlobal = parseFloat(total.value);

        }else if(producto !== "" && productoYaUsado){

            productoYaUsado.cantidad += parseFloat(cantidad.value);
            producto.idTabla = productoYaUsado.producto.idTabla;

            const tr = document.getElementById(producto.idTabla);
            tr.children[1].innerHTML = redondear(parseFloat(tr.children[1].innerHTML) + parseFloat(cantidad.value),2);
            let precio = tr.children[5];
            
            const cantidadNueva = parseFloat(tr.children[1].innerHTML).toFixed(2);
            //si lista es 1 entonces redondeamos para el precio comun simplemente
            if (lista.value === "1") {
                if (checkboxDolar.checked) {
                    precio.innerHTML = redondear(parseFloat(tr.children[1].innerHTML) * producto.precio / dolar,2)
                }else{
                    precio.innerHTML = redondear(parseFloat(tr.children[1].innerHTML) * producto.precio,2);
                }
                total.value = redondear(parseFloat(total.value) + (parseFloat(cantidad.value) * producto.precio),2);
            }else{
            //Si la lista es 2 entonces redondeamos con el costo simplemente
                precio.innerHTML = redondear(cantidadNueva * parseFloat(sacarCosto(producto.costo,producto.costoDolar,producto.impuesto,dolar)),2);
                total.value = redondear(parseFloat(total.value) + parseFloat(sacarCosto(producto.costo,producto.costoDolar,producto.impuesto,dolar)),2);
            }
            totalGlobal = parseFloat(total.value);
        }

        cantidad.value = "1.00";
        codBarra.value = "";
        descripcion.value = "";
        precioU.value = "";
        codBarra.focus();  

    }else{
        descripcion.focus();
    }
        

};

let seleccionado;
//Hacemos para que se seleccione un tr

tbody.addEventListener('click',async e=>{
    seleccionado && seleccionado.classList.remove('seleccionado');
    if (e.target.nodeName === "TD") {
        seleccionado = e.target.parentNode;
    }else if(e.target.nodeName === "DIV"){
        seleccionado = e.target.parentNode.parentNode;
    }else if(e.target.nodeName === "SPAN"){
        seleccionado = e.target.parentNode.parentNode.parentNode;
    }
    seleccionado.classList.add('seleccionado');
    if (e.target.innerHTML === "post_add") {
        //Traemops el producto seleccionado para ver si tiene nuemores de series ya cargados y asi mostrarlos
        const producto = listaProductos.find(({producto})=>producto.idTabla === seleccionado.id);
        let valor = "";

        if (producto.series) {
            producto.series.forEach(serie=>{
                if (valor) {
                    valor = valor + "\n" + serie
                }else{
                    valor = serie;
                }
            });
        };//Ponemos el con saltos de lineas para que se muestre correctamente

        await sweet.fire({
            title:"Nro Series",
            confirmButtonText:"Aceptar",
            showCancelButton:true,
            input:"textarea",
            inputValue:valor //Si tiene un valor lo ponemos por defecto
        }).then(({isConfirmed,value})=>{
            if (isConfirmed) {
                const objeto = listaProductos.find(({producto}) => producto.idTabla === seleccionado.id);
                objeto.series = value.split('\n')
            }
        })
    }
    if(e.target.innerHTML === "delete"){
        sweet.fire({
            title:"Borrar?",
            confirmButtonText:"Aceptar",
            showCancelButton:true
        }).then(({isConfirmed})=>{
            tbody.removeChild(seleccionado);
            total.value = redondear(parseFloat(total.value) - parseFloat(seleccionado.children[5].innerHTML),2);
            totalGlobal = parseFloat(total.value);
            const productoABorrar = listaProductos.findIndex(({producto,cantidad})=>seleccionado.id === producto.idTabla);
            listaProductos.splice(productoABorrar,1);
        });
    }
});

const sumarSaldo = async(id,nuevoSaldo,venta)=>{
    const cliente = (await axios.get(`${URL}clientes/id/${id}`)).data;
    cliente.listaVentas.push(venta);
    if (facturaAnterior) {
        cliente.saldo = (cliente.saldo - nuevoSaldo);
    }else{
        cliente.saldo = (cliente.saldo + nuevoSaldo - parseFloat(inputRecibo.value)).toFixed(2);
    }
    await axios.put(`${URL}clientes/id/${id}`,cliente);
};

const sacarIva = (lista) => {
    let totalIva0 = 0;
    let totalIva21= 0;
    let gravado21 = 0; 
    let gravado0 = 0;
    let totalIva105= 0;
    let gravado105 = 0;
    lista.forEach(({producto,cantidad}) =>{
        if (producto.impuesto === 21) {
            gravado21 += cantidad*producto.precio/1.21;
            totalIva21 += cantidad*producto.precio/1.21 * 21 / 100;
        }else if(producto.impuesto === 10.5){
            gravado105 += cantidad*producto.precio/1.105
            totalIva105 += cantidad*producto.precio/1.105 * 10.5 / 100;
        }else{
            gravado0 += cantidad*producto.precio/1;
            totalIva0 += (cantidad*producto.precio)-(producto.precio/1);
        }
    });
    let cantIva = 0
    if (gravado0 !== 0) {
        cantIva++;
    }
    if (gravado21 !== 0) {
        cantIva++;
    }
    if (gravado105 !== 0) {
        cantIva++;
    }
    return [parseFloat(totalIva21.toFixed(2)),parseFloat(totalIva0.toFixed(2)),parseFloat(gravado21.toFixed(2)),parseFloat(gravado0.toFixed(2)),parseFloat(totalIva105.toFixed(2)),parseFloat(gravado105.toFixed(2)),cantIva]
};

codigo.addEventListener('focus',e=>{
    codigo.select();
});

nombre.addEventListener('focus',e=>{
    nombre.select()
});

cuit.addEventListener('focus',e=>{
    cuit.select()
});

localidad.addEventListener('focus',e=>{
    localidad.select();
});

telefono.addEventListener('focus',e=>{
    telefono.select();
});

direccion.addEventListener('focus',e=>{
    direccion.select();
});

total.addEventListener('focus',e=>{
    total.select();
});

cantidad.addEventListener('focus',e=>{
    cantidad.select();
});

porcentaje.addEventListener('focus',e=>{
    porcentaje.select();
});

inputRecibo.addEventListener('focus',e=>{
    inputRecibo.select();
});

document.addEventListener('keydown',e=>{
    if (e.key === "Escape") {
        
        sweet.fire({
            title: "Cancelar Venta?",
            "showCancelButton": true,
            "confirmButtonText" : "Aceptar",
            "cancelButtonText" : "Cancelar"
        }).then((result)=>{
            if (result.isConfirmed) {
                location.href = "../menu.html" ;
            }
        });
    };
});

const hacerRecibo = async(numero)=>{
    const recibo = {};
    recibo.fecha = new Date();
    recibo.cliente = nombre.value;
    recibo.idCliente = codigo.value;
    recibo.numero = numero + 1;
    recibo.precio = inputRecibo.value;
    recibo.tipo_comp = "Recibo";
    recibo.tipo_venta = "CD";
    await hacerHistoricaRecibo(recibo.numero,recibo.precio,recibo.tipo_comp);
    await axios.post(`${URL}recibo`,recibo);
    await axios.put(`${URL}numero/Recibo`,{Recibo:recibo.numero});
};

const hacerHistoricaRecibo = async(numero,haber,tipo)=>{
    const cuenta = {};
    cuenta.cliente = nombre.value;
    cuenta.idCliente = codigo.value;
    cuenta.nro_venta = numero + 1;
    cuenta.tipo = tipo;
    cuenta.haber = haber;
    cuenta.saldo = parseFloat(total.value) - parseFloat(haber)  + parseFloat(saldo.value);
    (await axios.post(`${URL}historica`,cuenta)).data;
};

//Lo usamos para mostrar o ocultar cuestiones que tiene que ver con las ventas
const cambiarSituacion = (situacion) =>{
    situacion === "negro" ? document.querySelector('#tarjeta').parentNode.classList.add('none') : document.querySelector('#tarjeta').parentNode.classList.remove('none');
}

//Ver Codigo Documento
const verCodigoDocumento = async(cuit)=>{
    if (cuit !== "00000000" && cuit !== "") {
        if (cuit.length === 8) {
            return 96
        }else{
            return 80
        }
    }

    return 99
};

//ponemos un numero para la venta y luego mandamos a imprimirla
ipcRenderer.on('poner-numero',async (e,args)=>{
    ponerNumero();
})

nombre.addEventListener('keypress',e=>{
    apretarEnter(e,cuit);
});

cuit.addEventListener('keypress',e=>{
    apretarEnter(e,lista);
});

lista.addEventListener('keypress',e=>{
    e.preventDefault();
    apretarEnter(e,telefono);
});

telefono.addEventListener('keypress',e=>{
    apretarEnter(e,localidad);
});

localidad.addEventListener('keypress',e=>{
    apretarEnter(e,direccion);
});

direccion.addEventListener('keypress',e=>{
    apretarEnter(e,condicionIva);
});

condicionIva.addEventListener('keypress',e=>{
    e.preventDefault();
    apretarEnter(e,codBarra);
});

cantidad.addEventListener('keypress',async e=>{
    if (e.keyCode === 13) {
        listarProducto(codBarra.value);
    }
});

cantidad.addEventListener('keydown',e=>{
    if(e.keyCode === 39){
        codBarra.focus();
    }
});

tbody.addEventListener('dblclick',async se=>{
    await sweet.fire({
        title:"Cambio",
        html:`
            <section class=cambio>
                <main>
                    <label htmlFor="cantidadCambio">Cantidad</label>
                    <input class=text-rigth type="text" name="cantidadCambio" value=${seleccionado.children[1].innerHTML} id="cantidadCambio"/>
                </main>
                <main>
                    <label htmlFor="precioCambio">Precio</label>
                    <input class=text-rigth type="text" name="precioCambio" value=${seleccionado.children[5].innerHTML} id="precioCambio"/>
                </main>
                <main>
                    <label htmlFor="ivaCambio">Iva</label>
                    <input class=text-rigth type="text" name="ivaCambio" value=${seleccionado.children[4].innerHTML} id="ivaCambio"/>
                </main>
            </section>
        `,
        confirmButtonText:"Aceptar",
        showCancelButton:true
    }).then(async({isConfirmed})=>{
        if (isConfirmed) {
            const producto = listaProductos.find(({producto})=>producto.idTabla === seleccionado.id);
            totalGlobal = parseFloat(redondear(totalGlobal - (producto.producto.precio * producto.cantidad),2));
            producto.cantidad = parseFloat(document.getElementById('cantidadCambio').value);
            producto.producto.precio = parseFloat(document.getElementById('precioCambio').value);
            producto.producto.iva = parseFloat(document.getElementById('ivaCambio').value);
            seleccionado.children[1].innerHTML = producto.cantidad.toFixed(2);
            seleccionado.children[4].innerHTML = producto.producto.impuesto.toFixed(2);
            seleccionado.children[5].innerHTML = producto.producto.precio.toFixed(2);
            seleccionado.children[6].innerHTML = redondear(producto.producto.precio * producto.cantidad,2);
            console.log(totalGlobal)
            totalGlobal = parseFloat(redondear(totalGlobal + (producto.producto.precio * producto.cantidad),2));
            total.value = totalGlobal.toFixed(2);
        }
    })
});

//Cambiamos los precios si se habilita el dolar
checkboxDolar.addEventListener('change',e=>{
    for(let {cantidad,producto} of listaProductos){
        if (checkboxDolar.checked) {
            producto.precio = parseFloat(redondear(producto.precio / dolar,2));
        }else{
            producto.precio = parseFloat(redondear(producto.precio * dolar,2));
        }

        const tr = document.getElementById(producto.idTabla);
        tr.children[5].innerText = producto.precio;
        tr.children[6].innerText = redondear(producto.precio * cantidad,2);
    }
    console.log(listaProductos)
});


volver.addEventListener('click',()=>{
    location.href = "../menu.html";
});
