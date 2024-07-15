const funciones = {}
const Afip = require('@afipsdk/afip.js');
const { clipboard } = require('electron');

const archivo = require('./configuracion.json');

const afip = new Afip({CUIT:archivo.cuit});

const sweet = require('sweetalert2');
const axios = require('axios');
require('dotenv').config();
const URL = process.env.GESTIONURL;

let puntoVenta = archivo.puntoVenta;

let internetAvalible = require('internet-available');

//Sirve para ver si hay internet o no
funciones.verSiHayInternet = () => {
    let retorno = true
    internetAvalible({
        timeout:1000,
        retries:5
    }).then(()=>{
        retorno = true
    }).catch(()=>{
        retorno = false
    });
    return retorno
}

//cerramos la ventana al apretrar escape
funciones.cerrarVentana = (e)=>{
        if (e.key === "Escape") {
            window.close();
        }
}

funciones.apretarEnter = async (e,input)=>{
    if(e.key === "Enter"){
        input.focus();
    }
}

funciones.copiar = async()=>{
    document.addEventListener('keydown',e=>{
        if (e.keyCode === 17) {
            document.addEventListener('keydown',e=>{
                const subSeleccionado = document.querySelector('.subSeleccionado');
                if (e.keyCode === 67) {
                    clipboard.writeText(subSeleccionado.innerHTML)
                }
            },{once:true});
        }
    })
}

funciones.selecciona_value = (idInput)=>{
    const seleccionado = document.getElementById(idInput);
    seleccionado.select();
}

funciones.redondear = (numero,decimales)=>{
    const signo = numero >= 0 ? 1 : -1;
    return(parseFloat(Math.round((numero * Math.pow(10,decimales)) + (signo * 0.0001)) / Math.pow(10,decimales)).toFixed(decimales));
}

funciones.cargarFactura = async (venta,notaCredito)=>{
    console.log(venta)
    const fecha = new Date(Date.now()-((new Date()).getTimezoneOffset()*60000)).toISOString().split('T')[0];
    const serverStatus = await afip.ElectronicBilling.getServerStatus();
    console.log(serverStatus) // mostramos el estado del servidor

    let ultimaElectronica = await afip.ElectronicBilling.getLastVoucher(puntoVenta,venta.cod_comp);
    console.log(ultimaElectronica);

    console.log(parseFloat(venta.facturaAnterior));
    let aux = venta.condicionIva === "Inscripto" ? 1 : 6
    let ventaAnterior = venta.facturaAnterior && await afip.ElectronicBilling.getVoucherInfo(parseFloat(venta.facturaAnterior),puntoVenta,aux);
    let data = {
        'cantReg':1,
        'CbteTipo':venta.cod_comp,
        'Concepto':1,
        'DocTipo':venta.cod_doc,
        'DocNro':venta.num_doc,
        'CbteDesde':ultimaElectronica + 1,
        'CbteHasta':ultimaElectronica + 1,
        'CbteFch': parseInt(fecha.replace(/-/g, '')),
        'ImpTotal':venta.precio,
        'ImpTotConc':0,
        'ImpNeto': archivo.condIva === "Inscripto" ? parseFloat(redondear(venta.gravado21 + venta.gravado0 + venta.gravado105,2)) : venta.precio,
        'ImpOpEx': 0,
        'ImpIVA': archivo.condIva === "Inscripto" ? parseFloat(redondear(venta.iva21 + venta.iva0 + venta.iva105,2)) : 0,
        'ImpTrib': 0,
        'MonId': 'PES',
        'PtoVta': puntoVenta,
        'MonCotiz' 	: 1,
        'Iva':[],
    };
    notaCredito && (data.CbtesAsoc = [
        {
            "Tipo":ventaAnterior.CbteTipo,
            "PtoVta":ventaAnterior.PtoVta,
            "Nro":ventaAnterior.CbteHasta
        }
    ]);

    if (archivo.condIva === "Inscripto") {
        venta.iva105 !== 0 && (data.Iva.push({
            'Id':4,
            'BaseImp':venta.gravado105,
            'Importe':venta.iva105
        }));
    
        venta.iva21 !== 0 && (data.Iva.push({
            'Id':5,
            'BaseImp':venta.gravado21,
            'Importe':venta.iva21
        }));

        venta.gravado0 !== 0 && (data.Iva.push({
            'Id':3,
            'BaseImp':venta.gravado0,
            'Importe':venta.iva0
        }));
    
    }
    console.log(data)
    const res = await afip.ElectronicBilling.createVoucher(data); //creamos la factura electronica
    console.log(res)

    const qr = {
        ver: 1,
        fecha: fecha,
        cuit: archivo.cuit,
        ptoVta: puntoVenta,
        tipoCmp: venta.cod_comp,
        nroCmp: ultimaElectronica + 1,
        importe: data.ImpTotal,
        moneda: "PES",
        ctz: 1,
        tipoDocRec: data.DocTipo,
        nroDocRec: parseInt(data.DocNro),
        tipoCodAut: "E",
        codAut: parseFloat(res.CAE)
    };
    const textoQR = btoa(JSON.stringify(qr));//codificamos lo que va en el QR
    const QR = await generarQR(textoQR);

    return {
        puntoVenta: puntoVenta,
        QR,
        numero:ultimaElectronica + 1,
        cae: res.CAE,
        vencimiento:res.CAEFchVto
    }
};

