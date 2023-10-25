const { dialog, app, BrowserWindow,Menu } = require('electron');
const { ipcMain } = require('electron/main');
const path = require('path');
const {condIva} = require('./configuracion.json')

var isDev = process.env.APP_DEV ? (process.env.APP_DEV.trim() == "true") : false;


// Lo usamos para cuando alla un cambio en la aplicacion se reinicie
if (process.env.NODE_ENV !== 'production') {
  require('electron-reload')(__dirname, {
      electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
  })
};

if (require('electron-squirrel-startup')) {
  app.quit();
}

let ventanaPrincipal;
const createWindow = () => {
  // Create the browser window.
   ventanaPrincipal = new BrowserWindow({
    webPreferences:{
      nodeIntegration:true,
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

ipcMain.on('enviar',(e,args)=>{
  ventanaPrincipal.webContents.send('recibir',JSON.stringify(args));
});

ipcMain.on('sacar-cierre',e=>{
  ventanaPrincipal.setClosable(false);
});

ipcMain.on('poner-cierre',e=>{
  ventanaPrincipal.setClosable(true);
});

//Si necesitamos mandar informacion de una ventana secundaria a una principal usamos este metodo
ipcMain.on('send-ventanaPrincipal',(e,args)=>{
  ventanaPrincipal.webContents.send('informacion',args);
});

ipcMain.on('abrir-ventana',(e,args)=>{
  abrirVentana(args.path,args.altura,args.ancho,args.reinicio);
  nuevaVentana.on('ready-to-show',async()=>{
    nuevaVentana.webContents.send('informacion',args)
  })
});

ipcMain.on('enviar-ventana-principal',(e,args)=>{
  ventanaPrincipal.webContents.send('recibir-ventana-secundaria',JSON.stringify(args));
});

ipcMain.on('imprimir',(e,args)=>{
  if (args[0] === "blanco") {
    abrirVentana("ticket/ticket.html",800,500);
  }else{
    abrirVentana("impresiones/imprimirComprobante.html",800,500);
  }
  nuevaVentana.webContents.on('did-finish-load',function() {
    nuevaVentana.webContents.send('imprimir',JSON.stringify(args));
  });
});

ipcMain.on('imprimir-recibo',(e,args)=>{

  abrirVentana("impresiones/imprimirRecibo.html",800,500);
  nuevaVentana.webContents.on('did-finish-load',function() {
    nuevaVentana.webContents.send('imprimir-recibo',JSON.stringify(args));
  })
})

ipcMain.on('imprimir-ventana',(e,args)=>{
  const option = {};
  option.silent = false;
  option.deviceName = args === "blanco" && "SAM4S GIANT-100";
  nuevaVentana.webContents.print(option,(success,errorType)=>{
    if (success) {
      ventanaPrincipal.focus();
      nuevaVentana.close();
    }else{
      ventanaPrincipal.focus();
      nuevaVentana && nuevaVentana.close();
    };
  });
});

let nuevaVentana;
const abrirVentana = (direccion,altura = 700,ancho = 1200,reinicio = false)=>{
  nuevaVentana = new BrowserWindow({
    height: altura,
    width: ancho,
    modal:true,
    parent:ventanaPrincipal,
    show:false,
    webPreferences:{
      nodeIntegration: true,
      contextIsolation:false
    }
  });
  nuevaVentana.loadFile(path.join(__dirname, `${direccion}`));
  nuevaVentana.setMenuBarVisibility(false);

  nuevaVentana.on('ready-to-show',()=>{
    // if (direccion !== "ticket/ticket.html" && direccion !== "impresiones/imprimirComprobante.html") {
      nuevaVentana.show();
    // }
  })

  nuevaVentana.on('close',async()=>{
    if (reinicio) {
      ventanaPrincipal.reload()
    }
  })
  // nuevaVentana.setMenuBarVisibility(false);
}

ipcMain.on('informacion-a-ventana',(e,args)=>{
  ventanaPrincipal.webContents.send('informacion-a-ventana',JSON.stringify(args));
});

ipcMain.on('informacion-a-ventana-principal',(e,args)=>{
  ventanaPrincipal.webContents.send('informacion-a-ventana-principal',JSON.stringify(args));
});

ipcMain.handle('saveDialog',async(e,args)=>{
  const path = (await dialog.showSaveDialog()).filePath;
  return path
});

const hacerMenu = () => {
  //Hacemos el menu

  const template = [
    {
      label: "Datos",
      submenu:[
        {
          label:"Numeros",
          click(){
            abrirVentana("numeros/numeros.html",750,700)
          }
        },
        {
          label:"Rubros",
          click(){
            abrirVentana("rubros/rubros.html",600,900)
          }
        },
        {
          label:"Vendedores",
          submenu:[
            {
              label:"Informacion Vendedores",
              click(){
                abrirVentana("vendedores/vendedores.html",600,800);
              }
            },
            {
              label:"Movimiento Vendedores",
                click(){
                  abrirVentana("vendedores/movimientoVendedores.html",600,1100);
                }
            }
          ]
        },
        {
          label: condIva === "Inscripto" ? "Libro Ventas" :"Alicuotas",
          click(){
            if (condIva === "Inscripto") {
              ventanaPrincipal.webContents.send('libroIva');
            }else{
              abrirVentana("alicuotas/alicuotas.html",400,500);
            }
          }          
        },
        {
          label:"Imprimir Venta",
          click(){
            ventanaPrincipal.webContents.send('poner-numero');
          }
        }
      ]
    },
    {
      label: "Productos",
      submenu:[
        {
          label:"Modificar Codigo",
          click(){
            abrirVentana("productos/modificarCodigo.html",500,500)
          }
        },
        {
          label:"Agregar Producto",
          click(){
            abrirVentana("productos/agregarProducto.html",650,900)
          }
        },
        {
          label:"Cambio de Producto",
          click(){
            abrirVentana("productos/cambio.html",750,900)
          }
        },
        {
          label:"Aumento Por Marcas",
          click(){
            abrirVentana('productos/marcas.html',300,500,true);
          }
        },
        {
          label:"Aumento Por Provedores",
          click(){
            abrirVentana('productos/aumentoPorProvedor.html',300,500,true);
          }
        },
        {
          label:"Lista de Precios",
          click(){
            abrirVentana('productos/listaPrecios.html',1000,1000)
          }
        }
      ]
    },
    {
      label:"Clientes",
      submenu:[
        // {
        //   label:"Agregar Cliente",
        //   click(){
        //     abrirVentana("clientes/agregarCliente.html",1200,900);
        //   }
        // },
        {
          label:"Listado Saldos",
          click(){
            abrirVentana("clientes/listadoSaldo.html",1000,1200)
          }
        },
        {
          label:"Arreglar Saldo",
          click(){
            abrirVentana("clientes/arreglarSaldo.html",500,600)
          }
        }
      ]
    },
    {
      label:"Pedidos",
      click(){
        ventanaPrincipal.loadFile('src/pedidos/pedidos.html')
      }
    },
    {
      label:"Servicio Tecnico",
      click(){
        ventanaPrincipal.loadFile('src/servicioTecnico/servicio.html')
      }
    },
    {
      label:"Configuracion",
      click(){
        abrirVentana('configuracion/configuracion.html',700,700,false)
      }
    },
    {
      label:"tools",
      accelerator: process.platform == "darwin" ? "Comand+D" : "Ctrl+D",
      click(item,focusedWindow){
        focusedWindow.toggleDevTools(); 
      }
    }

  ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}