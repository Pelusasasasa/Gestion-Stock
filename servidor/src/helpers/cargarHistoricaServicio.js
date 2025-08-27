const ServicioHistorial = require("../models/ServicioHistorial");

exports.cargarHistoricaServicio = async(equipos, numero) => {

    if(equipos.length === 0) return true;

    const historial = [];

    try {
        for(let equipo of equipos){
            const historica = {
                numero,
                estado: equipo.estado,
                equipo: equipo.equipo,
                fecha: new Date()
            };

            const historicaCargado = new ServicioHistorial(historica);
            await historicaCargado.save();

            historial.push(historicaCargado);
        };

        return historial;
    } catch (error) {
        console.log(error);
        return false;
    };
};