//Generamos el qr
async function generarQR(texto) {
    const qrCode = require('qrcode');
    const url = `https://www.afip.gob.ar/fe/qr/?p=${texto}`;
    const QR = await qrCode.toDataURL(url);
    return QR;
};

funciones.recorrerFlechas = (code)=>{
    if (code === 40 && seleccionado.nextElementSibling) {
        let aux = 0;
        let i = 0;
        const tds = document.querySelectorAll('.seleccionado td');

        for(let td of tds){
            if(td.classList.contains('subSeleccionado')){
                aux = i;
            }
            i++;
        }

        seleccionado && seleccionado.classList.remove('seleccionado');
        seleccionado = seleccionado.nextElementSibling;
        seleccionado.classList.add('seleccionado');


        subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');
        subSeleccionado = seleccionado.children[aux];
        subSeleccionado.classList.add('subSeleccionado');

    }else if(code === 38 && seleccionado.previousElementSibling){
        let aux = 0;
        let i = 0;
        const tds = document.querySelectorAll('.seleccionado td');

        for(let td of tds){
            if(td.classList.contains('subSeleccionado')){
                aux = i;
            }
            i++;
        }

        seleccionado && seleccionado.classList.remove('seleccionado');
        seleccionado = seleccionado.previousElementSibling;
        seleccionado.classList.add('seleccionado');

        subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');
        subSeleccionado = seleccionado.children[aux];
        subSeleccionado.classList.add('subSeleccionado');
    }else if(code === 37 && subSeleccionado.previousElementSibling){
        subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');
        subSeleccionado = subSeleccionado.previousElementSibling;
        subSeleccionado.classList.add('subSeleccionado');
    }else if(code === 39 && subSeleccionado.nextElementSibling){
        subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');
        subSeleccionado = subSeleccionado.nextElementSibling;
        subSeleccionado.classList.add('subSeleccionado');
    }
};

//devolvemos la ultimaFactura C y ultima Nota de credito C
funciones.ultimaC = async()=>{
    try {
        const facturaC = await afip.ElectronicBilling.getLastVoucher(puntoVenta,11); //Devuelve el número del último comprobante creado para el punto de venta 1 y el tipo de comprobante 6 (Factura B)
        const notaC = await afip.ElectronicBilling.getLastVoucher(puntoVenta,13);
        return {
            facturaC,
            notaC
        }
    } catch (error) {
        console.log(error)
        return {
            facturaC:0,
            notaC:0
        }
    }
}

