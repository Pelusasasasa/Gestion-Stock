const rubroCTRL = {};

const Rubros = require('../models/Rubro');

rubroCTRL.getsRubros = async(req,res)=>{
    try {
      const { texto } = req.query;
      
      let rubros;

      if(texto){
        const regex = new RegExp(texto, 'i');
        rubros = await Rubros.find({ rubro: regex });
      }else{
        rubros = await Rubros.find();
      }
      
      res.status(200).json({
        ok: true,
        rubros,
      });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener los rubros'
        });
    }
    
};

rubroCTRL.getLastId = async(req,res)=>{
    const ultimoRubro = (await Rubros.find().sort({$natural:-1}).limit(1))[0];
    const id = ultimoRubro ? ultimoRubro.numero + 1 : 1;
    res.send(`${id}`);
}

rubroCTRL.postRubro = async(req,res)=>{
    try {
      const ultimoRubro = await Rubros.findOne().sort({$natural:-1}).limit(1)
      if(ultimoRubro){
        req.body.numero = ultimoRubro.numero + 1;
      }else{
        req.body.numero = 1;
      };

      const rubroRepetido = await Rubros.findOne({ rubro: req.body.rubro.toUpperCase()});


      if(rubroRepetido){
        console.log("a")
        return res.status(400).json({
          ok: false,
          msg: 'El rubro ya existe'
        });
      }
      
      req.body.rubro = (req.body.rubro).toUpperCase();
      const rubro = new Rubros(req.body);
      await rubro.save();


      console.log(`Rubro ${rubro.rubro} Cargado`);
      res.status(200).json({
        ok: true,
        rubro,
    })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        ok: false,
        msg: 'Error al guardar el rubro'
      })
    }
}

rubroCTRL.putRubro = async(req,res)=>{
    const {numero} = req.params;
    req.body.rubro = req.body.rubro.toUpperCase();
    await Rubros.findOneAndUpdate({numero:numero},req.body);
    console.log(`Rubro ${req.body.rubro} Modificado`)
    res.send(`Rubro ${req.body.rubro} Modificado`)
}

rubroCTRL.deleteForId = async(req,res)=>{
    const {id} = req.params;
    await Rubros.findOneAndDelete({_id:id});
    res.send();
}


module.exports = rubroCTRL;

