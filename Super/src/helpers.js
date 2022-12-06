const funciones = {}
const Afip = require('@afipsdk/afip.js');
const { clipboard } = require('electron');
const afip = new Afip({CUIT:20416104655});

const sweet = require('sweetalert2');


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
    const fecha = new Date(Date.now()-((new Date()).getTimezoneOffset()*60000)).toISOString().split('T')[0];
    const serverStatus = await afip.ElectronicBilling.getServerStatus();

    console.log(serverStatus) // mostramos el estado del servidor

    let ultimaElectronica = await afip.ElectronicBilling.getLastVoucher('3',venta.cod_comp);
    console.log(ultimaElectronica);

    console.log(parseFloat(venta.facturaAnterior));
    let ventaAnterior = venta.facturaAnterior && await afip.ElectronicBilling.getVoucherInfo(parseFloat(venta.facturaAnterior),3,11);
    
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
        'ImpNeto':venta.precio,
        'ImpOpEx': 0,
        'ImpIVA': 0,
        'ImpTrib': 0,
        'MonId': 'PES',
        'PtoVta': 3,
        'MonCotiz' 	: 1,
    };

    notaCredito && (data.CbtesAsoc = [
        {
            "Tipo":ventaAnterior.CbteTipo,
            "PtoVta":ventaAnterior.PtoVta,
            "Nro":ventaAnterior.CbteHasta
        }
    ]);
    console.log(data)
    const res = await afip.ElectronicBilling.createVoucher(data); //creamos la factura electronica
    console.log(res)

    const qr = {
        ver: 1,
        fecha: fecha,
        cuit: 20416104655,
        ptoVta: 3,
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
        puntoVenta: 3,
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
}


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
        const facturaC = await afip.ElectronicBilling.getLastVoucher(3,11); //Devuelve el número del último comprobante creado para el punto de venta 1 y el tipo de comprobante 6 (Factura B)
        const notaC = await afip.ElectronicBilling.getLastVoucher(3,13);
        return {
            facturaC,
            notaC
        }
    } catch (error) {
        return {
            facturaC:0,
            notaC:0
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
        if (isConfirmed) {
            let venta = (await axios.get(`${URL}ventas/id/${numero.value}/${tipo.value}`)).data;
            if (!venta) {
               venta = (await axios.get(`${URL}ventas/id/${numero.value}/T`)).data; 
            }
            const cliente = (await axios.get(`${URL}clientes/id/${venta.idCliente}`)).data;
            let movimientos = (await axios.get(`${URL}movimiento/${numero.value}/${tipo.value}`)).data;
            if (movimientos.length === 0) {
                movimientos = (await axios.get(`${URL}movimiento/${numero.value}/T`)).data;
            }
            ipcRenderer.send('imprimir',[venta,cliente,movimientos])
        }
    })
}

module.exports = funciones;