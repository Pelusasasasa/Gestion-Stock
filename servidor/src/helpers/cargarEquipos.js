const EquipoServicio = require("../models/EquipoServicio");

const {cargarHistoricaServicio} = require('./cargarHistoricaServicio');
const { crearMovimientoVendedores } = require("./crearMovimientoVendedores");

exports.cargarEquipos = async(equipos = [], numero) => {
    const nuevosEquipos = [];

    if(equipos.length === 0) return true;

    try {
        for(let equipo of equipos){
            equipo.numero = numero;
            const equipoCargado = new EquipoServicio(equipo);
            await equipoCargado.save();

            nuevosEquipos.push(equipoCargado);
        };

        return nuevosEquipos;
    } catch (error) {
        console.log(error);
        return false;
    }
};


//Modificamos los equipos que estan cargados y si vienen nuevos lo que hacemos es cargarlos por primera vez
exports.modificarEquipos = async(equipos, numero) => {
    let equiposModificados = [];
    try {
        const equiposCargados = await EquipoServicio.find({numero: numero});
        
        for(let equipo of equipos){
            let index = equiposCargados.findIndex(equipoCargado => equipoCargado._id == equipo._id);

            if(index === -1){
                equipo.numero = numero;
                const equipoNuevo = new EquipoServicio(equipo);
                await equipoNuevo.save();
                equiposModificados.push(equipoNuevo);

                await cargarHistoricaServicio([equipoNuevo], numero);
            }else{
                const equipoActualizado = await EquipoServicio.updateOne(
                    {_id: equipo._id},
                    {$set: equipo}
                );

                if(equipoActualizado.modifiedCount > 0){
                    await cargarHistoricaServicio([equipo], numero);
                }

                equiposModificados.push(equipo);
            };
        };

        for(let equipo of equiposCargados){
            const equipoAux = equiposModificados.find(elem => elem._id == equipo._id);

            if(!equipoAux){
                equipo.estado = 'Eliminado'
                await EquipoServicio.findByIdAndDelete(equipo._id);
                await cargarHistoricaServicio([equipo], numero)
            };
        };

        return equiposModificados;

    } catch (error) {
        console.log(error);
        return false;
    }

};