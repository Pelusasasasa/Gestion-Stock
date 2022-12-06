const numeroCTRL = {};

const Numero = require('../models/Numero');

numeroCTRL.traerNumeros = async(req,res)=>{
    const numeros = (await Numero.find())[0];
    res.send(numeros);
};

numeroCTRL.gargarNumeros = async(req,res)=>{
    const numero = new Numero(req.body);
    await numero.save();
    res.send("Numeros guardados");
}

numeroCTRL.modificarNumeros = async(req,res)=>{
    await Numero.findOneAndUpdate({_id:req.body._id},req.body);
    res.send(`Numeros Modificados`);
};

numeroCTRL.traerNumero = async(req,res)=>{
    const {numero} = req.params;
    const numeros = await Numero.findOne();
    res.send(`${numeros[numero]}`);
}

numeroCTRL.modificarNumero = async(req,res)=>{
    const {numero} = req.params;
    const numeros = (await Numero.find())[0];
    numeros[numero] = req.body[numero];
    await Numero.findOneAndUpdate({_id:numeros._id},numeros);
    console.log("Numero Modificado")
    res.send(`Numero del tipo ${numero} Modificado`);
}

module.exports = numeroCTRL;