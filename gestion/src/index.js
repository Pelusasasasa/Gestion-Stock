const { dialog, app, BrowserWindow, Menu, ipcRenderer } = require('electron');
const { ipcMain } = require('electron/main');
const { mostrarMenu } = require('./menuSecundario/menuSecundario');
const { condIva } = require('./configuracion.json');
const path = require('path');
const modulos = require('./config.json');

require('dotenv').config();
// Lo usamos para cuando alla un cambio en la aplicacion se reinicie
if (process.env.NODE_ENV === 'desarrollo') {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
  })
};

if (require('electron-squirrel-startup')) {
  app.quit();
};

global.ventanaPrincipal = null;
global.nuevaVentana = null;

const createWindow = () => {
  // Create the browser window.
  ventanaPrincipal = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });
  ventanaPrincipal.maximize();

  // and load the index.html of the app.
  ventanaPrincipal.loadFile(path.join(__dirname, 'menu.html'));

  hacerMenu();
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

const arreglarSaldo = (e, args) => {
  ventanaPrincipal.webContents.send('saldoArreglado', args);
};

ipcMain.on('arreglarSaldo', arreglarSaldo);

ipcMain.on('enviar', (e, args) => {
  ventanaPrincipal.webContents.send('recibir', JSON.stringify(args));
});

ipcMain.on('sacar-cierre', e => {
  ventanaPrincipal.setClosable(false);
});

ipcMain.on('poner-cierre', e => {
  ventanaPrincipal.setClosable(true);
});

//Si necesitamos mandar informacion de una ventana secundaria a una principal usamos este metodo
ipcMain.on('send-ventanaPrincipal', (e, args) => {
  ventanaPrincipal.webContents.send('informacion', args);
});

ipcMain.on('abrir-ventana', (e, args) => {
  abrirVentana(args.path, args.altura, args.ancho, args.reinicio);
  nuevaVentana.on('ready-to-show', async () => {
    nuevaVentana.webContents.send('informacion', args)
  })
});

ipcMain.on('enviar-ventana-principal', (e, args) => {
  ventanaPrincipal.webContents.send('recibir-ventana-secundaria', JSON.stringify(args));
});

ipcMain.on('imprimir', (e, args) => {
  if (args[0] === "blanco") {
    abrirVentana("ticket/ticket.html", 1000, 500);
  } else {
    abrirVentana("impresiones/imprimirComprobante.html", 600, 900, false, args[5]);
  }
  nuevaVentana.webContents.on('did-finish-load', function () {
    nuevaVentana.webContents.send('imprimir', JSON.stringify(args));
  });
});

ipcMain.on('imprimir-recibo', (e, args) => {
  const [, , , show] = args;
  abrirVentana("impresiones/imprimirRecibo.html", 800, 500, false, show);
  nuevaVentana.webContents.on('did-finish-load', function () {
    nuevaVentana.webContents.send('imprimir-recibo', JSON.stringify(args));
  })
})

ipcMain.on('imprimir-ventana', (e, args) => {
  const option = {};
  option.silent = false;
  option.deviceName = args === "blanco" && "SAM4S GIANT-100";
  nuevaVentana.webContents.print(option, (success, errorType) => {
    if (success) {
      ventanaPrincipal.focus();
      nuevaVentana.close();
    } else {
      ventanaPrincipal.focus();
      nuevaVentana && nuevaVentana.close();
    };
  });
});

ipcMain.on('imprimir-historica', (e, info) => {
  abrirVentana('impresiones/imprimirResumen.html', 800, 500, false, false);
  nuevaVentana.webContents.on('did-finish-load', function () {
    nuevaVentana.webContents.send('imprimir-resumen', JSON.stringify(info));
  });
});

