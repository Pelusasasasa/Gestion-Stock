const mongoose = require('mongoose');
const seedTipoCuenta = require('./models/seedDataBase');
const runSeeders = require('./seed');

const uri = "mongodb://127.0.0.1/gestion";

mongoose.connect(uri)
        .then(() => seedTipoCuenta())
        .then(() => runSeeders());

const conection = mongoose.connection;

conection.once('open',()=>{
    console.log("Base de datos conectada en el puerto 4000")
});