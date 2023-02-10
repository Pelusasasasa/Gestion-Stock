const presupuestoCTRL = {};

const funcion = require('../assets/js/pdf');
const Presupuesto = require('../models/Presupuesto');

presupuestoCTRL.post = async(req,res)=>{
    const now = new Date();
    req.body.fecha = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();
    const presupuesto = new Presupuesto(req.body);
    await presupuesto.save();
    if (req.body.F) {
        funcion.crearPDF(req.body);//creamos un pdf con la venta
    }
    console.log(`Presupuesto ${req.body.numero} cargado a las ${req.body.fecha}`);
    res.send();
};

presupuestoCTRL.get = async(req,res)=>{
    const presupuestos = await Presupuesto.find();
    res.send(presupuestos);
};//Poner en rutas

presupuestoCTRL.getForNumber = async(req,res)=>{
    const {number} = req.params;
    const presupuesto = await Presupuesto.findOne({numero:number});
    res.send(presupuesto)
};

presupuestoCTRL.getForDay = async(req,res)=>{
    const {day} = req.params;
    let fecha = day.split('-',3);
    let inicioDia = new Date(day + "T00:00:00.000Z");
    let finDia = new Date(day + "T23:59:59.000Z");
    const presupuestos = await Presupuesto.find({
        $and:[
            {fecha:{$gte:inicioDia}},
            {fecha:{$lte:finDia}}
        ]
    });
    res.send(presupuestos);
};

presupuestoCTRL.getForMonth = async(req,res)=>{
    const {month} = req.params;
    let now = new Date();
    let inicioMes = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    let finMes = new Date(now.getTime() - now.getTimezoneOffset() * 60000);

    inicioMes.setMonth(month - 1,1);
    finMes.setMonth(month,1);
    inicioMes.setHours(-3,0,0,0);
    finMes.setHours(-3,0,0,0);

    const presupuestos = await Presupuesto.find({
        $and:[
            {fecha:{$gte:inicioMes}},
            {fecha:{$lt:finMes}}
        ]
    });
    res.send(presupuestos);
};

presupuestoCTRL.getForYear = async(req,res)=>{
    const {year} = req.params;
    let now = new Date();
    let inicioAño = new Date(year,0,1,-3,0,0);
    let finAño = new Date(year,11,31,20,59,59);
    const presupuestos = await Presupuesto.find({
        $and:[
            {fecha:{$gte:inicioAño}},
            {fecha:{$lte:finAño}}
        ]
    });
    res.send(presupuestos);
};

presupuestoCTRL.deleteForId = async(req,res)=>{
    const {day} = req.params;
};


module.exports = presupuestoCTRL;