const mongoose = require('mongoose');

const uri = "mongodb://127.0.0.1/gestion";

mongoose.connect(uri,{
    useUnifiedTopology:true,
    useNewUrlParser:true,
    useFindAndModify:false
});

const conection = mongoose.connection;

conection.once('open',()=>{
    console.log("Base de datos conectada")
})