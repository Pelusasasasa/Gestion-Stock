let XLSX = require('xlsx')
let ventas = [];
let alicuotas = [];
let nombreArchivoVentas;
let nombreArchivoAlicuotas;
let selectedFile;

const axios = require('axios');
require('dotenv').config();
const URL = process.env.GESTIONURL

window.addEventListener('load', async e=>{
    let mes = new Date().getMonth();
    let datos = (await axios.get(`${URL}ventas/mes/${mes}`)).data.filter(elem => elem.F === true);
    let recibos = (await axios.get(`${URL}recibo/mes/${mes}`)).data.filter(elem => elem.tipo_venta === "T");
    // console.log(recibos)

    for await(let {fecha,cod_comp,tipo_comp,cliente,afip,cod_doc,num_doc,precio,cantIva,gravado21,iva21,gravado105,iva105,gravado0} of datos){
        if (gravado21 === 0 && gravado105 === 0) {
            gravado21 = parseFloat((precio / 1.21).toFixed(2));
            iva21 = parseFloat((gravado21 * 21 / 100).toFixed(2));
        };
        
        const arregloFecha = fecha.slice(0,10).split('-',3);
        const dia = arregloFecha[2];
        const mes = arregloFecha[1];
        const anio = arregloFecha[0];
        nombreArchivoVentas = `${new Date(parseFloat(`${mes}/${dia}/${anio}`)).toLocaleString("es-AR", { month: "long" })} - ${(new Date(`${mes}/${dia}/${anio}`)).getFullYear()}Ventas.txt`;
        nombreArchivoAlicuotas = `${new Date(parseFloat(`${mes}/${dia}/${anio}`)).toLocaleString("es-AR", { month: "long" })} - ${(new Date(`${mes}/${dia}/${anio}`)).getFullYear()}Alicuotas.txt`;

        const Cod_comp = cod_comp.toString().padStart(3,'0');
        const PuntoVenta = afip.puntoVenta.toString().padStart(5,'0');
        const NumeroComp = afip.numero.toString().padStart(20,'0');
        const TipoDni = cod_doc;
        const NumDoc = num_doc.padStart(20,'0');
        const total = precio.toFixed(2).split('.',2);
        const Entero = total[0].padStart(13,'0');
        const Decimal = total[1].padStart(2,0);
        const Tipo_comp = tipo_comp.padStart(20,'0');
        const Cliente =  cliente ? cliente.padEnd(30," ") : "Consumidor Final".padEnd(30," ");
        const venta = anio + mes + dia + Cod_comp + PuntoVenta + NumeroComp + NumeroComp + TipoDni + NumDoc + Cliente + Entero 
        + Decimal + "".padStart(105,'0')+"PES0001000000"+ cantIva +"".padEnd(24,'0');
        ventas.push(`${venta}\n`);


        const Gravado21Total = gravado21.toFixed(2).split('.',2);
        const Gravado21Entero = Gravado21Total[0].padStart(13,'0');
        const Gravado21Decimal = Gravado21Total[1].padStart(2,0);

        const Gravado105Total = gravado105.toFixed(2).split('.',2);
        const Gravado105Entero = Gravado105Total[0].padStart(13,'0');
        const Gravado105Decimal = Gravado105Total[1].padStart(2,0);
        
        const Iva21Total = iva21.toFixed(2).split('.',2);
        const Iva21Entero = Iva21Total[0].padStart(13,0);
        const Iva21Decimal = Iva21Total[1].padStart(2,0);
        
        const Iva105Total = iva105.toFixed(2).split('.',2);
        const Iva105Entero = Iva105Total[0].padStart(13,0);
        const Iva105Decimal = Iva105Total[1].padStart(2,0);
        

        if (gravado21 !== 0 ) {
            const alicuota = Cod_comp + PuntoVenta + NumeroComp + Gravado21Entero + Gravado21Decimal + "0005" + Iva21Entero + Iva21Decimal;
            alicuotas.push(`${alicuota}\n`);
        };
        
        if (gravado105 !== 0 ) {
            const alicuota = Cod_comp + PuntoVenta + NumeroComp + Gravado105Entero + Gravado105Decimal + "0004" + Iva105Entero + Iva105Decimal;
            alicuotas.push(`${alicuota}\n`);
        };
    };

    for await(let {fecha,cod_comp,tipo_comp,cliente,afip,cod_doc,num_doc,precio,cantIva,gravado21,iva21} of recibos){
        console.log(fecha)
        const arregloFecha = fecha.slice(0,10).split('-',3);
        const dia = arregloFecha[2];
        const mes = arregloFecha[1];
        const anio = arregloFecha[0];

        const Cod_comp = cod_comp.toString().padStart(3,'0');
        const PuntoVenta = afip ? afip.puntoVenta.toString().padStart(5,'0') : "00007";
        const NumeroComp = afip ? afip.numero.toString().padStart(20,'0') : "".padStart(20,'0');
        const TipoDni = cod_doc;
        const NumDoc = num_doc.padStart(20,'0');
        const Cliente =  cliente ? cliente.padEnd(30," ") : "Consumidor Final".padEnd(30," ");
        const total = precio.toFixed(2).split('.',2);
        const Entero = total[0].padStart(13,'0');
        const Decimal = total[1].padStart(2,0);
        

        const venta = anio + mes + dia + Cod_comp + PuntoVenta + NumeroComp + NumeroComp + TipoDni + NumDoc + Cliente + Entero + Decimal + "".padStart(105,'0')+"PES0001000000"+ cantIva +"".padEnd(24,'0');
        ventas.push(`${venta}\n`);
    }
});

const generarTexto = async(lista)=>{
    return new Blob(lista,{type:'text/plain'});
};

const descargarArchivo = async(contenidoBlob,nombreArchivo)=>{
    let reader = new FileReader();
    reader.onload = function (event) {
        let save = document.createElement('a');
        save.href = event.target.result;
        save.target = '_blank';
        save.download = nombreArchivo || 'archivo.dat';
        let clicEvent = new MouseEvent('click',{
            'view':window,
            'bubbles':true,
            'cancelable':true
        });
        save.dispatchEvent(clicEvent);
        (window.URL || window.webkitURL).revokeObjectURL(save.href);
    }
    console.log(contenidoBlob)
    reader.readAsDataURL(contenidoBlob);
}

document.querySelector('.venta').addEventListener('click',async e=>{
    descargarArchivo(await generarTexto(ventas),nombreArchivoVentas)
});


document.querySelector('.alicuota').addEventListener('click',async e=>{
    descargarArchivo(await generarTexto(alicuotas),nombreArchivoAlicuotas)
});