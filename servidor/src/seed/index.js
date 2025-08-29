const initCliente = require("./initCliente");
const initNumero = require("./initNumero");

const runSeeders = async() => {
    try {
        await initCliente();
    } catch (error) {
        console.error(error)
        console.error('❌ Error al inicializar el cliente por defecto')
    };
    try {
        await initNumero();
    } catch (error) {
        console.error(error)
        console.error('❌ Error al inicializar los numeros por defecto')
    };


};

module.exports = runSeeders