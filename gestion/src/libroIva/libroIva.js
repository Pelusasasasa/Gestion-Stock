const axios = require('axios');
require('dotenv').config();
const URL = process.env.GESTIONURL;

const desde = document.getElementById('desde');
const hasta = document.getElementById('hasta');

const tbody = document.querySelector('tbody');

const salir = document.getElementById('salir');

let ventas;

window.addEventListener('load',e=>{
    const date = (new Date()).toISOString().slice(0,10);
    desde.value = date;
    hasta.value = date;
});

desde.addEventListener('keypress',async e=>{
    if (e.keyCode === 13) {
        hasta.focus()
        ventas = (await axios.get(`${URL}ventas/porFecha/${desde.value}/${hasta.value}`)).data;
        listar(ventas);
    }
});

hasta.addEventListener('keypress',async e=>{
    if (e.keyCode === 13) {
        ventas = (await axios.get(`${URL}ventas/porFecha/${desde.value}/${hasta.value}`)).data;
        listar(ventas);
    }
});

const listar = async(ventas)=>{
    ventas.sort((a,b)=>{
        if (a.fecha > b.fecha) {
            return 1;
        }else if(a.fecha < b.fecha){
            return -1;
        };
        return 0
    });

    tbody.innerHTML = "";
    let dia = ventas[0].fecha.slice(0,10).split('-',3)[2];
    let totalGravado21 = 0;
    let totalGravado105 = 0;
    let totalIva21 = 0;
    let totalIva105 = 0;
    let total = 0;
    let totalNotaCredito = 0;
    let totalFacturas = 0;
    let totalGravado21Nota = 0;
    let totalIva21Nota = 0;
    let totalGravado105Nota = 0;
    let totalIva105Nota = 0;
    let totalGravado21Fact = 0;
    let totalIva21Fact = 0;
    let totalGravado105Fact = 0;
    let totalIva105Fact = 0;
     
    const cargarTotales = (venta)=>{
        const tr = document.createElement('tr');

        const td1 = document.createElement('td');
        const td2 = document.createElement('td');
        const td3 = document.createElement('td');
        const td4 = document.createElement('td');
        const td5 = document.createElement('td');
        const tdTexto = document.createElement('td');
        const tdTotalGravado21 = document.createElement('td');
        const tdTotalGravado105 = document.createElement('td');
        const tdTotalIva21 = document.createElement('td');
        const tdTotalIva105 = document.createElement('td');
        const tdTotal = document.createElement('td');

        tdTexto.innerHTML = "Totales Diarios";
        tdTotalGravado21.innerHTML = totalGravado21.toFixed(2);
        tdTotalGravado105.innerHTML = totalGravado105.toFixed(2);
        tdTotalIva21.innerHTML = totalIva21.toFixed(2);
        tdTotalIva105.innerHTML = totalIva105.toFixed(2);
        tdTotal.innerHTML = total.toFixed(2);

        tdTotalGravado21.classList.add('text-rigth');
        tdTotalGravado105.classList.add('text-rigth');
        tdTotalIva21.classList.add('text-rigth');
        tdTotalIva105.classList.add('text-rigth');
        tdTotal.classList.add('text-rigth');

        tdTexto.classList.add('text-bold');
        tdTotalGravado21.classList.add('text-bold');
        tdTotalGravado105.classList.add('text-bold');
        tdTotalIva21.classList.add('text-bold');
        tdTotalIva105.classList.add('text-bold');
        tdTotal.classList.add('text-bold');


        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tr.appendChild(tdTexto);
        tr.appendChild(tdTotalGravado21);
        tr.appendChild(tdTotalIva21);
        tr.appendChild(tdTotalGravado105);
        tr.appendChild(tdTotalIva105);
        tr.appendChild(tdTotal);

        tbody.appendChild(tr);

        const trNotaCredito = document.createElement('tr');
        const trFactura = document.createElement('tr');
        
        const td1Nota = document.createElement('td');
        const td2Nota = document.createElement('td');
        const td3Nota = document.createElement('td');
        const td4Nota = document.createElement('td');
        const td5Nota = document.createElement('td');
        const textoNotaCredito = document.createElement('td');
        const tdTotalNotaCredito = document.createElement('td');
        const tdTotalGravado21Nota = document.createElement('td');
        const tdTotalIva21Nota = document.createElement('td');
        const tdTotalGravado105Nota = document.createElement('td');
        const tdTotalIva105Nota = document.createElement('td');

        textoNotaCredito.innerHTML = "Totales Nota Credito";
        console.log(totalNotaCredito)
        tdTotalNotaCredito.innerHTML = (totalNotaCredito * -1).toFixed(2);
        tdTotalGravado21Nota.innerHTML = (totalGravado21Nota * -1).toFixed(2);
        tdTotalIva21Nota.innerHTML = (totalIva21Nota * -1).toFixed(2);
        tdTotalGravado105Nota.innerHTML = (totalGravado105Nota *-1).toFixed(2);
        tdTotalIva105Nota.innerHTML = (totalIva105Nota * -1).toFixed(2);

        textoNotaCredito.classList.add('text-bold');
        tdTotalNotaCredito.classList.add('text-bold');
        tdTotalGravado21Nota.classList.add('text-bold');
        tdTotalIva21Nota.classList.add('text-bold');
        tdTotalGravado105Nota.classList.add('text-bold');
        tdTotalIva105Nota.classList.add('text-bold');
        textoNotaCredito.classList.add('text-bold');

        tdTotalNotaCredito.classList.add('text-rigth');
        tdTotalGravado21Nota.classList.add('text-rigth');
        tdTotalIva21Nota.classList.add('text-rigth');
        tdTotalGravado105Nota.classList.add('text-rigth');
        tdTotalIva105Nota.classList.add('text-rigth');

        trNotaCredito.appendChild(td1Nota);
        trNotaCredito.appendChild(td2Nota);
        trNotaCredito.appendChild(td3Nota);
        trNotaCredito.appendChild(td4Nota);
        trNotaCredito.appendChild(td5Nota);
        trNotaCredito.appendChild(textoNotaCredito);
        trNotaCredito.appendChild(tdTotalGravado21Nota);
        trNotaCredito.appendChild(tdTotalIva21Nota);
        trNotaCredito.appendChild(tdTotalGravado105Nota);
        trNotaCredito.appendChild(tdTotalIva105Nota);
        trNotaCredito.appendChild(tdTotalNotaCredito);

        const td1Fact = document.createElement('td');
        const td2Fact = document.createElement('td');
        const td3Fact = document.createElement('td');
        const td4Fact = document.createElement('td');
        const td5Fact = document.createElement('td');
        const textoFactura = document.createElement('td');
        const tdTotalGravado21Fact = document.createElement('td');
        const tdTotalIva21Fact = document.createElement('td');
        const tdTotalGravado105Fact = document.createElement('td');
        const tdTotalIva105Fact = document.createElement('td');
        const tdTotalFact = document.createElement('td');
        
        textoFactura.classList.add('text-bold');
        tdTotalGravado21Fact.classList.add('text-bold');
        tdTotalIva21Fact.classList.add('text-bold');
        tdTotalGravado105Fact.classList.add('text-bold');
        tdTotalIva105Fact.classList.add('text-bold');
        tdTotalFact.classList.add('text-bold');
        textoFactura.classList.add('text-bold');

        tdTotalGravado21Fact.classList.add('text-rigth');
        tdTotalIva21Fact.classList.add('text-rigth');
        tdTotalGravado105Fact.classList.add('text-rigth');
        tdTotalIva105Fact.classList.add('text-rigth');
        tdTotalFact.classList.add('text-rigth');

        textoFactura.innerHTML = "Totales Facturas";
        tdTotalGravado21Fact.innerHTML = (totalGravado21Fact).toFixed(2);
        tdTotalIva21Fact.innerHTML = (totalIva21Fact).toFixed(2);
        tdTotalGravado105Fact.innerHTML = (totalGravado105Fact).toFixed(2);
        tdTotalIva105Fact.innerHTML = (totalIva105Fact).toFixed(2);
        tdTotalFact.innerHTML = (totalFacturas).toFixed(2);

        trFactura.appendChild(td1Fact);
        trFactura.appendChild(td2Fact);
        trFactura.appendChild(td3Fact);
        trFactura.appendChild(td4Fact);
        trFactura.appendChild(td5Fact);
        trFactura.appendChild(textoFactura);
        trFactura.appendChild(tdTotalGravado21Fact);
        trFactura.appendChild(tdTotalIva21Fact);
        trFactura.appendChild(tdTotalGravado105Fact);
        trFactura.appendChild(tdTotalIva105Fact);
        trFactura.appendChild(tdTotalFact);

        tbody.appendChild(trNotaCredito);
        tbody.appendChild(trFactura);

        totalGravado21 = 0;
        totalGravado105 = 0;
        totalIva21 = 0;
        totalIva105 = 0;
        total = 0;
        totalGravado21Fact = 0;
        totalIva21Fact = 0;
        totalGravado105Fact = 0;
        totalIva105Fact = 0;
        totalFacturas = 0;
        totalNotaCredito = 0;
        totalGravado21Nota = 0;
        totalIva21Nota = 0;
        totalGravado105Nota = 0;
        totalIva105Nota = 0;
    };

    for await(let venta of ventas){
        if (venta.fecha.slice(0,10).split('-',3)[2] !== dia) {
            cargarTotales(venta);
        };

        const tr = document.createElement('tr');

        const tdFecha = document.createElement('td');
        const tdCliente = document.createElement('td');
        const tdCondIva = document.createElement('td');
        const tdCuit = document.createElement('td');
        const tdTipo = document.createElement('td');
        const tdNumero = document.createElement('td');
        const tdGravado21 = document.createElement('td');
        const tdIva21 = document.createElement('td');
        const tdGravado105 = document.createElement('td');
        const tdIva105 = document.createElement('td');
        const tdTotal = document.createElement('td');

        totalGravado21 += (venta.tipo_comp === "Nota Credito B" || venta.tipo_comp === "Nota Credito A" ) ? venta.gravado21 * -1 : venta.gravado21;
        totalGravado105 += (venta.tipo_comp === "Nota Credito B" || venta.tipo_comp === "Nota Credito A" ) ? venta.gravado105 * -1 : venta.gravado105;
        totalIva21 += (venta.tipo_comp === "Nota Credito B" || venta.tipo_comp === "Nota Credito A" ) ? venta.iva21 * -1 : venta.iva21;
        totalIva105 += (venta.tipo_comp === "Nota Credito B" || venta.tipo_comp === "Nota Credito A" ) ? venta.iva105 * -1 : venta.iva105;
        total += (venta.tipo_comp === "Nota Credito B" || venta.tipo_comp === "Nota Credito A" ) ? venta.precio * -1 : venta.precio;
        if (venta.tipo_comp === "Nota Credito B" || venta.tipo_comp === "Nota Credito A") {
            totalNotaCredito += venta.precio;
            totalGravado21Nota += venta.gravado21;
            totalIva21Nota += venta.iva21;
            totalGravado105Nota += venta.gravado105;
            totalIva105Nota += venta.iva105;
        }else{
            totalFacturas += venta.precio;
            totalGravado21Fact += venta.gravado21;
            totalIva21Fact += venta.iva21;
            totalGravado105Fact += venta.gravado105;
            totalIva105Fact += venta.iva105;
        }

        tdFecha.innerHTML = venta.fecha.slice(0,10);
        tdCliente.innerHTML = venta.cliente;
        tdCondIva.innerHTML = venta.condicionIva;
        tdCuit.innerHTML = venta.num_doc;
        tdTipo.innerHTML = venta.tipo_comp;
        tdNumero.innerHTML = venta.afip.puntoVenta.padStart(4,'0') + "-" + venta.afip.numero.toString().padStart(8,'0');
        tdGravado21.innerHTML = (venta.tipo_comp === "Nota Credito A" || venta.tipo_comp === "Nota Credito B") ? (venta.gravado21 * -1).toFixed(2) : venta.gravado21.toFixed(2);
        tdGravado105.innerHTML = (venta.tipo_comp === "Nota Credito A" || venta.tipo_comp === "Nota Credito B") ? (venta.gravado105 * -1).toFixed(2) : venta.gravado105.toFixed(2);
        tdIva21.innerHTML = (venta.tipo_comp === "Nota Credito A" || venta.tipo_comp === "Nota Credito B") ? (venta.iva21 * -1).toFixed(2) : venta.iva21.toFixed(2);
        tdIva105.innerHTML = (venta.tipo_comp === "Nota Credito A" || venta.tipo_comp === "Nota Credito B") ? (venta.iva105 * -1).toFixed(2) : venta.iva105.toFixed(2);
        tdTotal.innerHTML = (venta.tipo_comp === "Nota Credito A" || venta.tipo_comp === "Nota Credito B") ? (venta.precio * -1).toFixed(2) : venta.precio.toFixed(2);

        tdGravado21.classList.add('text-rigth');
        tdGravado105.classList.add('text-rigth');
        tdIva21.classList.add('text-rigth');
        tdIva105.classList.add('text-rigth');
        tdTotal.classList.add('text-rigth');

        tr.appendChild(tdFecha);
        tr.appendChild(tdCliente);
        tr.appendChild(tdCondIva);
        tr.appendChild(tdCuit);
        tr.appendChild(tdTipo);
        tr.appendChild(tdNumero);
        tr.appendChild(tdGravado21);
        tr.appendChild(tdIva21);
        tr.appendChild(tdGravado105);
        tr.appendChild(tdIva105);
        tr.appendChild(tdTotal);
        
        tbody.appendChild(tr);

    };
    cargarTotales(ventas.at(-1))
};

salir.addEventListener('click',e=>{
    location.href = '../menu.html';
});

document.addEventListener('keyup',e=>{
    if(e.keyCode === 27){
        location.href = '../menu.html';
    }
})