const abrirVentana = (direccion, altura = 700, ancho = 1200, reinicio = false, show = true, maximo = false) => {
  nuevaVentana = new BrowserWindow({
    height: altura,
    width: ancho,
    modal: true,
    parent: ventanaPrincipal,
    show: show,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  nuevaVentana.loadFile(path.join(__dirname, `${direccion}`));
  nuevaVentana.setMenuBarVisibility(false);
  maximo && nuevaVentana.maximize()

  nuevaVentana.on('close', async () => {
    if (reinicio) {
      ventanaPrincipal.reload()
    }
  })
  // nuevaVentana.setMenuBarVisibility(false);
}

ipcMain.on('informacion-a-ventana', (e, args) => {
  ventanaPrincipal.webContents.send('informacion-a-ventana', JSON.stringify(args));
});

ipcMain.on('informacion-a-ventana-principal', (e, args) => {
  ventanaPrincipal.webContents.send('informacion-a-ventana-principal', JSON.stringify(args));
});

//mostramos en menu que se hace con el click derecho
ipcMain.on('mostrar-menu', (e, { ventana, x, y }) => {

  e.preventDefault();
  mostrarMenu(ventana, x, y);

});

ipcMain.handle('saveDialog', async (e, args) => {
  const path = (await dialog.showSaveDialog()).filePath;
  return path
});

//Servicio
ipcMain.on('imprimir_servicio', (e, servicio) => {
  abrirVentana('servicioTecnico/impresion.html', 500, 500, false, true);
  nuevaVentana.webContents.on('did-finish-load', () => {
    nuevaVentana.webContents.send('recibir_servicio_impresion', servicio);
  });
});

//Servicio
const hacerMenu = () => {
  //Hacemos el menu

  const template = [
    {
      label: "Datos",
      submenu: [
        {
          label: "Numeros",
          click() {
            ventanaPrincipal.webContents.send('verificarUsuario', 'numeros');
          }
        },
        {
          label: "Provedores",
          submenu: [
            {
              label: "Lista Provedores",
              click() {
                ventanaPrincipal.webContents.loadFile('src/provedores/listaProvedores.html');
              }
            },
            {
              label: "Saldo de Provedores",
              click() {
                ventanaPrincipal.webContents.send('verificarUsuario', 'movVendedores');

              }
            },
            {
              label: "Emitir Pago",
              click() {
                ventanaPrincipal.webContents.send('verificarUsuario', 'movVendedores');

              }
            }
          ]
        },
        {
          label: "Marca",
          click() {
            abrirVentana("marcas/marcas.html", 600, 900)
          }
        },
        {
          label: "Rubros",
          click() {
            abrirVentana("rubros/rubros.html", 600, 900)
          }
        },
        {
          label: "Vendedores",
          submenu: [
            {
              label: "Informacion Vendedores",
              click() {
                ventanaPrincipal.webContents.send('verificarUsuario', 'infoVendedores');
              }
            },
            {
              label: "Movimiento Vendedores",
              click() {
                ventanaPrincipal.webContents.send('verificarUsuario', 'movVendedores');

              }
            }
          ]
        },
        {
          label: "Cuentas",
          click() {
            abrirVentana("cuentas/cuentas.html", 500, 550)
          }
        },
        {
          label: condIva === "Inscripto" ? "Libro Ventas" : "Alicuotas",
          click() {
            if (condIva === "Inscripto") {
              ventanaPrincipal.webContents.send('libroIva');
            } else {
              abrirVentana("alicuotas/alicuotas.html", 400, 500);
            }
          }
        },
        {
          label: "Imprimir Venta",
          click() {
            ventanaPrincipal.webContents.send('poner-numero');
          }
        }
      ]
    },
    {
      label: "Productos",
      submenu: [
        {
          label: "Agregar Producto",
          click() {
            abrirVentana("productos/agregarProducto.html", 650, 900)
          }
        },
        {
          label: "Aumento Por Marcas",
          click() {
            abrirVentana('productos/marcas.html', 300, 500, true);
          }
        },
        {
          label: "Aumento Por Provedores",
          click() {
            abrirVentana('productos/aumentoPorProvedor.html', 300, 500, true);
          }
        },
        {
          label: "Cambio de precio por lista",
          click() {
            abrirVentana('productos/cambioPrecioLista.html', 500, 500, false, true, true);
          },
        },
        {
          label: "Cambio de Producto",
          click() {
            abrirVentana("productos/cambio.html", 750, 900)
          }
        },
        {
          label: "Listado de Nro Series",
          click() {
            ventanaPrincipal.loadFile('src/serie/listado.html');
          }
        },
        {
          label: "Lista de Precios",
          click() {
            abrirVentana('productos/listaPrecios.html', 1000, 1000)
          }
        },
        {
          label: "Modificar Codigo",
          click() {
            abrirVentana("productos/modificarCodigo.html", 500, 500)
          }
        }

      ]
    },
    {
      label: "Clientes",
      submenu: [
        // {
        //   label:"Agregar Cliente",
        //   click(){
        //     abrirVentana("clientes/agregarCliente.html",1200,900);
        //   }
        // },
        {
          label: "Listado Saldos",
          click() {
            abrirVentana("clientes/listadoSaldo.html", 800, 1200)
          }
        },
        {
          label: "Arreglar Saldo",
          click() {
            abrirVentana("clientes/arreglarSaldo.html", 500, 600)
          }
        }
      ]
    },
    {
      label: "Pedidos",
      click() {
        ventanaPrincipal.loadFile('src/pedidos/pedidos.html')
      }
    },
    {
      label: "Servicio Tecnico",
      click() {
        ventanaPrincipal.loadFile('src/servicioTecnico/servicio.html')
      }
    },
    {
      label: "Iluminacion",
      submenu: [
        {
          label: 'Ver Prestamos',
          click() {
            ventanaPrincipal.loadFile('src/prestamos/prestamos.html')
          }
        },
        {
          label: 'Ver Productos',
          click() {
            ventanaPrincipal.loadFile('src/productosIluminacion/productos.html');
          }
        }
      ]
    },
    {
      label: "Configuracion",
      submenu: [
        {
          label: 'Configuracion Sistema',
          click() {
            abrirVentana('configuracion/configuracion.html', 700, 700, false)
          }
        },
        {
          label: 'Modulos',
          click() {
            ventanaPrincipal.webContents.send('configuracionModulos');
          }
        }
      ]
    },
    {
      label: "tools",
      accelerator: process.platform == "darwin" ? "Comand+D" : "Ctrl+D",
      click(item, focusedWindow) {
        focusedWindow.toggleDevTools();
      }
    }
  ];

  // for (let elem of template) {
  //   if (elem.label === 'Clientes' && !modulos.cliente) {
  //     template.splice(template.indexOf(elem), 1);
  //   };
  // }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};