funciones.ultimaAB = async()=>{
    try {
        const facturaA = await afip.ElectronicBilling.getLastVoucher(puntoVenta,1);
        const notaA = await afip.ElectronicBilling.getLastVoucher(puntoVenta,3);
        const facturaB = await afip.ElectronicBilling.getLastVoucher(puntoVenta,6);
        const notaB = await afip.ElectronicBilling.getLastVoucher(puntoVenta,8);
        return {
            facturaA,
            notaA,
            facturaB,
            notaB
        }
    } catch (error) {
        console.log(error)
        return {
            facturaA:0,
            notaA:0,
            facturaB:0,
            notaB:0,
        }
    }
}

funciones.ponerNumero = async()=>{
    sweet.fire({
        html:`
            <section id=imprimirVenta>
                <main>
                    <label htmlFor="tipo">Tipo</label>
                    <select name="tipo" id="tipo">
                        <option value="CD">Contado - ${(await axios.get(`${URL}numero`)).data.Contado}</option>
                        <option value="CC">Cuenta Corriente - ${(await axios.get(`${URL}numero`)).data["Cuenta Corriente"]}</option>
                        <option value="PP">Presupuesto - ${(await axios.get(`${URL}numero`)).data.Presupuesto}</option>
                        <option value="RC">Recibo - ${(await axios.get(`${URL}numero/Recibo`)).data}</option>
                    </select>
                </main>
                <main>
                    <label htmlFor="numero">Numero de Venta</label>
                    <input type="text" name="numero" id="numero" />
                </main>

            </section>
        `,
        showCancelButton:true,
        confirmButtonText:"Aceptar"
    }).then(async ({isConfirmed})=>{
        const tipo = document.getElementById('tipo');
        const numero = document.getElementById('numero');
        let cliente;
        let movimientos;
        let venta;
        let recibo;
        if (isConfirmed) {
            if (tipo.value === "PP") {
                venta = (await axios.get(`${URL}presupuesto/forNumber/${numero.value}`)).data;
            }else if (tipo.value === "RC"){
                recibo = (await axios.get(`${URL}recibo/id/${numero.value}`)).data;
            }else{
                venta = (await axios.get(`${URL}ventas/numeroYtipo/${numero.value}/${tipo.value}`)).data;
                if (!venta) {
                   venta = (await axios.get(`${URL}ventas/numeroYtipo/${numero.value}/T`)).data; 
                }
            }
            
            cliente = recibo 
                ? (await axios.get(`${URL}clientes/id/${recibo.idCliente}`)).data 
                : (await axios.get(`${URL}clientes/id/${venta.idCliente}`)).data;

            movimientos = (await axios.get(`${URL}movimiento/${numero.value}/${tipo.value}`)).data;
            if (movimientos.length === 0) {
                movimientos = (await axios.get(`${URL}movimiento/${numero.value}/T`)).data;
            }

            movimientos = tipo.value === "RC" ? (await axios.get(`${URL}movRecibo/forNumber/${numero.value}`)).data : movimientos;

            let situacion;
            if (venta) {
                if (venta.F) {
                    situacion = "blanco"
                }else{
                    situacion = "negro"
                }
            }else if (recibo){
                if (recibo.F) {
                    situacion = "blanco"
                }else{
                    situacion = "negro"
                }
            }

            if (recibo) {
                ipcRenderer.send('imprimir-recibo',[recibo,cliente,movimientos,false])    
            }else{
                ipcRenderer.send('imprimir',[situacion,venta,cliente,movimientos]);
            };
        }
    })
}

funciones.cargarVendedor = async()=>{
    const html = `
    <section>
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
    </section>
    `
    return html;
}

funciones.verificarUsuarios = async()=>{
    let retorno
    await sweet.fire({
        title: "Contraseña",
        input:"password",
        confirmButtonText:"Aceptar",
        showCancelButton:true
    }).then(async({isConfirmed,value})=>{
        if (isConfirmed) {
            retorno = ((await axios.get(`${URL}vendedores/id/${value}`)).data);
        }
    });
    return retorno
}

funciones.verNombrePc = async() => {
    require('hostname-patcher');
    const os = require('os');
    return os.hostname();
}

