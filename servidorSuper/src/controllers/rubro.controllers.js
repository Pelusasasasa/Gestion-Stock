const rubroCTRL = {};

const Rubros = require('../models/Rubro');

rubroCTRL.getsRubros = async(req,res)=>{
    const rubros = await Rubros.find();
    res.send(rubros);
};

rubroCTRL.getLastId = async(req,res)=>{
    const ultimoRubro = (await Rubros.find().sort({$natural:-1}).limit(1))[0];
    const id = ultimoRubro ? ultimoRubro.numero + 1 : 1;
    res.send(`${id}`);
}

rubroCTRL.postRubro = async(req,res)=>{
    req.body.rubro = (req.body.rubro).toUpperCase();
    const rubro = new Rubros(req.body);
    await rubro.save();
    console.log(`Rubro ${rubro.rubro} Cargado`);
    res.send(`Rubro ${rubro.rubro} Cargado`);
}

rubroCTRL.putRubro = async(req,res)=>{
    const {numero} = req.params;
    req.body.rubro = req.body.rubro.toUpperCase();
    await Rubros.findOneAndUpdate({numero:numero},req.body);
    console.log(`Rubro ${req.body.rubro} Modificado`)
    res.send(`Rubro ${req.body.rubro} Modificado`)
}


module.exports = rubroCTRL;

