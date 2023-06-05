const historicaCTRL = {};

const Historica = require('../models/cuentaCorrHisto');


historicaCTRL.cargarHistorica = async(req,res)=>{
    const ultimaHistorica = (await Historica.find({},{_id:1}));
    let arreglo  = ultimaHistorica.map((e)=>{
        return e._id
    });
    let id = arreglo.length !== 0 ? Math.max(...arreglo) : 0;
    req.body._id = id + 1; 
    const now = new Date();
    req.body.fecha = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();
    const historica = new Historica(req.body);
    await historica.save();
    console.log(`Historica ${req.body.nro_venta} Guardada al cliente ${req.body.cliente}`);
    res.send(`Historica ${req.body._id} Guardada`);
};

historicaCTRL.traerHistoricaPorCliente = async(req,res)=>{
    const {id} = req.params;
    const historicas = await Historica.find({idCliente:id});
    res.send(historicas);
}

historicaCTRL.traerHistorica = async(req,res)=>{
    const {id} = req.params;
    const historica = await Historica.find({nro_venta:id});
    res.send(historica[0]);
}

historicaCTRL.modificarHistorica = async(req,res)=>{
    const {id} = req.params;
    delete req.body._id;
    const historica = await Historica.findOneAndUpdate({_id:id},req.body);
    console.log(`Ceunta Historica numero: ${req.body.nro_venta} Modificado al cliente ${req.body.cliente}` )
    res.send(`historica ${id} modificada`);
};

module.exports = historicaCTRL;
