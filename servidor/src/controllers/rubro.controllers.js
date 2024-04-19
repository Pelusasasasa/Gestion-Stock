const rubroCTRL = {};

const Rubros = require('../models/Rubro');

rubroCTRL.getsRubros = async (req, res) => {

    const rubros = await Rubros.find();
    res.send(rubros);

};

rubroCTRL.getLastNumero = async (req, res) => {

    const ultimoRubro = (await Rubros.find().sort({$natural:-1}).limit(1))[0];
    const id = ultimoRubro ? ultimoRubro.numero : 0;
    res.send(`${id}`);

};

rubroCTRL.getsRubro = async (req, res) => {
    const {numero} = req.params;
    const rubro = await Rubros.findOne({numero: numero})
    res.send(rubro);

};

rubroCTRL.postRubro = async (req, res) => {
    req.body.rubro = (req.body.rubro).toUpperCase();
    
    const rubro = new Rubros(req.body);
    await rubro.save();
    
    res.send(`Rubro ${rubro.rubro} Cargado con exito`);
};

rubroCTRL.putRubro = async(req,res)=>{
    const {numero} = req.params;
    req.body.rubro = req.body.rubro.toUpperCase();
    await Rubros.findOneAndUpdate({numero:numero},req.body);
    console.log(`Rubro ${req.body.rubro} Modificado`)
    res.send(`Rubro ${req.body.rubro} Modificado`)
}

rubroCTRL.deleteForId = async(req,res)=>{
    const {numero} = req.params;
    const rubro = await Rubros.findOneAndDelete({numero:numero});
    res.send(`Rubro ${rubro.rubro} Eliminado con exito`);
};


module.exports = rubroCTRL;

