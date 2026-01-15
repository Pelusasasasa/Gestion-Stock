const { parsearFecha } = require('../helpers');
const { getInfoImprimir } = require('../services/imprimirService');

const listarRemito = (elem) => {
  const fecha = parsearFecha(elem.fecha);
  const container = document.createElement('div');

  container.classList.add('remitoContainer');
  container.id = elem._id;

  const pFecha = document.createElement('p');
  const pCliente = document.createElement('p');
  const pNumero = document.createElement('p');
  const pObservaciones = document.createElement('p');
  const divPasar = document.createElement('div');
  const divReimprimir = document.createElement('div');

  divPasar.classList.add('w-100');
  pFecha.classList.add('w-100');
  pNumero.classList.add('w-100');
  divReimprimir.classList.add('w-100');

  pCliente.id = 'cliente';
  pObservaciones.id = 'observaciones';

  const inpPasar = document.createElement('input');
  const pPasado = document.createElement('p');
  const remitoNumero = document.createElement('p');

  divReimprimir.addEventListener('click', imprimirRemito);

  inpPasar.type = 'checkbox';
  inpPasar.name = 'pasar';
  inpPasar.id = elem._id;
  inpPasar.addEventListener('change', handleCheckbox);

  remitoNumero.innerText = elem.numero.toString().padStart(8, '0');
  remitoNumero.classList.add('numeroRemito');

  pPasado.innerText = 'PASADO';
  pPasado.classList.add('pasado');

  divReimprimir.addEventListener('click', async () => {
    const { ok, venta, movimientos, cliente } = await getInfoImprimir(elem._id, 'RT');
    if (ok) {
      ipcRenderer.send('imprimir', ['negro', venta, cliente, movimientos, false]);
    }
  });

  pFecha.innerText = fecha.slice(0, 10);
  pCliente.innerText = `${elem.cliente.length > 50 ? `${elem.cliente.slice(0, 50)}...` : elem.cliente}`;
  pObservaciones.innerText = elem.observaciones.slice(0, 20);
  divReimprimir.innerHTML = `
            <div class="icons">
                <span title="Imprimir" class="material-icons-outlined">print</span>
            </div>
        `;

  divPasar.appendChild(remitoC.checked ? pPasado : inpPasar);
  pNumero.appendChild(remitoNumero);

  container.appendChild(divPasar);
  container.appendChild(pFecha);
  container.appendChild(pNumero);
  container.appendChild(pCliente);
  container.appendChild(pObservaciones);
  container.appendChild(divReimprimir);

  return container;
};

const listarMov = (elem) => {
  const div = document.createElement('div');
  div.id = elem._id;
  div.classList.add('movContainer');

  const divTitle = document.createElement('div');
  const pCant = document.createElement('p');
  const pPrecio = document.createElement('p');
  const textAreaSeries = document.createElement('textArea');

  const pTitle = document.createElement('p');
  const pCodigo = document.createElement('p');

  pTitle.id = 'title';
  pCodigo.id = 'codigo';
  pCant.id = 'cant';
  pPrecio.id = 'precio';

  pTitle.innerText = elem.producto;
  pCodigo.innerText = `COD: ${elem.codProd}`;
  pCant.innerText = elem.cantidad.toFixed(2);
  pPrecio.innerText = `$${elem.precio.toFixed(2)}`;
  textAreaSeries.innerText = elem.series;

  divTitle.appendChild(pTitle);
  divTitle.appendChild(pCodigo);

  div.appendChild(divTitle);
  div.appendChild(pCant);
  div.appendChild(pPrecio);
  div.appendChild(textAreaSeries);

  return div;
};

const crearEncabezadoRem = () => {
  const div = document.createElement('div');
  div.classList.add('remitoContainer');

  const pEstado = document.createElement('p');
  const pFecha = document.createElement('p');
  const pNumero = document.createElement('p');
  const pCliente = document.createElement('p');
  const pObservaciones = document.createElement('p');

  pEstado.innerText = 'Estado';
  pFecha.innerText = 'Fecha';
  pNumero.innerText = 'N° Remito';
  pCliente.innerText = 'Cliente';
  pObservaciones.innerText = 'Observaciones';

  pCliente.id = 'cliente';
  pObservaciones.id = 'observaciones';

  div.appendChild(pEstado);
  div.appendChild(pFecha);
  div.appendChild(pNumero);
  div.appendChild(pCliente);
  div.appendChild(pObservaciones);

  return div;
};

const crearEncabezadoMov = () => {
  const div = document.createElement('div');
  div.classList.add('movContainer');

  const pTitle = document.createElement('p');
  const pCant = document.createElement('p');
  const pPrecio = document.createElement('p');
  const pSeries = document.createElement('p');

  pTitle.innerText = 'Producto';
  pCant.innerText = 'Cantidad';
  pPrecio.innerText = 'Precio';
  pSeries.innerText = 'Series';

  div.appendChild(pTitle);
  div.appendChild(pCant);
  div.appendChild(pPrecio);
  div.appendChild(pSeries);

  return div;
};

const modificarNroSerie = async (e) => {
  const valor = e.target.value.split('\n');
  const id = e.currentTarget.parentNode.parentNode.id;
  await patchMovNumeroSerie(id, valor);
};

const handleCheckbox = async (e) => {
  const codCliente = e.target.parentNode.parentNode.children[1].innerText;

  const inputs = document.querySelectorAll('td input');

  for (let elem of inputs) {
    if (elem.parentNode.parentNode.children[1].innerText !== codCliente) {
      elem.disabled = !elem.disabled;
    }
  }
};

const imprimirRemito = async (e) => {
  if (e.target.nodeName === 'BUTTON') {
    let cliente = '';
    const id = e.target.parentNode.parentNode.parentNode.id;
    const remito = await getRemitoById(id);
    ipcRenderer.send('imprimir', ['negro', remito, cliente, remito.movimientos, false]);
  }
};

module.exports = {
  crearEncabezadoRem,
  listarRemito,
  listarMov,
  crearEncabezadoMov,
};
