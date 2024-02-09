const historicaCTRL = {};

const Historica = require('../models/cuentaCorrHisto');

historicaCTRL.cargarHistorica = async(req,res)=>{
    const now = new Date();
    req.body.fecha = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();
    try {
        const historica = new Historica(req.body);
        await historica.save();
        console.log(`Historica ${req.body.nro_venta} Guardada al cliente ${req.body.cliente}`);
        res.send(`Historica ${req.body._id} Guardada`);
    } catch (error) {
        res.send(error.errors);
    }
};

historicaCTRL.traerHistoricaPorCliente = async(req,res)=>{
    const {id} = req.params;
    const historicas = await Historica.find({idCliente:id});
    res.send(historicas);
}

historicaCTRL.traerHistorica = async(req,res)=>{
    const {id} = req.params;
    const historica = await Historica.findOne({nro_venta:id},{_id:0});
    res.send(historica);
}

historicaCTRL.modificarHistorica = async(req,res)=>{
    const {id} = req.params;
    delete req.body._id;
    const historica = await Historica.findOneAndUpdate({_id:id},req.body);
    console.log(`Cuenta Historica numero: ${req.body.nro_venta} Modificado al cliente ${req.body.cliente}` )
    res.send(`historica ${id} modificada`);
};

historicaCTRL.putForClientAndNumber = async(req,res) => {
    const {idCliente,numero} = req.params;
    const modificar = await Historica.findOneAndUpdate({idCliente,nro_venta:numero},req.body);
    console.log(`Se modifico la cuenta historica ${numero} del cliente ${modificar.cliente}`);
    res.send(modificar)
};

module.exports = historicaCTRL;
