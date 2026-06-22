const { ipcRenderer } = require('electron');

const sweet = require('sweetalert2');

ipcRenderer.send('poner-cierre');

const { ponerNumero, cargarVendedor, verificarUsuarios } = require('./helpers');
const { getVendedores, postVendedor } = require('./services/vendedorService');
const funciones = require('./helpers');

const ventas = document.querySelector('.ventas');
const clientes = document.querySelector('.clientes');
const caja = document.querySelector('.caja');
const productos = document.querySelector('.productos');
const consulta = document.querySelector('.consulta');
const recibo = document.querySelector('.recibo');
const remitos = document.querySelector('.remitos');
const servicioTecnico = document.querySelector('.servicioTecnico');

const atajoVentas = document.getElementById('atajoVentas');
const atajoAgregarCliente = document.getElementById('atajoAgregarCliente');
const atajoAgregarProducto = document.getElementById('atajoAgregarProducto');
const atajoNotaCredito = document.getElementById('atajoNotaCredito');

let verVendedores;

const navegarConAutenticacion = async (ruta, opciones = {}) => {
  const vendedor = await verificarUsuarios();

  if (!vendedor) {
    await sweet.fire({ title: 'Contraseña Incorrecta' });
    return false;
  }

  //Validacion de permisos si es necesario
  if (opciones.requirePermisosAdmin && vendedor.permiso !== 0) {
    await sweet.fire({ title: 'No tiene Permisos para ingresar a Caja' });
    return false;
  }

  //construir query params
  const params = new URLSearchParams({
    vendedor: opciones.usarNombre ? vendedor.nombre : vendedor._id,
    ...(opciones.incluirPermiso && { permiso: vendedor.permiso }),
  });

  location.href = `${ruta}?${params.toString()}`;

  if (opciones.sacarCierre) {
    ipcRenderer.send('sacar-cierre');
  }
  return true;
};

window.addEventListener('load', async (e) => {
  const vendedores = await getVendedores();
  if (!vendedores.find((vendedor) => vendedor.permiso === 0)) {
    sweet
      .fire({
        title: 'Cargar un Vendedor con permiso en 0 inicial',
        html: await cargarVendedor(),
        confirmButtonText: 'Aceptar',
        showCancelButton: true,
      })
      .then(async ({ isConfirmed }) => {
        if (isConfirmed) {
          const nuevoVendedor = {};
          nuevoVendedor.codigo = document.getElementById('codigo').value;
          nuevoVendedor.nombre = document.getElementById('nombre').value.toUpperCase();
          nuevoVendedor.permiso = document.getElementById('permisos').value;
          await postVendedor(nuevoVendedor);
        } else {
          location.reload();
        }
      });
  }

  const modulos = funciones.modulos();

  if (modulos.ventas) {
    ventas.classList.remove('hidden');
    atajoVentas.classList.remove('hidden');
    atajoNotaCredito.classList.remove('hidden');
  }
  if (modulos.clientes) {
    clientes.classList.remove('hidden');
    atajoAgregarCliente.classList.remove('hidden');
  }
  if (modulos.productos) {
    productos.classList.remove('hidden');
    atajoAgregarProducto.classList.remove('hidden');
    atajoCambioProducto.classList.remove('hidden');
  }
  if (modulos.caja) {
    caja.classList.remove('hidden');
  }
  if (modulos.consultas) {
    consulta.classList.remove('hidden');
  }
  if (modulos.recibos) {
    recibo.classList.remove('hidden');
  }
  if (modulos.remitos) {
    remitos.classList.remove('hidden');
  }
  if (modulos.servicioTecnico) {
    servicioTecnico.classList.remove('hidden');
  }
});

