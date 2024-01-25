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
const {apretarEnter,redondear,cargarFactura, ponerNumero, verCodigoComprobante, verTipoComprobante, verSiHayInternet, verClienteValido, movimientosRecibos, mostrarHistoricaRespuesta, mostrarVentaRespues, sacarIva, configAxios} = require('../helpers');
const archivo = require('../configuracion.json');

//Parte Cliente
const codigo = document.querySelector('#codigo');
const nombre = document.querySelector('#nombre');
const telefono = document.querySelector('#telefono');
const localidad = document.querySelector('#localidad');
const direccion = document.querySelector('#direccion');
const cuit = document.querySelector('#cuit');
const condicionIva = document.querySelector('#condicion');

//Parte Producto
const cantidad = document.querySelector('#cantidad');
const codBarra = document.querySelector('#cod-barra')
const precioU = document.querySelector('#precio-U');
const rubro = document.querySelector('#rubro');
const tbody = document.querySelector('.tbody');
const select = document.querySelector('#rubro');

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
let situacion = "negro";
let porcentajeH = 0;
let descuento = 0;
let listaProductos = [];

//Por defecto ponemos el A Consumidor Final y tambien el select
window.addEventListener('load',async e=>{

    if (tipoFactura === "notaCredito") {
        situacion = "blanco";
        body.classList.toggle('negro');
        cambiarSituacion(situacion)
        await sweet.fire({
            title:"Numero de Factura Anterior",
            input:"text",
            confirmButtonText:"Aceptar",
            showCancelButton:true
        }).then(({isConfirmed,value})=>{
            if (isConfirmed) {
                facturaAnterior = value.padStart(8,'0');
            }else{
                location.href = '../menu.html';
            }
        });
    }
    
    listarCliente(1);//listanos los clientes

    listarRubros();//listamos los rubros que tengamos en la base de dato
    
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


descripcion.addEventListener('keypress',e=>{
    if (e.keyCode === 13 && descripcion.value !== "") {
        listarProducto(descripcion.value);
    }else if(e.keyCode === 13 && descripcion.value === ""){
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

rubro.addEventListener('keypress',e=>{
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
        rubro:rubro.value,
        idTabla:`${idProducto}`,
        impuesto:0,
        productoCreado:true
    };

    listaProductos.push({cantidad:parseFloat(cantidad.value),producto});
        tbody.innerHTML += `
        <tr id=${idProducto}>
            <td>${cantidad.value}</td>
            <td></td>
            <td>${descripcion.value.toUpperCase()}</td>
            <td></td>
            <td>${parseFloat(producto.precio).toFixed(2)}</td>
            <td>${redondear((producto.precio * parseFloat(cantidad.value)),2)}</td>
            <td class=acciones>
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
    precioU.value = "";
    rubro.value = "";
    descripcion.value = "";
    descripcion.focus();
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
    }else if(!await verClienteValido(codigo.value) && cuentaCorrientediv.children[0].checked){
        await sweet.fire({
            title:"Cliente no valido para hacer Cuenta Corriente, revisar numero de cliente"
        });
        codigo.focus();
        return;    
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
        venta.caja = archivo.caja; //vemos en que caja se hizo la venta
        venta.vendedor = vendedor ? vendedor : "";
        
        venta.facturaAnterior = facturaAnterior ? facturaAnterior : "";
        if (venta.tipo_venta === "CC") {
            venta.numero = numeros["Cuenta Corriente"] + 1;
        }else if(venta.tipo_venta === "PP"){
            venta.numero = numeros["Presupuesto"] + 1;
        }else if(venta.tipo_venta === "CD" || venta.tipo_venta === "T"){
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
                venta.tipo_venta !== "PP" && await axios.post(`${URL}movimiento`,movimientos);
            //sumamos al cliente el saldo y agregamos la venta a la lista de venta
                venta.tipo_venta === "CC" && await sumarSaldo(venta.idCliente,venta.precio,venta.numero);


            //Ponemos en la cuenta conpensada si es CC
                venta.tipo_venta === "CC" && await ponerEnCuentaCompensada(venta);
                venta.tipo_venta === "CC" && await ponerEnCuentaHistorica(venta,parseFloat(saldo.value));

                if (venta.tipo_venta === "CC" &&  parseFloat(inputRecibo.value) !== 0) {
                    await hacerRecibo(numeros.Recibo,venta.numero,venta.tipo_comp);
                }
        
                const cliente = (await axios.get(`${URL}clientes/id/${codigo.value}`)).data;

                if (venta.tipo_venta === "PP") {
                    await axios.post(`${URL}Presupuesto`,venta);
                }else{
                    const resVenta = (await axios.post(`${URL}ventas`,venta)).data;
                    mostrarVentaRespues(resVenta);
                };

                if (impresion.checked) {
                    ipcRenderer.send('imprimir',JSON.stringify([venta,cliente,movimientos]));
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
});

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
        descripcion.focus();
        cliente.condicionFacturacion === 1 ? cuentaCorrientediv.classList.remove('none') : cuentaCorrientediv.classList.add('none')
    }else{
        codigo.value = "";
        codigo.focus();
    }
};

//Lo que hacemos es listar el producto traido
const listarProducto =async(id)=>{
    let producto;
    if (id.slice(0,2) === "20") {
        const aux = id.slice(2,6);
        const cantEnt = id.slice(6,9);
        const cantDec = id.slice(9,12);
        producto = (await axios.get(`${URL}productos/${aux}`)).data;
        cantidad.value = parseFloat(cantEnt + "." + cantDec);
    }else{
        producto = (await axios.get(`${URL}productos/${id}`)).data;
    };
    
    producto = producto === "" ? (await axios.get(`${URL}productos/buscar/porNombre/${id}`)).data : producto;
    producto.precio = parseFloat(redondear(producto.precio + producto.precio * parseFloat(porcentaje.value)/100,2));
    if (producto !== "") {
        const productoYaUsado = listaProductos.find(({producto: product})=>{
       if (product._id === producto._id) {
           return product
       };
    });


    //Lenamos los espacios
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
    console.log(producto.oferta)
    precioU.value = producto.oferta ? producto.precioOferta.toFixed(2) : redondear(producto.precio,2);
    idProducto++;
    producto.idTabla = `${idProducto}`;
    tbody.innerHTML += `
    <tr id=${producto.idTabla}>
        <td>${cantidad.value}</td>
        <td>${producto._id}</td>
        <td>${producto.descripcion.toUpperCase()}</td>
        <td>${producto.marca}</td>
        <td>${ parseFloat(precioU.value).toFixed(2)}</td>
        <td>${redondear(parseFloat(precioU.value) * parseFloat(cantidad.value),2)}</td>
        <td class=acciones>
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
    total.value = redondear(parseFloat(total.value) + (parseFloat(cantidad.value) * parseFloat(precioU.value)),2);
    totalGlobal = parseFloat(total.value);
    }else if(producto !== "" && productoYaUsado){
        const precio = producto.oferta ? producto.precioOferta : producto.precio;
        productoYaUsado.cantidad += parseFloat(cantidad.value)
        producto.idTabla = productoYaUsado.producto.idTabla;
        const tr = document.getElementById(producto.idTabla);
        tr.children[0].innerHTML = redondear(parseFloat(tr.children[0].innerHTML) + parseFloat(cantidad.value),2);
        tr.children[5].innerHTML = redondear(parseFloat(tr.children[0].innerHTML) * precio,2);
        total.value = redondear(parseFloat(total.value) + (parseFloat(cantidad.value) * precio),2);
        totalGlobal = parseFloat(total.value);
    }
    cantidad.value = "1.00";
    descripcion.value = "";
    precioU.value = "";
    descripcion.focus();  
}else{
    precioU.focus();
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
    cuenta.haber = 0;
    cuenta.saldo = facturaAnterior ? saldo - venta.precio : venta.precio + saldo;
    const res = (await axios.post(`${URL}historica`,cuenta)).data;
    console.log(res)
    if (res) {
        await mostrarHistoricaRespuesta(res)
    }
};

//Cargamos el movimiento de producto a la BD
const cargarMovimiento = async({cantidad,producto,series},numero,cliente,tipo_venta,tipo_comp,caja,vendedor="")=>{
    const movimiento = {};
    movimiento.tipo_venta = tipo_venta;
    movimiento.codProd = producto._id;
    movimiento.producto = producto.descripcion;
    movimiento.cliente = cliente
    movimiento.cantidad = cantidad;
    movimiento.marca = producto.marca;
    if (producto.oferta) {
        movimiento.precio = producto.precioOferta ? producto.precioOferta : producto.precio;     
    }else{
        movimiento.precio = producto.precio
    }
    
    movimiento.rubro = producto.rubro;
    movimiento.nro_venta = numero;
    movimiento.tipo_comp = tipo_comp;
    movimiento.caja = caja,
    movimiento.series = series;
    movimiento.vendedor = vendedor
    movimiento.oferta = producto.oferta ? producto.oferta : false;
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
    if(e.target.innerHTML === "delete"){
        sweet.fire({
            title:"Borrar?",
            confirmButtonText:"Aceptar",
            showCancelButton:true
        }).then(async ({isConfirmed})=>{
            if (isConfirmed) {
                tbody.removeChild(seleccionado);
                total.value = redondear(parseFloat(total.value) - parseFloat(seleccionado.children[5].innerHTML),2);
                totalGlobal = parseFloat(total.value);
                const productoABorrar = listaProductos.findIndex(({producto,cantidad})=>seleccionado.id === producto.idTabla);
                listaProductos.splice(productoABorrar,1);
            }
        })
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


document.addEventListener('keydown',e=>{
    if (e.key === "Escape") {
        sweet.fire({
            title: "Cancelar Venta?",
            "showCancelButton": true,
            "confirmButtonText" : "Aceptar",
            "cancelButtonText" : "Cancelar"
        }).then((result)=>{
            if (result.isConfirmed) {
                cancelarVenta();
                location.href = "../menu.html" ;
            }
        });
    };
});

const hacerRecibo = async(numero,nro_comp,tipo)=>{
    const recibo = {};
    recibo.fecha = new Date();
    recibo.cliente = nombre.value;
    recibo.idCliente = codigo.value;
    recibo.numero = numero + 1;
    recibo.precio = inputRecibo.value;
    recibo.tipo_comp = "Recibo";
    recibo.tipo_venta = "CD";
    await hacerHistoricaRecibo(recibo.numero,recibo.precio,recibo.tipo_comp);
    await movimientoRecibo(recibo.idCliente,recibo.cliente,recibo.numero,recibo.precio,nro_comp,tipo);
    await axios.post(`${URL}recibo`,recibo);
    await axios.put(`${URL}numero/Recibo`,{Recibo:recibo.numero});
};

const hacerHistoricaRecibo = async(numero,haber,tipo)=>{
    const cuenta = {};
    cuenta.cliente = nombre.value;
    cuenta.idCliente = codigo.value;
    cuenta.nro_venta = numero;
    cuenta.tipo_comp = tipo;
    cuenta.haber = haber;
    cuenta.debe = 0;
    cuenta.saldo = parseFloat(total.value) - parseFloat(haber)  + parseFloat(saldo.value);
    (await axios.post(`${URL}historica`,cuenta)).data;
};

const movimientoRecibo = async(codigo,nombre,numero,precio,nro_comp,tipo)=>{
    const mov = {};
    mov.codigo = codigo;
    mov.cliente = nombre;
    mov.tipo = tipo
    mov.numero = numero;
    mov.nro_comp = nro_comp;
    mov.importe = parseFloat(total.value);
    mov.pagado = parseFloat(precio);
    mov.saldo = redondear(mov.importe - mov.pagado,2);
    await axios.post(`${URL}movRecibo`,mov);
};


const cancelarVenta = async () => {
    if (listaProductos.length > 0) {
        const cancelado = {};

        const ultimo = (await axios.get(`${URL}Cancelado/ultimo`)).data;

        cancelado.cliente = nombre.value;
        cancelado.idCliente = codigo.value;
        cancelado.num_doc = cuit.value ? cuit.value : "00000000";
        cancelado.cod_doc = await verCodigoDocumento(cuit.value);
        cancelado.condicionIva = condicionIva.value === "Responsable Inscripto" ? "Inscripto" : condicionIva.value;
        cancelado.cod_comp = 0;
        cancelado.tipo_comp = "Cancelado";
        cancelado.tipo_venta = "CL";
        cancelado.precio = parseFloat(total.value);
        cancelado.descuento = 0;
        cancelado.caja = archivo.caja ? archivo.caja : "Caja";
        cancelado.vendedor = archivo.vendedor ? archivo.vendedor : "Vendedor";
        cancelado.numero = ultimo ? ultimo + 1 : 1;

        const [iva21,iva0,gravado21,gravado0,iva105,gravado105,cantIva] = await sacarIva(listaProductos); //sacamos el iva de los productos
        cancelado.iva21 = iva21;
        cancelado.iva105 = iva105;
        cancelado.gravado21 =  gravado21,
        cancelado.gravado105 = gravado105,
        cancelado.cantIva = cantIva;

        await axios.post(`${URL}Cancelado`,cancelado,configAxios);

        for(let producto of listaProductos){
            cargarMovimiento(producto,cancelado.numero,cancelado.cliente,cancelado.tipo_venta,cancelado.tipo_comp,cancelado.caja,cancelado.vendedor);
        };
        //Cargamos el movimiento de producto
        await axios.post(`${URL}movimiento`,movimientos,configAxios);   
    }
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

const listarRubros = async()=>{
    const rubros = (await axios.get(`${URL}rubro`)).data;
    for await(let {rubro,numero} of rubros){
        const option = document.createElement('option');
        option.text = numero + "-" + rubro;
        option.value = rubro;
        select.appendChild(option);
    }
}

//ponemos un numero para la venta y luego mandamos a imprimirla
ipcRenderer.on('poner-numero',async (e,args)=>{
    ponerNumero();
});

nombre.addEventListener('keypress',e=>{
    apretarEnter(e,cuit);
});

cuit.addEventListener('keypress',e=>{
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

condicionIva.addEventListener('keypress',async e=>{
    e.preventDefault();
    apretarEnter(e,cantidad)
});

cantidad.addEventListener('keypress',async e=>{
    if (e.keyCode === 13 && e.target.value !== "") {
        listarProducto(descripcion.value);
    }else if(e.keyCode === 13 && e.target.value === ""){
        await sweet.fire({title:"Poner una cantidad"});
        cantidad.value = "1.00"
    }
});

cantidad.addEventListener('keydown',e=>{
    if(e.keyCode === 39){
        descripcion.focus();
    }
});

volver.addEventListener('click',async ()=>{
    await cancelarVenta();
    location.href = "../menu.html";
});


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