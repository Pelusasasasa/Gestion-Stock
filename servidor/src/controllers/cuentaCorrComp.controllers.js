const compensadaCTRL = {};

const CuentaCompensada = require('../models/cuentaCorrComp');

compensadaCTRL.crearCompensda = async(req,res)=>{
    const ultimaCompensada = (await CuentaCompensada.find({},{_id:1}));
    let arreglo = ultimaCompensada.map((e)=>{
        return e._id
    });
    let id = arreglo.length !== 0 ?  Math.max(...arreglo) : 0;
    req.body._id = id + 1; 
    const now = new Date();
    req.body.fecha = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();
    const nuevaCompensada = new CuentaCompensada(req.body);
    await nuevaCompensada.save();
    console.log(`Compensdad ${req.body.nro_venta} creada al cliente ${req.body.cliente}`)
    res.send(`Compensdad ${req.body._id} creada`);
}

compensadaCTRL.traerPorCliente = async(req,res)=>{
    const {id} = req.params;
    const compensadas = await CuentaCompensada.find({$and:[{idCliente:id},{saldo:{$not:{$eq:0}}}]});
    res.send(compensadas);
};

compensadaCTRL.traerCompensada = async(req,res)=>{
    const {id} = req.params;
    const compensada = (await CuentaCompensada.find({nro_venta:id}))[0];
    res.send(compensada); 
};

compensadaCTRL.modificarCompensada = async(req,res)=>{
    const {id} = req.params;
    delete req.body._id;
    const compensada = await CuentaCompensada.findOneAndUpdate({nro_venta:id},req.body);
    console.log(`Compensada ${id} Modificada del cliente ${req.body.cliente}`);
    res.send(`Compensada ${id} Modificada`);
}

compensadaCTRL.eliminarCuenta = async(req,res)=>{
    const {id} = req.params;
    const compensada = await CuentaCompensada.findOneAndRemove({nro_venta:id});
    res.send(compensada);
};

compensadaCTRL.cambiarObservaciones = async(req,res) => {
    const {numero} = req.params;
    if (numero) {
        await CuentaCompensada.findOneAndUpdate({nro_venta:numero},{$set: {observaciones: req.body.observaciones}});
    }
    res.send('OK');
};

module.exports = compensadaCTRL;