//Al tocar el atajo de teclado, abrimos ventanas
document.addEventListener('keyup', async (e) => {
  if (e.keyCode === 112) {
    ventas.click();
  } else if (e.keyCode === 113) {
    const opciones = {
      path: 'clientes/agregarCliente.html',
      ancho: 1200,
      altura: 500,
    };
    ipcRenderer.send('abrir-ventana', opciones);
  } else if (e.keyCode === 114) {
    const opciones = {
      path: 'productos/agregarProducto.html',
      ancho: 1200,
      altura: 550,
    };
    ipcRenderer.send('abrir-ventana', opciones);
  } else if (e.keyCode === 117) {
    const vendedor = await verificarUsuarios();
    if (!vendedor) {
      await sweet.fire({
        title: 'Contraseña incorrecta',
      });
      return;
    }
    location.href = `./venta/index.html?tipoFactura=notaCredito&vendedor=${vendedor._id}`;
    ipcRenderer.send('sacar-cierre');
  }
});

const setupIPCHandlers = () => {
  ipcRenderer.on('poner-numero', async (e, args) => {
    ponerNumero();
  });

  ipcRenderer.on('libroIva', async (e, args) => {
    location.href = './libroIva/libroIva.html';
  });

  ipcRenderer.on('verificarUsuario', async (e, args) => {
    let path = '';
    const { permiso, nombre, _id } = await verificarUsuarios();

    if (args === 'numeros') {
      path = `numeros/numeros.html`;
    } else if (args === 'infoVendedores') {
      path = 'vendedores/vendedores.html';
    } else if (args === 'movVendedores') {
      path = 'vendedores/movimientoVendedores.html';
    }

    if (permiso === 0) {
      ipcRenderer.send('abrir-ventana', {
        path: path,
        ancho: 1000,
        altura: 700,
        info: _id,
      });
    } else if (permiso === 1 && args === 'numeros') {
      ipcRenderer.send('abrir-ventana', {
        path: path,
        ancho: 1000,
        altura: 700,
        info: nombre,
      });
    } else {
      await sweet.fire({
        title: 'No tiene Permisos',
      });
    }
  });

  ipcRenderer.on('configuracionModulos', async () => {
    const { value, isConfirmed } = await sweet.fire({
      title: 'Ingrese Contraseña',
      input: 'password',
      showCancelButton: true,
    });

    if (value === '2580Repetto2580') {
      const options = {
        path: 'configuracion/modulos.html',
        altura: 700,
        ancho: 700,
        reinicio: true,
      };

      ipcRenderer.send('abrir-ventana', options);
    }
  });
};

setupIPCHandlers();

ventas.addEventListener('click', async (e) => {
  navegarConAutenticacion('./venta/index.html', {
    usarNombre: false,
    incluirPermiso: false,
    sacarCierre: true,
  });
});

clientes.addEventListener('click', async (e) => {
  navegarConAutenticacion('./clientes/clientes.html', {
    usarNombre: false,
    incluirPermiso: true,
    sacarCierre: true,
  });
});

productos.addEventListener('click', async (e) => {
  navegarConAutenticacion('./productos/productos.html', {
    usarNombre: true,
    incluirPermiso: true,
    sacarCierre: true,
  });
});

caja.addEventListener('click', async (e) => {
  navegarConAutenticacion('./caja/caja.html', {
    usarNombre: true,
    incluirPermiso: true,
    sacarCierre: true,
    requirePermisosAdmin: true,
  });
});

consulta.addEventListener('click', async (e) => {
  navegarConAutenticacion('./consultarCuenta/consultarCuenta.html', {
    usarNombre: false,
    incluirPermiso: false,
    sacarCierre: true,
  });
});

recibo.addEventListener('click', async (e) => {
  navegarConAutenticacion('./recibo/recibo.html', {
    usarNombre: false,
    incluirPermiso: false,
    sacarCierre: true,
  });
});

remitos.addEventListener('click', async (e) => {
  navegarConAutenticacion('./remitos/remitos.html', {
    usarNombre: false,
    incluirPermiso: false,
    sacarCierre: true,
  });
});

servicioTecnico.addEventListener('click', async (e) => {
  navegarConAutenticacion('./servicioTecnico/servicio.html', {
    usarNombre: false,
    incluirPermiso: true,
    sacarCierre: true,
  });
});
