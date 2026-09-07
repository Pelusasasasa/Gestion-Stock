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

numeroCTRL.actualizarDolar = async (req, res) => {
    try {
        const { Dolar, dolarInstalador } = req.body;
        const updateData = {};
        if (Dolar !== undefined) updateData.Dolar = Dolar;

        if (dolarInstalador !== undefined) updateData.dolarInstalador = dolarInstalador;

        await Numero.findOneAndUpdate({}, { $set: updateData });
        res.status(200).json({
            ok: true,
            msg: 'Dolares modificados'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'No se pudo modificar los dolares'
        });
    }
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