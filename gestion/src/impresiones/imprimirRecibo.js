const { ipcRenderer } = require("electron");

const numeroRecibo = document.getElementById('numeroRecibo');
const date = document.getElementById('fecha');
const nombre = document.getElementById('nombre');
const codigo = document.getElementById('codigo');
const cuit = document.getElementById('cuit');
const dni = document.getElementById('dni');
const direccion = document.getElementById('direccion');
const localidad = document.getElementById('localidad');
const iva = document.getElementById('iva');
const valores = document.getElementById('valores');
const total = document.getElementById('total');
const tbodyFormaPago = document.getElementById('tbodyFormaPago');

const tbody = document.getElementById('tbody');

let diferencia = 0;

ipcRenderer.on('imprimir-recibo', listar);

async function listar(e, args) {
    const [recibo, cliente, lista] = JSON.parse(args);
    await listarDatosRecibo(recibo);
    await listarCliente(cliente);
    await listarcomprobantes(lista);
    ipcRenderer.send('imprimir-ventana');
}

function listarDatosRecibo(recibo) {
    const fecha = new Date(recibo.fecha);
    const fechaUTC3 = new Date(fecha.getTime() - 3 * 60 * 60 * 1000).toISOString();
    const fechaParseada = `${fechaUTC3.slice(0, 10).split('-', 3).reverse().join('/')} ${fechaUTC3.slice(11, 19)}`;

    date.innerText = fechaParseada;
    numeroRecibo.innerText = "R" + recibo.numero;

    diferencia += recibo.retencion?.map(retencion => retencion.importe).reduce((acc, retencion) => acc + retencion, 0) ?? 0;
    

    // Suma de importes de cheques
    diferencia += recibo?.cheques ? recibo.cheques.reduce((acc, cheque) => acc + (cheque.importe || 0), 0) : 0;
    diferencia += recibo?.tarjetas ? recibo.tarjetas.reduce((acc, tarjeta) => acc + (tarjeta.importe || 0), 0) : 0;


    tbodyFormaPago.innerHTML += `
        ${recibo.retencion && recibo.retencion.length > 0 ?
            recibo.retencion.map(retencion => `
                <tr>
                    <td>RETENCIONES</td>
                    <td>${retencion.descripcion}</td>
                    <td class='font-bold'>$${retencion.importe.toFixed(2)}</td>
                </tr>
            `).join('')
            : ''
        }
        ${recibo.cheques ? recibo?.cheques?.map(cheque => `
                <tr class="mx-2">
                    <td>CHEQUE</td>
                    <td>${cheque.numero}</td>
                    <td class="font-bold">$${cheque.importe.toFixed(2)}</td>
                </tr>
            `).join('')
            : ''
        }
        ${recibo.tarjetas ? recibo?.tarjetas?.map(tarjeta => `
                <tr class="mx-2">
                    <td>TARJETA</td>
                    <td>${tarjeta.tarjeta?.nombre ?? ''}</td>
                    <td class="font-bold">$${tarjeta.importe.toFixed(2)}</td>
                </tr>
            `).join('')
            : ''
        }

        ${diferencia === recibo.precio
            ? ''
            : `<tr>
                <td>EFECTIVO</td>
                <td></td>
                <td class='font-bold'>$${(recibo.precio - diferencia).toFixed(2)}</td>
            </tr>`
        }
`
};

function listarCliente(cliente) {
    nombre.innerText = cliente.nombre;
    codigo.innerText = (cliente._id).toString().padStart(4, '0');
    cliente.cuit.length === 11 ? dni.parentElement.classList.add('none') : cuit.parentElement.classList.add('none')
    cuit.innerText = cliente.cuit;
    dni.innerText = cliente.cuit;
    direccion.innerText = cliente.direccion;
    localidad.innerText = cliente.localidad;
    iva.innerText = cliente.condicionIva;
};

function listarcomprobantes(lista) {

    lista.map(elem => {
        tbody.innerHTML += `
    <tr>
                <td>${elem.fecha.slice(0, 10).split('-', 3).reverse().join('/')}</td>
                <td>${elem.tipo}</td>
                <td>${elem.numero.padStart(8, '0')}</td>
                <td>${elem.precio.toFixed(2)}</td>
                <td>${elem.saldo.toFixed(2)}</td>
            </tr >
    `
    })
};