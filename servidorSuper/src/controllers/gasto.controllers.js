const gastoCTRL = {};

const Gasto = require('../models/Gasto');

gastoCTRL.post = async(req,res)=>{
    const now = new Date();
    req.body.fecha = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();
    const gasto = new Gasto(req.body);
    await gasto.save();
    console.log(`Gasto ${req.body.descripcion} con el importe de ${gasto.importe} Cagrgado`);
    res.send(`Gasto ${req.body.descripcion} con el importe de ${gasto.importe} Cagrgado`);
}

gastoCTRL.forDay = async(req,res)=>{
    const {fecha} = req.params;
    let diaSiguiente = fecha + "T23:59:59";
    const gastos = await Gasto.find({
        $and: [
            {fecha: {$gte: new Date(fecha)}},
            {fecha: {$lte: new Date(diaSiguiente)}}
          ]
    });
    res.send(gastos)
}

gastoCTRL.forMonth = async(req,res)=>{
    const {month} = req.params;
    let mes = parseFloat(month);
    mes = mes>12 ? 1 : mes;
    let hoy = new Date();
    let fechaConMes = new Date(`${hoy.getFullYear()}-${mes}-1`);
    let fechaConMesSig = new Date(`${mes === 12 ? hoy.getFullYear() + 1 : hoy.getFullYear()}-${mes===12 ? 1 : mes + 1}-1`);
    const gastos = await Gasto.find({
        $and:[
            {fecha:{$gte:fechaConMes}},
            {fecha:{$lte:fechaConMesSig}}
        ]
    });
    res.send(gastos);
}

gastoCTRL.forYear = async(req,res)=>{
    const {anio} = req.params;
    const esteAnio = new Date(anio,0,1,0,0,0);
    const sigAnio = new Date(parseInt(anio)+1,0,1,0,0,0);
    const gastos = await Gasto.find({
        $and:[
            {fecha:{$gte:esteAnio}},
            {fecha:{$lte:sigAnio}}
        ]
    });
    res.send(gastos)
}

gastoCTRL.getBetweenDates = async(req,res)=>{
    const {desde,hasta} = req.paramas;
    const gastos = await Gasto.find(
       {$and:[
            {fecha:{$gte:desde}},
            {fecha:{$lte:hasta}}
        ]}
    )
    console.log(gastos)
    res.send(gastos);
}

gastoCTRL.deleteForId = async(req,res)=>{
    const {id} = req.params;
    console.log(id)
    await Gasto.findOneAndDelete({_id:id});
    console.log(`Venta con el id ${id} fue eliminada`);
    res.send(`Venta con el id ${id} fue eliminada`);
};

module.exports = gastoCTRL;