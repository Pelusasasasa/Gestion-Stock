const cuentaCTRL = {};
const Cuenta = require('../models/Cuenta');

cuentaCTRL.getCuentas = async (req, res) => {
    const cuentas = await Cuenta.find();
    res.send(cuentas);
};

cuentaCTRL.postCuenta = async (req, res) => {
    const cuenta = new Cuenta(req.body);
    await cuenta.save();

    res.send(`Cuenta ${cuenta.cuenta} creado`);
};

cuentaCTRL.deleteCuenta = async (req, res) => {
    const {id} = req.params;
    console.log(id)
    const cuenta = await Cuenta.findOneAndDelete({idCuenta: id})
    res.send(cuenta);
};
module.exports = cuentaCTRL;