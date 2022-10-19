const reciboCTRL = {};

const Recibo = require('../models/Recibo');


reciboCTRL.cargarRecibo = async(req,res)=>{
    const nuevoRecibo = new Recibo(req.body);
    await nuevoRecibo.save();
    res.send(`Recibo ${req.body.numero} cargado`)
}

reciboCTRL.recibosDia = async(req,res)=>{
    const {fecha} = req.params;
    const iniciodia = new Date(fecha + "T00:00:00.000Z");
    const findia = new Date(fecha + "T23:59:59.999Z");
    const recibos = await Recibo.find({
        $and:[
            {fecha:{$gte:iniciodia}},
            {fecha:{$lte:findia}}
        ]
    })
    res.send(recibos);
};

reciboCTRL.recibosMes = async(req,res)=>{
    const {fecha} = req.params;
    let mes = parseFloat(fecha);
    let hoy = new Date();
    mes = mes>12 ? 1 : mes;

    let fechaConMes = new Date(`${hoy.getFullYear()}-${mes}-1`)
    let fechaConMesSig = new Date(`${hoy.getFullYear()}-${mes === 12 ? 1 : mes + 1}-1`);
    const recibos = await Recibo.find({
        $and:[
            {fecha:{$gte:fechaConMes}},
            {fecha:{$lte:fechaConMesSig}}
        ]
    });
    res.send(recibos);
};

reciboCTRL.recibosAnio = async(req,res)=>{
    const {fecha} = req.params;
    const hoy = new Date();
    const esteAnio = new Date(`${fecha}-1-1`);
    const anioSig = new Date(`${parseFloat(fecha) + 1}-1-1`);
    const recibos = await Recibo.find({
        $and:[
            {fecha:{$gte:esteAnio}},
            {fecha:{$lte:anioSig}}
        ]
    });
    res.send(recibos);
}

module.exports = reciboCTRL;