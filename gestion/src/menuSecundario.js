const {Menu,MenuItem} = require('electron');

const menuSecundario = new Menu();

const sumarMovientos = new MenuItem({
    label: "Sumar Movimiento",
    async click(){
        ventanaPrincipal.webContents.send('sumarMovimiento');
    }
});

const mostrarMenu = (ventana,x,y) => {
    if(ventana === 'movimientos'){
        if (!menuSecundario.items.find(menu => menu.label === "Sumar Movimiento")) {
            menuSecundario.append(sumarMovientos);
        }
    };

    menuSecundario.popup({window:ventana,x,y:y+5})
};


module.exports = {mostrarMenu};