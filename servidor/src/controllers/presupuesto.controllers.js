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
}

module.exports = presupuestoCTRL;