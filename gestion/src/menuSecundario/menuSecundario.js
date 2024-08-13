const { MenuItem, Menu } = require("electron");

const menuSecundario = new Menu();

const cambiarObservacion = new MenuItem({
    label: 'Cambiar Observacion',
    click: () => {
        ventanaPrincipal.webContents.send('cambiarObservacion');
    }
});

const mostrarMenu = (ventana, x, y) => {

    if(ventana === "VerPrestamos"){
        if (!menuSecundario.items.find(menu => menu.label === "Cambiar Observacion")){
            menuSecundario.append(cambiarObservacion);
        };
    };

    menuSecundario.popup({window:ventanaPrincipal,x,y:y+5})
};

module.exports = {mostrarMenu};