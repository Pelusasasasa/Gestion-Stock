const { app, BrowserWindow,Menu } = require('electron');
const { ipcMain } = require('electron/main');
const { ipcRenderer } = require('electron/renderer');
const path = require('path');
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

ipcMain.on('abrir-ventana',(e,args)=>{
  abrirVentana(args.path,args.altura,args.ancho,args.reinicio)
  nuevaVentana.on('ready-to-show',async()=>{
    nuevaVentana.webContents.send('informacion',args)
  })
});

ipcMain.on('enviar-ventana-principal',(e,args)=>{
  ventanaPrincipal.webContents.send('recibir-ventana-secundaria',JSON.stringify(args));
});

ipcMain.on('imprimir',(e,args)=>{
  abrirVentana("ticket/ticket.html",800,500);
  nuevaVentana.webContents.on('did-finish-load',function() {
    nuevaVentana.webContents.send('imprimir',JSON.stringify(args));
  });
});

ipcMain.on('imprimir-ventana',(e,args)=>{
  nuevaVentana.webContents.print({silent:true},(success,errorType)=>{
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
    if (direccion !== "ticket/ticket.html") {
      nuevaVentana.show();
    }
  })

  nuevaVentana.on('close',async()=>{
    console.log(reinicio)
    if (direccion === "./clientes/agregarCliente.html" || direccion === "./productos/agregarProducto.html" || reinicio) {
      ventanaPrincipal.reload()
    }
  })
  // nuevaVentana.setMenuBarVisibility(false);
}

ipcMain.on('informacion-a-ventana',(e,args)=>{
  ventanaPrincipal.webContents.send('informacion-a-ventana',JSON.stringify(args));
})

const hacerMenu = () => {
  //Hacemos el menu

  const template = [
    {
      label: "Datos",
      submenu:[
        {
          label:"Numeros",
          click(){
<<<<<<< HEAD
            abrirVentana("numeros/numeros.html",700,400)
=======
            abrirVentana("numeros/numeros.html",500,700)
>>>>>>> frontend
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
          click(){
            abrirVentana("vendedores/vendedores.html",600,500);
          }
        },
        {
          label:"Alicuotas",
          click(){
            abrirVentana("alicuotas/alicuotas.html",400,500);
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
          label:"Agregar Producto",
          click(){
            abrirVentana("productos/agregarProducto.html",650,900)
          }
        },
        {
          label:"Cambio de Producto",
          click(){
            abrirVentana("productos/cambio.html",650,900)
          }
        },
        {
          label:"Aumento Por Marcas",
          click(){
            abrirVentana('productos/marcas.html',300,500,true);
          }
        },
      ]
    },
    {
      label:"Clientes",
      submenu:[
        {
          label:"Agregar Cliente",
          click(){
            abrirVentana("clientes/agregarCliente.html",1200,900);
          }
        },
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
        abrirVentana('configuracion/configuracion.html',500,500,false)
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