funciones.agregarMovimientoVendedores = async(descripcion,vendedor = "")=>{
    const movimiento = {};
    movimiento.descripcion = descripcion;
    movimiento.fecha = new Date();
    movimiento.vendedor = vendedor;

    await axios.post(`${URL}movVendedores`,movimiento)
};

//Vemos el codigo de comprobante para las faturas
funciones.verCodigoComprobante = async(notaCredito,cuit = "00000000",condIva)=>{
    if (archivo.condIva === "Monotributo") {
        if (notaCredito) {
            return 13
        }else{
            return 11
        }
    }else if(archivo.condIva === "Inscripto"){
        if (notaCredito) {
            if (cuit.length === 11 && condIva === "Inscripto") {
                return 3
            }else if(cuit.length === 11 && condIva !== "Inscripto"){
                return 8
            }else if(cuit.length === 8 && condIva !== "Inscripto"){
                return 8
            }else{
                await sweet.fire({
                    title:"No se puede hacer una Nota Credito B a un Inscripto"
                });
                return 0
            }
        }else{
            if (cuit.length === 11 && condIva === "Inscripto") {
                return 1
            }else if(cuit.length === 11 && condIva !== "Inscripto"){
                return 6
            }else if(cuit.length === 8 && condIva !== "Inscripto"){
                return 6
            }else{
                await sweet.fire({
                    title:"No se puede hacer una Factura B a un Inscripto"
                });
                return 0
            }
        }
    }
};

funciones.verTipoComprobante = async(codigo)=>{
    let retorno = "Comprobante";
    if (codigo === 1) {
        retorno = "Factura A";
    }else if(codigo === 3){
        retorno = "Nota Credito A";
    }else if(codigo === 6){
        retorno = "Factura B";
    }else if(codigo === 8){
        retorno = "Nota Credito B";
    }else if(codigo === 11){
        retorno = "Factura C";
    }else if(codigo === 13){
        retorno = "Nota Credito C";
    }
    return retorno
}

//Funcion que sirve para sacar el costo mas iva de los productos por si lo usamos
funciones.sacarCosto = (costo,costoDolar,impuesto=0,dolar)=>{
    if (costoDolar !== 0) {
        const retorno = redondear((costoDolar + costoDolar * impuesto / 100) * dolar,2);
        return retorno
    }else{
        const retorno = redondear(costo +(costo * impuesto / 100),2);
        return retorno
    }
}

funciones.verificarDatos = async ()=>{
    if (codigo.value === "") {
        await sweet.fire({title:"Poner un codigo al Proucto"});
        codigo.focus();
        return false;
    };

    if(descripcion.value === ""){
        await sweet.fire({title:"Poner una Descripcion al Producto"});
        descripcion.focus();
        return false;
    };

    if (stock.value === "") {
        await sweet.fire({title: "Poner un stock al producto"});
        stock.focus();
        return false;
    };

    if (costo.value === "") {
        await sweet.fire({title: "Poner un costo en pesos al Producto"});
        costo.focus();
        return false;
    };

    if (costoDolar.value === "") {
        await sweet.fire({title: "Poner un costo en Dolar al Producto"});
        costoDolar.focus();
        return false;
    };

    if (ganancia.value === "") {
        await sweet.fire({title: "Poner una Ganancia al Producto"});
        ganancia.focus();
        return false;
    };

    if (total.value === "") {
        await sweet.fire({title: "Poner un Total al Producto"});
        ganancia.focus();
        return false;
    };

    return true;
};

funciones.diferenciaObjetoServicio = async(objeto1, objeto2) => {
    let retorno = "";
    if (objeto1.cliente !== objeto2.cliente) {
        retorno += `Se cambio el cliente de ${objeto1.cliente} a ${objeto2.cliente}`;
    }else if(objeto1.producto !== objeto2.producto){
        retorno += `Se cambio el producto de ${objeto1.producto} a ${objeto2.producto}`;
    }else if(objeto1.marca !== objeto2.marca){
        
    };
};

module.exports = funciones;